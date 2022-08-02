import { BoxDocument, BoxInput } from "../model/game/box";
import {
  GAME_MIN_GRADE_PCT,
  GAME_ACTIVITY_SAMPLE_QUANTITY,
} from "../pre-start/constants";
import { User, UserDocument, UserInput } from "../model/game/user";
import { categoryService } from "./category";
import {
  InternalServerError,
  ObjectNotFoundError,
  ValidationError,
} from "./errors";
import { stageService } from "./stage";
import { BasicService } from "./utils/basic";
import { Activity } from "../model/game/activity";
import { AuthenticationService } from "./utils/authentication";

export enum EvaluationStatus {
  Approved,
  Reproved,
  NoContent,
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
    user.progress.stage = await stageService.findHead();
    user.progress.category = await categoryService.findHead({
      stage: user.progress.stage,
    });
    user.progress.box = await this.createBox({
      category: user.progress.category,
    });
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
   * Creates a box given a user with defined progress.category
   */
  protected async createBox({
    category,
  }: {
    category: string;
  }): Promise<BoxInput> {
    const box: BoxInput = {
      category: category,
      activities: (
        await categoryService.sampleActivities({
          id: category,
          quantity: GAME_ACTIVITY_SAMPLE_QUANTITY,
        })
      ).map((el: any) => ({ activity: el, answers: [] })),
    };

    return box;
  }

  /**
   * Calculates the grade of a user box given its answers
   */
  protected async calculateGrade(
    user: UserDocument,
    answers: boolean[][]
  ): Promise<number> {
    let grade = 0;
    // update box answers
    if (user.progress.box.activities.length == answers.length) {
      // get total answers
      await user.populate({
        path: "progress.box.activities.activity",
        select: "questionCount",
        model: "Activity",
      });
      let total = 0;
      let hits = 0;
      answers.forEach((el, i) => {
        let count: number = user.progress.box.activities[i].activity.questionCount;
        let true_count = el.reduce((acc, cur) => +cur + acc, 0);
        if (el.length <= count && el.length >= 0) {
          user.progress.box.activities[i].answers = el;
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
  protected async approve(user: UserDocument) {
    const id = user._id;
    let nextStage = user.progress.stage;
    let nextCategory = await categoryService.findNext({
      id: user.progress.category,
    });

    if (!nextCategory) {
      // reached the last category of a stage
      nextStage = await stageService.findNext({ id: nextStage });
      if (!nextStage) {
        // if no stage, reached the end of the game
        await User.findByIdAndUpdate(id, {
          $set: {
            "progress.stage": user.progress.stage,
            "progress.category": null,
            "progress.box": null,
          },
          $push: {
            "progress.history": user.progress.box,
          },
        });
        return EvaluationStatus.NoContent;
      } else
        nextCategory = await categoryService.findHead({ stage: nextStage });
    }

    if (nextCategory) {
      await User.findByIdAndUpdate(id, {
        $set: {
          "progress.stage": nextStage,
          "progress.category": nextCategory,
          "progress.box": await this.createBox({
            category: nextCategory._id,
          }),
        },
        $push: {
          "progress.history": user.progress.box,
        },
      });
    }
    // stage without categories
    else throw new InternalServerError();
  }

  /**
   * Updates the user to reprove the current box
   */
  protected async reprove(user: UserDocument) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        "progress.box": await this.createBox({
          category: user.progress.category,
        }),
      },
      $push: { "progress.history": user.progress.box },
    });
  }

  /**
   * Checks if a user has passed, and decides the next step of the game
   * for it
   */
  async evaluate({
    id,
    answers,
  }: {
    id: string;
    answers: Array<Array<boolean>>;
  }): Promise<EvaluationStatus> {
    const user = await this.find({
      id,
      select: "progress.box progress.category progress.stage",
    });
    const grade = await this.calculateGrade(user, answers);
    if (grade >= GAME_MIN_GRADE_PCT) {
      this.approve(user);
      return EvaluationStatus.Approved;
    } else {
      this.reprove(user);
      return EvaluationStatus.Reproved;
    }
  }

  /**
   * Returns the current box
   */
  async findBox({ id }: { id: string }): Promise<BoxDocument | null> {
    const user = await this.find({ id, select: "progress.box progress.stage" });
    let box = user.progress.box;
    if (box == null) {
      const nextStage = await stageService.findNext({
        id: user.progress.stage,
      });
      if (nextStage) {
        const nextCategory = await categoryService.findHead({
          stage: nextStage,
        });
        box = await this.createBox({ category: nextCategory!._id });
        await User.findByIdAndUpdate(id, {
          $set: {
            "progress.stage": nextStage,
            "progress.category": nextCategory,
            "progress.box": box,
          },
        });
      }
    }
    if (box) {
      await user.populate({ path: "progress.box.activities.activity", model: Activity });
      return user.progress.box;
    }
    return box;
  }

  /**
   * Returns the evaluated boxes history
   */
  async findHistory({
    id,
  }: {
    id: string;
  }): Promise<
    { category: string; activities: { answers: boolean[]; name: string }[] }[]
  > {
    const user = await this.find({ id, select: "progress.history" });
    await user.populate("progress.history.category", "name");
    await user.populate({
      path: "progress.history.activities.activity",
      model: "Activity",
      select: "name",
    });
    return user.progress.history.map((box) => ({
      category: box.category.name,
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
      select: "email name progress.category progress.stage",
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
