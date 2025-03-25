const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const joi = require("joi");
const userValidation = require("../validations/user.validation");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const emaiService = require("../services/emai.service");

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
    } = value;
    const random = uuid.v4();
    const otp = `http://localhost:3000/api/users/activate/${random}`;
    await emaiService.sendEmail(email, otp);
    const hashed_password = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, is_active, bookmarks, interests, otp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,

      [
        first_name,
        last_name,
        email,
        hashed_password,
        role,
        is_active,
        bookmarks,
        interests,
        random,
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

    res.status(200).send({ message: "Akkaunt faollashdi" });
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
  activateUser,
};
