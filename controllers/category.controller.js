const pool = require("../config/db");
const errorHandler = require("../helpers/error-handler");

const newData = async (req, res) => {
  try {
    const { category_name, descripton, parent_id } = req.body;
    const newcategory = await pool.query(
      `INSERT INTO category (category_name, descripton, parent_id) VALUES ($1, $2, $3) RETURNING *`,
      [category_name, descripton, parent_id],
    );

    res
      .status(201)
      .send({ message: "Yangi til qo'shildi", category: newcategory.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllData = async (req, res) => {
  try {
    const category = await pool.query(`SELECT * FROM categorys`);

    res.status(200).send(category.rows); // Send `rows` instead of entire response
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDataByid = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await pool.query(`SELECT * FROM category WHERE id=$1`, [
      id,
    ]);

    if (category.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res.status(200).send(category.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, descripton, parent_id } = req.body;

    const category = await pool.query(
      `UPDATE category SET category_name=$1, descripton=$2, parent_id=$3 WHERE id=$3 RETURNING *`,
      [category_name, descripton, parent_id, id],
    );

    if (category.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi yangilandi", category: user.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await pool.query(
      `DELETE FROM category WHERE id=$1 RETURNING *`,
      [id],
    );

    if (category.rows.length === 0) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }

    res
      .status(200)
      .send({ message: "Foydalanuvchi o'chirildi", category: user.rows[0] });
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
