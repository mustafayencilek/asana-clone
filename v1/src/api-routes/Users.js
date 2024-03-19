const express = require("express");
const UserController = require("../controllers/User");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Users");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", UserController.index);
router.route("/").post(validate(schemas.createValidation), UserController.create);
router.route("/login").post(validate(schemas.loginValidation), UserController.login);
router.route("/projects").get(authenticate, UserController.projectList);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), UserController.resetPassword);
router
  .route("/change-password")
  .post(authenticate, validate(schemas.changePasswordValidation), UserController.changePassword);
router.route("/:id").delete(UserController.removeUser);
router.route("/update-profile-image").post(authenticate, UserController.updateProfileImage);
router.route("/").patch(authenticate, validate(schemas.updateValidation), UserController.update);
module.exports = {
  router,
};
