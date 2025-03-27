const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const { news_id, tag_id } = req.body;
    const newTag = await pool.query(
      `INSERT INTO news_tags (news_id, tag_id) VALUES ($1, $2) RETURNING *`,
      [news_id, tag_id],
    );

    res.status(201).send({ message: "Tag bosildi", like: newTag.rows[0] });

    logger.info("Log yaratildi");
  } catch (error) {
    logger.error(error.message);
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const news_tags = await pool.query(`SELECT * FROM likes`);

    res.status(200).send(news_tags.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const like = await pool.query(`SELECT * FROM news_tags WHERE id=$1`, [id]);

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }

    res.status(200).send(like.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { news_id, tag_id } = req.body;

    const like = await pool.query(
      `UPDATE news_tags SET news_id=$1, user_id=$2 WHERE id=$3 RETURNING *`,
      [news_id, tag_id, id],
    );

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }

    res.status(200).send({ message: "Tag yangilandi", like: lang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const like = await pool.query(
      `DELETE FROM news_tags WHERE id=$1 RETURNING *`,
      [id],
    );

    if (like.rows.length === 0) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }

    res.status(200).send({ message: "Tag o'chirildi", like: lang.rows[0] });
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
