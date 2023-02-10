import { BoxDocument, BoxInput } from "../model/box";
import {
  GAME_MIN_GRADE_PCT,
  GAME_ACTIVITY_SAMPLE_QUANTITY,
} from "../pre-start/constants";
import { User, UserDocument, UserInput } from "../model/user";
import { stageService } from "./stage";
import { ObjectNotFoundError, ValidationError } from "./errors";
import { moduleService } from "./module";
import { BasicService } from "./utils/basic";
import { Activity, ActivityDocument } from "../model/activity";
import { AuthenticationService } from "./utils/authentication";
import _ from "underscore";
import { ModuleDocument } from "src/model/module";

export enum EvaluationStatus {
  Approved,
  Reproved,
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
    let module = await moduleService.findHead();
    let head = true;
    user.progress.box = new Map();
    user.progress.available = new Map();

    while (module) {
      user.progress.box.set(
        module.id as string,
        await this.createBox({ module: module.id })
      );
      user.progress.available.set(module._id as string, head)
      if (!module.next) break;
      
      head = false;
      module = await moduleService.find({ by: { _id: module.next } });
    }

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

  /**
   * Checks if a user has passed, and decides the next step of the game
   * for it
   */
  async evaluate(
    id: string,
    module: string,
    answers: Array<Array<boolean>>
  ): Promise<EvaluationStatus> {
    const user = await this.find({
      id,
      select: "progress.box",
    });

    await user.populate([{
      path: "progress.box.$*.activities.activity",
      select: "questionCount",
      model: "Activity",
    }, { 
      path: "progress.box.$*.module", 
      select:"next", 
      model: "Module" 
    }]);

    const box = user.progress.box.get(module);
    if (!box) throw new ObjectNotFoundError({ schema: 'Box' })

    const grade = this.calculateGrade(box, answers);
    if (grade >= GAME_MIN_GRADE_PCT) {
      this.approve(user, module);
      return EvaluationStatus.Approved;
    } else {
      this.reprove(user, module);
      return EvaluationStatus.Reproved;
    }
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
   * Updates the user to approve the current box
   */
  protected async approve(user: UserDocument, module: string) {
    const box = user.progress.box.get(module) as BoxDocument;

    const id = user._id;
    await User.findByIdAndUpdate(id, {
      $push: {
        "progress.history": box,
      },
      $set: {
        [`progress.box.${module}`]: await this.createBox({
          module: module,
        }),
        [`progress.available.${box.module.next as string}`]: true,
      },
    });
  }

  /**
   * Updates the user to reprove the current box
   */
  protected async reprove(user: UserDocument, module: string) {
    const box = user.progress.box.get(module) as BoxDocument;

    await User.findByIdAndUpdate(user._id, {
      $set: {
        [`progress.box.${module}`]: await this.createBox({
          module: module,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attempt: user.progress.box.get(module)!.attempt + 1,
        }),
        [`progress.available.${box.module.next as string}`]: true,
      },
      $push: {
        "progress.history": box,
      },
    });
  }

  /**
   * Returns the current box for all modules.
   */
  async findBox({ id }: { id: string }): Promise<{ 
    available: Map<string, boolean>;
    box: Map<string, BoxDocument>;
  }> {
    const user = await this.find({
      id,
      select: "progress",
    });

    return {
      available: user.progress.available,
      box: user.progress.box
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
        "email guardian relationship birth region comorbidity progress.stage progress.module",
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
