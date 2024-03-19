const httpStatus = require("http-status");
const SectionService = require("../services/Sections");

//index, create, update, deleteSection

class Section {
  index(req, res) {
    if (!req.params.projectId) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: " Proje Bilgisi Eksik!" });
    }
    SectionService.list({ project_id: req.params.projectId })
      .then((response) => {
        return res.status(httpStatus.OK).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  create(req, res) {
    req.body.user_id = req.user._id;
    SectionService.create(req.body)
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
    SectionService.update(req.params?.id, req.body)
      .then((response) => {
        return res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ msg: "kayıt sırasında bir problem oluştu", e });
      });
  }

  removeSection(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "id bilgisi eksiktir" });
    }
    SectionService.delete(req.params.id).then((deletedSection) => {
      if (deletedSection) {
        return res.status(httpStatus.OK).send({ msg: "Section Silinmiştir!" });
      } else {
        return res.status(httpStatus.NOT_FOUND).send({ msg: "Böyle bir section bulunamamıştır" });
      }
    });
  }
}

module.exports = new Section();
