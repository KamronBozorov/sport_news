const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const { user_id, is_approved, is_editor } = req.body;
    const newAuthor = await pool.query(
      `INSERT INTO authors (user_id, is_approved, is_editor) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, is_approved, is_editor],
    );

    res
      .status(201)
      .send({ message: "Author bosildi", like: newAuthor.rows[0] });

    logger.info("Log yaratildi");
  } catch (error) {
    logger.error(error.message);
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const authors = await pool.query(`SELECT * FROM likes`);

    res.status(200).send(authors.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query(`SELECT * FROM authors WHERE id=$1`, [id]);

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }

    res.status(200).send(like.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, is_approved, is_editor } = req.body;

    const like = await pool.query(
      `UPDATE authors SET user_id=$1, is_approved=$2, is_editor=$3 WHERE id=$4 RETURNING *`,
      [user_id, is_approved, is_editor, id],
    );

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }

    res.status(200).send({ message: "Author yangilandi", like: lang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const like = await pool.query(
      `DELETE FROM authors WHERE id=$1 RETURNING *`,
      [id],
    );

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Author topilmadi" });
    }

    res.status(200).send({ message: "Author o'chirildi", like: lang.rows[0] });
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
