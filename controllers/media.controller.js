const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const { news_id, media_type, media_url, uploaded_at } = req.body;
    const newLang = await pool.query(
      `INSERT INTO media (news_id, media_type, media_url, uploaded_at) VALUES ($1, $2, $3, $4) RETURNING *`,
      [news_id, media_type, media_url, uploaded_at],
    );

    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", lang: newLang.rows[0] });

    logger.info("Log yaratildi");
  } catch (error) {
    logger.error(error.message);
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const langs = await pool.query(`SELECT * FROM media`);

    res.status(200).send(langs.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = await pool.query(`SELECT * FROM media WHERE id=$1`, [id]);

    if (lang.rows.length === 0) {
      return res.status(404).send({ message: "Til topilmadi" });
    }

    res.status(200).send(lang.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { news_id, media_type, media_url, uploaded_at } = req.body;

    const lang = await pool.query(
      `UPDATE media SET news_id=$1, media_type=$2, media_url=$3, uploaded_at=$4 WHERE id=$5 RETURNING *`,
      [news_id, media_type, media_url, uploaded_at, id],
    );

    if (lang.rows.length === 0) {
      return res.status(404).send({ message: "Til topilmadi" });
    }

    res.status(200).send({ message: "Til yangilandi", lang: lang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const lang = await pool.query(`DELETE FROM media WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (lang.rows.length === 0) {
      return res.status(404).send({ message: "Til topilmadi" });
    }

    res.status(200).send({ message: "Til o'chirildi", lang: lang.rows[0] });
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
