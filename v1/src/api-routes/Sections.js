const express = require("express");
const SectionController = require("../controllers/Section");
const validate = require("../middlewares/validate");
const schemas = require("../validations/Sections");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.route("/:projectId").get(authenticate, SectionController.index);
router.route("/").post(authenticate, validate(schemas.createValidation), SectionController.create);
router.route("/:id").patch(authenticate, validate(schemas.updateValidation), SectionController.update);
router.route("/:id").delete(authenticate, SectionController.removeSection);

module.exports = {
  router,
};
