const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newLike = await pool.query(
      `INSERT INTO likes (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description],
    );

    res.status(201).send({ message: "Like bosildi", like: newLike.rows[0] });

    logger.info("Log yaratildi");
  } catch (error) {
    logger.error(error.message);
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const likes = await pool.query(`SELECT * FROM likes`);

    res.status(200).send(likes.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query(`SELECT * FROM likes WHERE id=$1`, [id]);

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Like topilmadi" });
    }

    res.status(200).send(like.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const like = await pool.query(
      `UPDATE likes SET name=$1, descripton=$2 WHERE id=$3 RETURNING *`,
      [name, description, id],
    );

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Like topilmadi" });
    }

    res.status(200).send({ message: "Like yangilandi", like: lang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const like = await pool.query(`DELETE FROM likes WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Like topilmadi" });
    }

    res.status(200).send({ message: "Like o'chirildi", like: lang.rows[0] });
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
