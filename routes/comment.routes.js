const {
  newData,
  getDataByid,
  getAllData,
  updateData,
  deleteData,
} = require("../controllers/comment.controller");

const router = require("express").Router();

router.post("/", newData);
router.get("/", getAllData);
router.get("/:id", getDataByid);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

module.exports = router;
