const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const {
      user_id,
      news_id,
      content,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes,
    } = req.body;
    const newcomment = await pool.query(
      `INSERT INTO comments (user_id, news_id, content, reply_comment_id, is_approved, is_deleted, views, likes) VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        user_id,
        news_id,
        content,
        reply_comment_id,
        is_approved,
        is_deleted,
        views,
        likes,
      ],
    );

    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", comment: newcomment.rows[0] });

    logger.info("Log yaratildi");
  } catch (error) {
    logger.error(error.message);
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const comments = await pool.query(`SELECT * FROM comments`);

    res.status(200).send(comments.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await pool.query(`SELECT * FROM comments WHERE id=$1`, [
      id,
    ]);

    if (comment.rows.length === 0) {
      return res.status(404).send({ message: "Comment topilmadi" });
    }

    res.status(200).send(comment.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      news_id,
      content,
      reply_comment_id,
      is_approved,
      is_deleted,
      views,
      likes,
    } = req.body;

    const comment = await pool.query(
      `UPDATE comments SET user_id=$1, news_id=$2, content=$3, reply_comment_id=$3, is_approved=$4, is_deleted=$5, views=$6, likes=$7 WHERE id=$8 RETURNING *`,
      [
        user_id,
        news_id,
        content,
        reply_comment_id,
        is_approved,
        is_deleted,
        views,
        likes,
        id,
      ],
    );

    if (comment.rows.length === 0) {
      return res.status(404).send({ message: "Comment topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Comment yangilandi", comment: lang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await pool.query(
      `DELETE FROM comments WHERE id=$1 RETURNING *`,
      [id],
    );

    if (comment.rows.length === 0) {
      return res.status(404).send({ message: "Comment topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Comment o'chirildi", comment: lang.rows[0] });
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
