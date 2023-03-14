import { BoxDocument } from "../model/box";
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
import e from "express";

export interface UserModules {
  id: string;
  name: string;
  imageAlt: string;
  image: string;
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
  }): Promise<BoxDocument> {
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

    const box: BoxDocument = {
      module: module,
      attempt: attempt,
      createdAt: new Date(),
      activities: activities.map((el: any) => ({ activity: el, answers: [] })),
    };

    return box;
  }

  /**
   * Returns all modules and their availability for a user
   */
  async findModules(id: string): Promise<UserModules[]> {
    const user: UserDocument = await this.find({
      id,
      select: "progress",
    });

    const modules = await moduleService.findAll();

    return modules.map(module => {
      let available;

      if (!module.previous) available = true;
      else {
        const box = user.progress.box.get(module.previous._id);
        available = box ? box.done : false;
      }

      return {
        id: module.id,
        name: module.name,
        imageAlt: module.imageAlt,
        image: module.image,
        available: available,
      };
    });
  }

  /**
   * Evaluates users result, creates a new box and marks the module as done.
   */
  async evaluate(
    id: string,
    module: string,
    answers: Array<Array<boolean | string>>
  ): Promise<number> {
    const user = await this.find({
      id,
      select: "progress",
    });

    await user.populate([{
      path: `progress.box.${module}.data.activities.activity`,
      select: "questionCount",
      model: "Activity",
    }, {
      path: `progress.box.${module}.data.module`,
      select: "id",
      model: "Module"
    }]);

    const box = user.progress.box.get(module);
    if (!box) throw new BoxNotFoundError({ module: module });

    const grade = this.calculateGrade(box.data, answers);
    const approved = grade >= GAME_MIN_GRADE_PCT;
    const newBox = await this.createBox({
      module: box.data.module.id,
      attempt: approved ? 0 : box.data.attempt + 1
    });

    box.data.completedAt = new Date();

    await User.findByIdAndUpdate(user._id, {
      $set: {
        [`progress.box.${module}`]: {
          done: true,
          data: newBox
        }
      },
      $push: {
        [`progress.history`]: box.data
      }
    });

    return grade;
  }

  /**
   * Calculates the grade of a user box given its answers
   */
  protected calculateGrade(
    box: BoxDocument,
    answers: Array<Array<boolean | string>>
  ): number {
    let grade = 0;
    // update box answers
    if (box.activities.length == answers.length) {
      let total = 0;
      let hits = 0;
      answers.forEach((el, i) => {
        const count: number = box.activities[i].activity.questionCount;
        // If there's a string in there it will be considered as true
        const elWithString = el;
        el = el.map(i => typeof i == 'string' ? true : i);
        const true_count = el.reduce((acc, cur) => +cur + acc, 0);
        if (el.length <= count && el.length >= 0) {
          box.activities[i].answers = elWithString;
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
   * Finds a box for a user, creating it if it doesn't exist
   */
  async findBox({ id, module }: { id: string, module: string }): Promise<
    BoxDocument
  > {
    const user: UserDocument | null = await this.find({
      id,
      select: "progress",
    });

    // Check if the box ins't yet created
    if (!user.progress.box.get(module)) {
      const newBox = await this.createBox({ module: module });
      // This is necessary because the call to populate below woudn't work otherwise
      user.progress.box.set(module, {done: false, data: newBox});

      await User.findByIdAndUpdate(user._id, {
        $set: {
          [`progress.box.${module}`]: { done: false, data: newBox }
        },
      });
    }

    await user.populate([{
      path: `progress.box.${module}.data.activities.activity`,
      model: "Activity",
    }]);

    const box = user.progress.box.get(module);
    return box!.data;
  }

  /**
   * Returns the evaluated boxes history
   */
  async findHistory({ id }: { id: string }): Promise<{
    module: string;
    activities: { answers: (boolean | string)[]; name: string }[]
  }[]> {
    const user = await this.find({ id, select: "progress.history" });
    await user.populate("progress.history.module", "name");
    await user.populate({
      path: "progress.history.activities.activity",
      model: "Activity",
      select: "name",
    });
    return user.progress.history.map((box) => ({
      createdAt: box.createdAt,
      completedAt: box.completedAt,
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
        "createdAt updatedAt email guardian relationship birth region disabilities progress.module",
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
