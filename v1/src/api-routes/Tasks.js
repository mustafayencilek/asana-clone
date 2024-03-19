const express = require("express");
const TaskController = require("../controllers/Task");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Tasks");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();
router.route("/").get(authenticate, TaskController.index);
router.route("/:id").get(authenticate, TaskController.fetchTask);
router.route("/").post(authenticate, validate(schemas.createValidation), TaskController.create);
router
  .route("/:id/make-comment")
  .post(authenticate, validate(schemas.commentValidation), TaskController.makeComment);
router
  .route("/:id/add-sub-task")
  .post(authenticate, validate(schemas.createValidation), TaskController.addSubTask);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), TaskController.update);
router.route("/:id").delete(authenticate, TaskController.removeTask);
router
  .route("/:id/:commentId")
  .delete(authenticate, validate(schemas.commentValidation), TaskController.deleteComment);

module.exports = {
  router,
};
