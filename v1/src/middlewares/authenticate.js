const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  //console.log(req.headers);
  const token = authHeader && authHeader.split(" ")[1];
  //console.log(token);
  if (token === null) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ error: "not authorizated" });
  }

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(httpStatus.FORBIDDEN).send({ error: err });
    }
    // console.log(user);
    req.user = user?._doc;

    next();
  });
};

module.exports = authenticateToken;
