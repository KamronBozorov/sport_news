const otpGenerator = require("otp-generator");
const config = require("config");
const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const userValidation = require("../validations/user.validation");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const emaiService = require("../services/emai.service");
const jwtService = require("../services/jwt.service");

const newData = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      bookmarks,
      interests,
      phone_number,
    } = value;

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    await emaiService.sendEmail(email, otp);
    const hashed_password = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, is_active, bookmarks, interests, phone_number, otp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,

      [
        first_name,
        last_name,
        email,
        hashed_password,
        role,
        is_active,
        bookmarks,
        interests,
        phone_number,
        otp,
      ],
    );

    res
      .status(201)
      .send({ message: "Aktivatsiya kodi emailingizga yuborildi!" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateUser = async (req, res) => {
  try {
    const link = req.params.otp;
    const user = await pool.query("SELECT * FROM users WHERE otp=$1", [link]);

    if (user.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    await pool.query("UPDATE users SET is_active=$1, otp=$2 WHERE otp=$3", [
      true,
      "",
      link,
    ]);
    const payload = {
      sub: user.rows[0].id,
      role: user.rows[0].role,
      is_active: user.rows[0].is_active,
    };

    const tokens = jwtService.generateTokens(payload);

    await pool.query("UPDATE users SET refresh_token=$1", [
      tokens.refreshToken,
    ]);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxage: config.get("CookieTime"),
      httponly: true,
    });

    res.cookie("accessToken", tokens.refreshToken, {
      maxage: config.get("CookieTime"),
      httponly: true,
      secure: process.env.node_env === "production",
      samesite: "strict",
    });

    res.status(200).send({ message: "Akkaunt faollashdi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    if (!email || !password)
      return res
        .status(400)
        .send({ message: "iltimos, email va parolni to'gri kiriting!" });

    const userdata = await pool.query(`select * from users where email=$1`, [
      email,
    ]);
    console.log(userdata.rows[0]);
    if (!userdata)
      return res
        .status(401)
        .send({ message: "iltimos, email va parolni to'gri kiriting!" });

    const isvalidpassword = await bcrypt.compare(
      password,
      userdata.rows[0].password,
    );

    if (!isvalidpassword)
      return res
        .status(401)
        .send({ message: "iltimos, email va parolni to'g'ri kiriting!" });

    const payload = {
      sub: userdata.rows[0].id,
      role: userdata.rows[0].role,
      is_active: userdata.rows[0].is_active,
    };

    const tokens = jwtService.generateTokens(payload);

    await pool.query("UPDATE users SET refresh_token=$1", [
      tokens.refreshToken,
    ]);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxage: config.get("CookieTime"),
      httponly: true,
    });

    res.cookie("accessToken", tokens.refreshToken, {
      maxage: config.get("CookieTime"),
      httponly: true,
      secure: process.env.node_env === "production",
      samesite: "strict",
    });

    res.status(200).send({
      message: "muvaffaqiyatli kirish!",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logout = async (req, res) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie)
      return res
        .status(401)
        .send({ message: "Autentifikatsiya talab qilinadi!" });

    let token = {};
    cookie.split("; ").forEach((cook) => {
      const key = cook.split("=")[0];
      token[key] = cook.split("=")[1];
    });

    const refreshToken = token.refreshToken;
    const accessToken = token.accessToken;

    if (!refreshToken)
      return res
        .status(401)
        .send({ message: "Autentifikatsiya talab qilinadi!" });

    const userData = await pool.query(
      `SELECT * FROM users WHERE refresh_token=$1`,
      [refreshToken],
    );

    if (!userData)
      return res.status(401).send({ message: "Foydalanuvchi topilmadi" });

    userData.rows[0].refresh_token = "";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).send({
      message: "Muvaffaqiyatli chiqish qilindi!",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie)
      return res
        .status(401)
        .send({ message: "Autentifikatsiya talab qilinadi!" });

    let token = {};
    cookie.split("; ").forEach((cook) => {
      const key = cook.split("=")[0];
      token[key] = cook.split("=")[1];
    });

    const refreshToken = token.refreshToken;
    const accessToken = token.accessToken;

    if (!refreshToken)
      return res
        .status(401)
        .send({ message: "Autentifikatsiya talab qilinadi!" });

    const userData = await pool.query(
      `SELECT * FROM users WHERE refresh_token=$1`,
      [refreshToken],
    );

    if (!userData)
      return res.status(401).send({ message: "Foydalanuvchi topilmadi" });

    const payload = {
      sub: userData.rows[0].id,
      role: userData.rows[0].role,
      is_active: userData.rows[0].is_active,
    };

    const tokens = jwtService.generateTokens(payload);

    await pool.query("UPDATE users SET refresh_token=$1", [
      tokens.refreshToken,
    ]);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxage: config.get("CookieTime"),
      httponly: true,
    });

    res.cookie("accessToken", tokens.refreshToken, {
      maxage: config.get("CookieTime"),
      httponly: true,
      secure: process.env.node_env === "production",
      samesite: "strict",
    });

    res.status(200).send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const users = await pool.query(`SELECT * FROM users`);

    res.status(200).send(users.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

    if (user.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).send(user.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      password,
      role,
      is_active,
      bookmarks,
      interests,
      phone_number,
    } = req.body;

    const user = await pool.query(
      `UPDATE users SET name=$1, code=$2 WHERE id=$3 RETURNING *`,
      [
        first_name,
        last_name,
        email,
        password,
        role,
        is_active,
        bookmarks,
        interests,
        phone_number,
        id,
      ],
    );

    if (user.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi yangilandi", user: user.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi o'chirildi", user: user.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  newData,
  getAllData,
  getDataByid,
  updateData,
  deleteData,
  login,
  logout,
  activateUser,
  refreshToken,
};
