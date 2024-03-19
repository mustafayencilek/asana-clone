const Mongoose = require("mongoose");
const logger = require("../scripts/logger/Projects");
const ProjectSchema = new Mongoose.Schema(
  {
    name: String,
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);
// ProjectSchema.pre("save", (next) => {
//   // console.log("öncesi", doc);
//   next();
// });

ProjectSchema.post("save", (doc) => {
  logger.log({ level: "info", message: doc });
});

module.exports = Mongoose.model("project", ProjectSchema);
