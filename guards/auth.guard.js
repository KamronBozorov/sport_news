const config = require("config");
const jwt = require("jsonwebtoken");
const errorHandler = require("../helpers/error-handler");

module.exports = function (req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth)
      return res.status(404).send({ message: "Token can not be null" });

    const bearer = auth.split(" ")[0];
    const token = auth.split(" ")[1];

    if (!token || bearer !== "Bearer")
      return res.status(403).send({ error: "Bearer or Token can't be null" });

    const decodedToken = jwt.verify(token, config.get("accessKey"));

    req.user = decodedToken;
    console.log(req.user);
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
