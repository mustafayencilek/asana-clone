const BaseService = require("./BaseService");
const BaseModel = require("../models/Users");
class UserService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  loginUser(loginData) {
    return this.BaseModel.findOne(loginData);
  }
}

module.exports = new UserService();
