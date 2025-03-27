const config = require("config");
const jwt = require("jsonwebtoken");

class JwtService {
  constructor(accessKey, accessTime, refreshKey, refreshTime) {
    (this.accessKey = accessKey),
      (this.accessTime = accessTime),
      (this.refreshKey = refreshKey),
      (this.refreshTime = refreshTime);
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }
  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

module.exports = new JwtService(
  config.get("accessKey"),
  config.get("accessTime"),
  config.get("refreshKey"),
  config.get("refreshTime"),
);
