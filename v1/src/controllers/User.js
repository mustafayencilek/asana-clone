const UserService = require("../services/Users");

const ProjectService = require("../services/Projects");

const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const httpStatus = require("http-status");
const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const path = require("path");

class User {
  create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  login(req, res) {
    req.body.password = passwordToHash(req.body.password);

    UserService.findOne(req.body)
      .then((user) => {
        if (user === null) {
          return res.status(httpStatus.NOT_FOUND).send({ msg: "user not found" });
        } else {
          user = {
            ...user.toObject(),
            tokens: {
              access_token: generateAccessToken(user),
              refresh_token: generateRefreshToken(user),
            },
          };
          delete user.password;

          res.status(httpStatus.OK).send(user);
        }
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      });
  }

  index(req, res) {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  }

  projectList(req, res) {
    ProjectService.list({ user_id: req.user?._id })
      .then((projects) => {
        return res.status(httpStatus.OK).send(projects);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "projeleri getirirken  beklenmedik bir hata oluştu" })
      );
  }

  resetPassword(req, res) {
    const newPassword =
      uuid.v5(new Date().getTime().toString(), process.env.PROJECT_UUID.toString()).split("-")[0] ||
      `usr-${new Date().getTime()}`;
    UserService.updateWhere({ email: req.body.email }, { password: passwordToHash(newPassword) })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(httpStatus.NOT_FOUND).send({ error: "Böyle bir kullanıcı bulunmamaktadır" });
        }

        eventEmitter.emit("send_email", {
          to: updatedUser.email, // list of receivers
          subject: "Şifre Sıfırlama", // Subject line
          html: `Talebiniz üzerine  şifre sıfırlama işleminiz  gerçekleşmiştir. <br/> Giriş yaptıktan sonra  şifrenizi değiştirmeyi unutmayın! <br/> Yeni Şifreniz : <b>${newPassword}</b>`, // html body
        });

        return res.status(httpStatus.OK).send({
          message:
            "Şifre sıfırlama işlemi için sisteme kayıtlı e-posta adresinize gereken bilgiler gönderildi ",
        });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "Şifre resetleme sırasında bir hata oluştu" })
      );
  }

  update(req, res) {
    UserService.update({ _id: req.user?._id }, req.body)
      .then((updatedUser) => {
        return res.status(httpStatus.OK).send(updatedUser);
      })
      .catch((error) => {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Update güncelleme işlemi sırasında bir problem oluştu",
        });
      });
  }

  removeUser(req, res) {
    req.params.id;
    if (!req.params?.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(httpStatus.BAD_REQUEST).send({ msg: "id bilgisi eksiktir" });
    }

    UserService.delete(req.params.id)
      .then((deletedUser) => {
        if (deletedUser) {
          return res.status(httpStatus.OK).send({ msg: "Kullanıcı Silinmiştir!" });
        } else {
          return res.status(httpStatus.NOT_FOUND).send({ msg: "Böyle bir kullanıcı bulunamamıştır" });
        }
      })
      .catch((error) => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ msg: "Silme işlemi sırasında bir hata oluştu", error });
      });
  }

  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.updateWhere({ _id: req.user?._id }, req.body)
      .then((updatedUser) => {
        return res.status(httpStatus.OK).send(updatedUser);
      })
      .catch((error) => {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Update güncelleme işlemi sırasında bir problem oluştu",
        });
      });
  }

  updateProfileImage(req, res) {
    console.log(__dirname);

    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req?.user._id}${extension}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);

    if (!req.files?.profile_image) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ msg: "bu işlemi yapabilmek için yeterli veriye sahip değilsiniz!" });
    }
    req.files.profile_image.mv(folderPath, function (err) {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
      }
      UserService.updateWhere({ _id: req.user._id }, { profile_image: fileName })
        .then((updatedUser) => {
          return res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((error) => {
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: "upload başarılı fakat kayıt sırasında bir problem oluştu" });
        });
    });
  }
}

module.exports = new User();
