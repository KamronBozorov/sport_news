const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");

const newData = async (req, res) => {
  try {
    const { title, content, summary_news, lang_id } = req.body;
    const newuser = await pool.query(
      `INSERT INTO users (title, content, summary_news, lang_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, summary_news, lang_id],
    );

    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", user: newuser.rows[0] });
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
    const { title, content, summary_news, lang_id } = req.body;

    const user = await pool.query(
      `UPDATE users SET title=$1, content=$2, summary_news=$3, lang_id=$4 WHERE id=$3 RETURNING *`,
      [title, content, summary_news, lang_id, id],
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
};
