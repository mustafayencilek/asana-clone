const httpStatus = require("http-status");
const ProjectService = require("../services/Projects");

class Project {
  index(req, res) {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  create(req, res) {
    req.body.user_id = req.user?._id;
    console.log(req.user);
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  update(req, res) {
    console.log(req.params.id);
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "id bilgisi eksiktir" });
    }

    ProjectService.update(req.params?.id, req.body)
      .then((updatedProject) => {
        return res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          msg: "kayıt sırasında bir problem oluştu",
          e,
        })
      );
  }

  removeProject(req, res) {
    req.params.id;
    console.log(req.params.id);
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "id bilgisi eksiktir" });
    }

    ProjectService.delete(req.params.id)
      .then((deletedProject) => {
        if (deletedProject) {
          return res.status(httpStatus.OK).send({ msg: "Proje Silinmiştir!" });
        } else {
          return res.status(httpStatus.NOT_FOUND).send({ msg: "Böyle bir proje bulunamamıştır" });
        }
      })
      .catch((error) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ msg: "Silme işlemi sırasında bir hata oluştu", error });
      });
  }
}

module.exports = new Project();
