import { BoxDocument, BoxInput, BoxSchema } from "../model/box";
import { Available } from '../model/progress';
import {
  GAME_MIN_GRADE_PCT,
  GAME_ACTIVITY_SAMPLE_QUANTITY,
} from "../pre-start/constants";
import { User, UserDocument, UserInput } from "../model/user";
import { ObjectNotFoundError, ValidationError, BoxNotFoundError } from './errors';
import { moduleService } from "./module";
import { BasicService } from "./utils/basic";
import { AuthenticationService } from "./utils/authentication";
import _ from "underscore";
import { ModuleDocument } from '../model/module';

interface UserModules extends ModuleDocument {
  _doc?: any;
  available?: boolean;
}

class UserService extends BasicService<UserDocument> {
  constructor() {
    super({ model: User });
  }

  /**
   * Creates a new user and initializes it
   */
  async create(payload: UserInput): Promise<UserDocument> {
    const user = new User(payload);
    const modules = await moduleService.findAll();

    user.progress.box = [];
    user.progress.available = [];

    for (const module of modules) {
      user.progress.box.push(
        await this.createBox({ module: module.id })
      );
      user.progress.available.push({
        id: module._id,
        value: false,
      });
    }

    user.progress.available[0].value = true;

    await user.save();
    return user;
  }

  /**
   * Finds an User by its id or email
   */
  async find({
    id,
    email,
    select,
  }: {
    id?: string;
    email?: string;
    select?: string;
  }): Promise<UserDocument> {
    let user;
    if (id)
      user = await super.find({
        by: { _id: id },
        select: select || this.select,
      });
    else
      user = await User.findOne({ email })
        .select(select || this.select)
        .exec();
    if (user) return user;
    throw new ObjectNotFoundError({ schema: User });
  }

  /**
   * Checks if an user exists by its id or email
   */
  async exists({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<boolean> {
    if (id) return super.exists({ _id: id });
    else return (await User.exists({ email }).exec()) == null ? false : true;
  }

  /**
   * Creates a box given a user with defined progress.
   */
  protected async createBox({
    module,
    attempt,
  }: {
    module: string;
    attempt?: number;
  }): Promise<BoxInput> {
    attempt = attempt || 0;
    const alternative = attempt > 0;
    let activities = Array<string>();

    if (attempt <= 1) {
      activities = await moduleService.sampleActivities({
        id: module,
        quantity: GAME_ACTIVITY_SAMPLE_QUANTITY,
        alternative,
      });
    } else if (attempt > 1) {
      const regularQuantity = Math.floor(GAME_ACTIVITY_SAMPLE_QUANTITY / 2);
      const alternativeQuantity =
        GAME_ACTIVITY_SAMPLE_QUANTITY - regularQuantity;

      activities = _.shuffle(
        (
          await moduleService.sampleActivities({
            id: module,
            quantity: regularQuantity,
            alternative: false,
          })
        ).concat(
          await moduleService.sampleActivities({
            id: module,
            quantity: alternativeQuantity,
            alternative: true,
          })
        )
      );
    }

    const box: BoxInput = {
      module: module,
      attempt: attempt,
      activities: activities.map((el: any) => ({ activity: el, answers: [] })),
    };

    return box;
  }

  async findModules(id: string): Promise<UserModules[]> {
    const user: UserDocument = await this.find({
      id,
      select: "progress",
    });

    const modules: UserModules[] = await moduleService.findAll();
    let available = user.progress.available;

    if (modules.length != available.length) {
      const newAvailable: Available[] = [];

      for (const module of modules) {
        const found = available.find(a => a.id == module._id);
        if (!found) newAvailable.push({ id: module._id, value: false });
        else newAvailable.push(found);
      }
    
      available = newAvailable;
    }

    await User.findByIdAndUpdate(user._id, {
      $set: {
        "progress.available": available,
      }
    })

    return modules.map(m => ({ ...m._doc, 
      available: available.find(a => a.id == m._id)!.value
    }));
  }

  /**
   * Checks if a user has passed, and decides the next step of the game
   * for it
   */
  async evaluate(
    id: string,
    module: string,
    answers: Array<Array<boolean>>
  ): Promise<number> {
    const user = await this.find({
      id,
      select: "progress",
    });

    await user.populate([{
      path: "progress.box.activities.activity",
      select: "questionCount",
      model: "Activity",
    }, {
      path: "progress.box.module",
      model: "Module"
    }]);

    const box = user.progress.box.find(e => e.module.id == module);
    if (!box) throw new BoxNotFoundError({ module: module });

    const grade = this.calculateGrade(box, answers);
    const approved = grade >= GAME_MIN_GRADE_PCT;
    const nextModule = await moduleService.findNext(box.module._id);

    if (nextModule) await this.makeNextAvailable(user, box, nextModule);
    await this.createNextBox(user, box, approved);

    return grade;
  }

  /**
   * Updates the available field of the next module in the user's progress
   */
  protected async makeNextAvailable(user: UserDocument, box: BoxDocument, nextModule: ModuleDocument) {
    const next = nextModule._id;
    if (user.progress.available.find(a => a.id == next)!.value == true) return;

    await User.findByIdAndUpdate(user._id, {
      $set: {
        [`progress.available.$[item].value`]: true
      },
    }, {
      arrayFilters: [{ "item.id": next }]
    });
  }

  /**
   * Creates the next box for the user using approved status
   */
  protected async createNextBox(user: UserDocument, box: BoxDocument, approved: boolean) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        [`progress.box.$[item]`]: await this.createBox({
          module: box.module.id,
          attempt: approved ? 0 : box.attempt + 1,
        }),
      },
      $push: {
        "progress.history": box,
      },
    }, {
      arrayFilters: [{ "item.module": box.module._id }]
    });
  }

  /**
   * Calculates the grade of a user box given its answers
   */
  protected calculateGrade(
    box: BoxDocument,
    answers: boolean[][]
  ): number {

    let grade = 0;
    // update box answers
    if (box.activities.length == answers.length) {
      let total = 0;
      let hits = 0;
      answers.forEach((el, i) => {
        const count: number = box.activities[i].activity.questionCount;
        const true_count = el.reduce((acc, cur) => +cur + acc, 0);
        if (el.length <= count && el.length >= 0) {
          box.activities[i].answers = el;
          total += count;
          hits += true_count;
        } else
          throw new ValidationError({
            fields: [{ name: "answers", problem: "invalid" }],
          });
      });
      grade = hits / total;
    } else
      throw new ValidationError({
        fields: [{ name: "answers", problem: "missing" }],
      });
    return grade;
  }

  /**
   * Returns the current box for all modules.
   */
  async findBox({ id, module }: { id: string, module?: string }): Promise<{
    available?: Available[];
    box?: BoxDocument[] | BoxDocument;
  }> {
    let user: UserDocument | null = await this.find({
      id,
      select: "progress",
    });

    if (module) {
      if (!user.progress.box.some(e => e.module._id.toString() === module)) {
        if (!moduleService.exists({ _id: module })) {
          throw new ObjectNotFoundError({ schema: "Module" });
        }
        
        const newBox = await this.createBox({ module: module });
        user.progress.box.push(newBox);

        await User.findByIdAndUpdate(user._id, {
          $push: {
            "progress.box": newBox
          },
        });
      }

      await user.populate([{
        path: "progress.box.activities.activity",
        model: "Activity",
      }]);

      const box = user.progress.box.find(e => e.module._id.toString() === module);
      return { box: box }
    }
    else {
      return {
        available: user.progress.available,
        box: user.progress.box,
      }
    }
  }

  /**
   * Returns the evaluated boxes history
   */
  async findHistory({ id }: { id: string }): Promise<{
    module: string;
    activities: { answers: boolean[]; name: string }[]
  }[]> {
    const user = await this.find({ id, select: "progress.history" });
    await user.populate("progress.history.module", "name");
    await user.populate({
      path: "progress.history.activities.activity",
      model: "Activity",
      select: "name",
    });
    return user.progress.history.map((box) => ({
      module: box.module.name,
      activities: box.activities.map((activity) => ({
        answers: activity.answers,
        name: activity.activity.name,
      })),
    }));
  }

  /**
   * Retrieves non-sensitive userdata
   */
  async findUserData({ id }: { id: string }): Promise<UserDocument> {
    return await this.find({
      id,
      select:
        "email guardian relationship birth region disabilities progress.module",
    });
  }
}

export const userService = new UserService();

class UserAuthenticationService extends AuthenticationService<
  UserDocument,
  UserInput
> {
  constructor() {
    super({ service: userService });
  }
}

export const userAuthenticationService = new UserAuthenticationService();
