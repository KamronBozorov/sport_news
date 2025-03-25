const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");
const logger = require("../services/logger");

const newData = async (req, res) => {
  try {
    const { user_id, news_id, status, created_at } = req.body;
    const newreport = await pool.query(
      `INSERT INTO Reports (user_id, news_id, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, news_id, status, created_at],
    );

    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", report: newreport.rows[0] });

    logger.info("Log yaratildi");
  } catch (error) {
    logger.error(error.message);
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const reports = await pool.query(`SELECT * FROM Reports`);

    res.status(200).send(reports.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await pool.query(`SELECT * FROM Reports WHERE id=$1`, [id]);

    if (report.rows.length === 0) {
      return res.status(404).send({ message: "Report topilmadi" });
    }

    res.status(200).send(report.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, news_id, reason, status, created_at } = req.body;

    const report = await pool.query(
      `UPDATE Reports SET user_id=$1, news_id=$2, reason=$3, status=$4, created_at=$5 WHERE id=$6 RETURNING *`,
      [user_id, news_id, reason, status, created_at, id],
    );

    if (report.rows.length === 0) {
      return res.status(404).send({ message: "Report topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Report yangilandi", report: lang.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await pool.query(
      `DELETE FROM Reports WHERE id=$1 RETURNING *`,
      [id],
    );

    if (report.rows.length === 0) {
      return res.status(404).send({ message: "Report topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Report o'chirildi", report: lang.rows[0] });
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
