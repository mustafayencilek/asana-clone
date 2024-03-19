const httpStatus = require("http-status");
const TaskService = require("../services/Tasks");

class Task {
  index(req, res) {
    if (!req.body.projectId) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: " Proje Bilgisi Eksik!" });
    }
    TaskService.list({ project_id: req.body.projectId })
      .then((response) => {
        return res.status(httpStatus.OK).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  create(req, res) {
    req.body.user_id = req.user._id;
    TaskService.create(req.body)
      .then((response) => {
        return res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  update(req, res) {
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "id bilgisi eksiktir" });
    }
    TaskService.update(req.params?.id, req.body)
      .then((response) => {
        return res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "kayıt sırasında bir problem oluştu", e });
      });
  }

  removeTask(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "id bilgisi eksiktir" });
    }
    TaskService.delete(req.params.id).then((deletedSection) => {
      if (deletedSection) {
        return res.status(httpStatus.OK).send({ msg: "Section Silinmiştir!" });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "Böyle bir section bulunamamıştır" });
      }
    });
  }

  makeComment(req, res) {
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res.status(httpStatus.NOT_FOUND).send("Böyle bir kayıt bulunmamaktadır");
        }
        const comment = { ...req.body, commented_at: new Date(), user_id: req.user };
        mainTask.comments.push(comment);
        mainTask.save().then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        });
      })
      .catch((e) => {
        return res.status(httpStatus.NOT_FOUND).send("kayıt sırasında bir problem oluştu");
      })
      .catch((e) => {
        return res.status(httpStatus.NOT_FOUND).send("kayıt sırasında bir problem oluştu");
      });
  }

  deleteComment(req, res) {
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res.status(httpStatus.NOT_FOUND).send("Böyle bir kayıt bulunmamaktadır");
        }
        const comment = { ...req.body, commented_at: new Date(), user_id: req.user };
        mainTask.comments = mainTask.comments.filter((c) => {
          console.log(c._id.toString());
          return c._id != req.params.commentId;
        });
        mainTask.save().then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        });
      })
      .catch((e) => {
        return res.status(httpStatus.NOT_FOUND).send("kayıt sırasında bir problem oluştu");
      })
      .catch((e) => {
        return res.status(httpStatus.NOT_FOUND).send("kayıt sırasında bir problem oluştu");
      });
  }

  addSubTask(req, res) {
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "ID Bilgisi Gerekli..." });
    }
    TaskService.findOne({ _id: req.params.id })
      .then((mainTask) => {
        if (!mainTask) {
          return res.status(httpStatus.NOT_FOUND).send("Böyle bir kayıt bulunmamaktadır");
        }

        TaskService.create({ ...req.body, user_id: req.user })
          .then((subTask) => {
            console.log(subTask);

            mainTask.sub_tasks.push(subTask);
            mainTask.save().then((updatedDoc) => {
              return res.status(httpStatus.OK).send(updatedDoc);
            });
          })
          .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
          });
      })
      .catch((e) => {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "kayıt sırasında bir problem oluştu", e });
      });
  }

  fetchTask(req, res) {
    if (!req.params.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "ID Bilgisi Gerekli..." });
    }
    TaskService.findOne({ _id: req.params.id }, true)
      .then((task) => {
        if (!task) {
          return res.status(httpStatus.NOT_FOUND).send("Böyle bir kayıt bulunmamaktadır");
        }
        res.status(httpStatus.OK).send(task);
      })
      .catch((e) => {
        return res.status(httpStatus.NOT_FOUND).send("kayıt sırasında bir problem oluştu");
      });
  }
}

module.exports = new Task();
