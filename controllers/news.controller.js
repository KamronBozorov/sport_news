const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");

const newData = async (req, res) => {
  try {
    const { news_id, category_id, author_id, status, published_at, source } =
      req.body;
    const newnw = await pool.query(
      `INSERT INTO news (news_id, category_id, author_id, status, published_at, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [news_id, category_id, author_id, status, published_at, source],
    );

    res.status(201).send({ message: "Yangi til qo'shildi", nw: newnw.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const news = await pool.query(`SELECT * FROM nws`);

    res.status(200).send(news.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const nw = await pool.query(`SELECT * FROM news WHERE id=$1`, [id]);

    if (nw.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).send(nw.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { news_id, category_id, author_id, status, published_at, source } =
      req.body;

    const nw = await pool.query(
      `UPDATE news SET news_id=$1, category_id=$2, author_id=$3, status=$4, published_at=$5, source=$6  WHERE id=$3 RETURNING *`,
      [news_id, category_id, author_id, status, published_at, source, id],
    );

    if (nw.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi yangilandi", nw: user.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const nw = await pool.query(`DELETE FROM news WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (nw.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi o'chirildi", nw: user.rows[0] });
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
