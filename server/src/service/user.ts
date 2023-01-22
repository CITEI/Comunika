import { BoxDocument, BoxInput } from "../model/box";
import {
  GAME_MIN_GRADE_PCT,
  GAME_ACTIVITY_SAMPLE_QUANTITY,
} from "../pre-start/constants";
import {
  User,
  UserDocument,
  UserInput,
  UserProgressInput,
} from "../model/user";
import { stageService } from "./stage";
import {
  ObjectNotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";
import { moduleService } from "./module";
import { BasicService } from "./utils/basic";
import { Activity, ActivityDocument } from "../model/activity";
import { AuthenticationService } from "./utils/authentication";
import _ from "underscore";
import { ModuleDocument } from "src/model/module";
import { StageDocument } from "src/model/stage";
import { hashPassword } from "../model/utils";

export enum EvaluationStatus {
  Approved,
  Reproved,
}

export interface answerProps {
  answer: number;
  description: string;
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
    user.progress.module = await moduleService.findHead();
    user.progress.stage = await stageService.findHead({
      module: user.progress.module,
    });
    user.progress.box = await this.createBox({
      stage: user.progress.stage,
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
   * Finds an Users progress
   */
  async findAllUsersProgress(): Promise<any> {
    const data = await User.find({}, "comorbidity birth region progress");

    if (data) {
      return data;
    }
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
   * Creates a box given a user with defined progress.stage
   */
  protected async createBox({
    stage,
    attempt,
  }: {
    stage: string;
    attempt?: number;
  }): Promise<BoxInput> {
    attempt = attempt || 0;
    const alternative = attempt > 0;
    let activities = Array<string>();

    if (attempt <= 1) {
      activities = await stageService.sampleActivities({
        id: stage,
        quantity: GAME_ACTIVITY_SAMPLE_QUANTITY,
        alternative,
      });
    } else if (attempt > 1) {
      const regularQuantity = Math.floor(GAME_ACTIVITY_SAMPLE_QUANTITY / 2);
      const alternativeQuantity =
        GAME_ACTIVITY_SAMPLE_QUANTITY - regularQuantity;

      activities = _.shuffle(
        (
          await stageService.sampleActivities({
            id: stage,
            quantity: regularQuantity,
            alternative: false,
          })
        ).concat(
          await stageService.sampleActivities({
            id: stage,
            quantity: alternativeQuantity,
            alternative: true,
          })
        )
      );
    }

    const box: BoxInput = {
      stage: stage,
      attempt: attempt,
      activities: activities.map((el: any) => ({ activity: el, answers: [] })),
    };

    return box;
  }

  /**
   * Calculates the grade of a user box given its answers
   */
  protected async calculateGrade(
    user: UserDocument,
    answers: answerProps[][]
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
        const count: number =
          user.progress.box.activities[i].activity.questionCount;
        const true_count = el.reduce((acc, cur) => +cur.answer + acc, 0);

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
    await User.findByIdAndUpdate(id, {
      $set: {
        "progress.box": null,
      },
      $push: {
        "progress.history": user.progress.box,
      },
    });
  }

  /**
   * Updates the user to reprove the current box
   */
  protected async reprove(user: UserDocument) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        "progress.box": await this.createBox({
          stage: user.progress.stage,
          attempt: user.progress.box.attempt + 1,
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
    answers: answerProps[][];
  }): Promise<EvaluationStatus> {
    const user = await this.find({
      id,
      select: "progress.box progress.stage progress.module",
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
  async findBox({ id }: { id: string }): Promise<{
    activities?: ActivityDocument[];
    attempt?: number;
    stage: StageDocument;
    module: ModuleDocument;
  }> {
    const user = await this.find({
      id,
      select: "progress.box progress.module progress.stage",
    });

    let box = user.progress.box;
    if (box == null) {
      // reach the end of the game in that moment

      let nextStage = await stageService.findNext({ id: user.progress.stage });
      let nextModule: ModuleDocument | null = user.progress.module;
      if (!nextStage) {
        // reached the last stage of a module

        nextModule = await moduleService.findNext({
          id: user.progress.module,
        });
        if (nextModule)
          // if next module, get its first stage
          nextStage = await stageService.findHead({
            module: nextModule,
          });
      }

      if (nextStage) {
        box = await this.createBox({ stage: nextStage._id });
        await User.findByIdAndUpdate(id, {
          $set: {
            "progress.module": nextModule,
            "progress.stage": nextStage,
            "progress.box": box,
          },
        });
      }
    }

    if (box) {
      await user.populate({
        path: "progress.box.activities.activity",
        model: Activity,
      });
      return {
        activities: user.progress.box.activities.map((el) => el.activity),
        attempt: user.progress.box.attempt,
        stage: user.progress.stage,
        module: user.progress.module,
      };
    } else
      return {
        stage: user.progress.stage,
        module: user.progress.module,
      };
  }

  /**
   * Returns the evaluated boxes history
   */
  async findHistory({
    id,
  }: {
    id: string;
  }): Promise<
    { stage: string; activities: { answers: answerProps[]; name: string }[] }[]
  > {
    const user = await this.find({ id, select: "progress.history" });
    await user.populate("progress.history.stage", "name");
    await user.populate({
      path: "progress.history.activities.activity",
      model: "Activity",
      select: "name",
    });
    return user.progress.history.map((box) => ({
      stage: box.stage.name,
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

  async findAndResetPass({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<true | null> {
    try {
      await User.findOneAndUpdate(
        { email },
        { password: await hashPassword(password) },
        {
          new: true,
        }
      );
      return true;
    } catch (e) {
      throw new UnauthorizedError();
    }
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
