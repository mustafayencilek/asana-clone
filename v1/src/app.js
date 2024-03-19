const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const { ProjectRoutes, UserRoutes, SectionRoutes, TaskRoutes } = require("./api-routes");
const loaders = require("./loaders");
const events = require("./scripts/events");
const path = require("path");

config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log("Sunucu Ayağa Kalktı.." + process.env.APP_PORT);
  app.use("/users", UserRoutes.router);
  app.use("/projects", ProjectRoutes.router);

  app.use("/sections", SectionRoutes.router);
  app.use("/tasks", TaskRoutes.router);
});
