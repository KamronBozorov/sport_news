const {
  newData,
  getDataByid,
  getAllData,
  updateData,
  deleteData,
} = require("../controllers/langs.controller");

const router = require("express").Router();

router.post("/", newData);
router.get("/", getAllData);
router.get("/:id", getDataByid);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

module.exports = router;
