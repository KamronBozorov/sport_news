const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const { news_id, user_id, liked_at } = req.body;
    const newLike = await pool.query(
      `INSERT INTO likes (news_id, user_id, liked_at) VALUES ($1, $2, $3) RETURNING *`,
      [news_id, user_id, liked_at],
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
    const { news_id, user_id, liked_at } = req.body;

    const like = await pool.query(
      `UPDATE likes SET news_id=$1, user_id=$2, liked_at=$3 WHERE id=$4 RETURNING *`,
      [news_id, user_id, liked_at, id],
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
