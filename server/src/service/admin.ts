import { Admin, AdminDocument, AdminInput } from "src/model/admin/admin";
import { ROOT_PASSWORD, ROOT_EMAIL, ROOT_NAME } from "src/pre-start/constants";
import { AuthenticationService } from "./utils/authentication";
import { BasicService } from "./utils/basic";

class AdminService extends BasicService<AdminDocument, AdminInput> {
  constructor() {
    super({ model: Admin });
    this.createRoot()
  }

  private async createRoot() {
    if (await this.model.count() == 0) {
      this.model.create({
        name: ROOT_NAME,
        email: ROOT_EMAIL,
        password: ROOT_PASSWORD,
      })
    }
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
