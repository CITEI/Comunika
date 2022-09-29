import mongoose from "mongoose";
import { Admin, AdminDocument, AdminInput } from "../model/admin";
import { ROOT_PASSWORD, ROOT_EMAIL, ROOT_NAME } from "../pre-start/constants";
import {
  BadRequestError,
  ObjectNotFoundError,
  UnauthorizedError,
} from "./errors";
import { AuthenticationService } from "./utils/authentication";
import { BasicService } from "./utils/basic";

class AdminService extends BasicService<AdminDocument, AdminInput> {
  public root_id: string;

  constructor() {
    super({ model: Admin });
    this.root_id = "";
    this.createRoot();
  }

  private async createRoot() {
    mongoose.connection.once('open', async () => {
      let doc = undefined;
      if (!(await this.exists({ email: ROOT_EMAIL }))) {
        doc = await this.create({
          name: ROOT_NAME,
          email: ROOT_EMAIL,
          password: ROOT_PASSWORD,
          invitedBy: null,
        });
        this.root_id = doc._id;
      } else doc = await this.find({ by: { email: ROOT_EMAIL } });
      this.root_id = doc._id;
    })
  }

  /**
   * Deletes an admin only if the current admin invited the deleted one or if
   * it is root.
   */
  async delete({ id, admin }: { id: string; admin: string }) {
    if (id != admin) {
      if (
        (await this.exists({ _id: id })) &&
        (await this.exists({ _id: id }))
      ) {
        if (
          this.root_id == admin ||
          (await this.find({ by: { _id: id }, select: "invitedBy" }))
            .invitedBy == admin
        )
          await super.delete({ _id: id });
        else throw new UnauthorizedError();
      } else throw new ObjectNotFoundError({ schema: this.model });
    } else
      throw new BadRequestError({
        fields: [{ name: "id", problem: "invalid" }],
      });
  }
}

export const adminService = new AdminService();

class AdminAuthenticationService extends AuthenticationService<
  AdminDocument,
  AdminInput
> {
  constructor() {
    super({ service: adminService });
  }
}

export const adminAuthenticationService = new AdminAuthenticationService();
