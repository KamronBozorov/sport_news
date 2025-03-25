const {
  newData,
  getDataByid,
  getAllData,
  updateData,
  deleteData,
  activateUser,
} = require("../controllers/users.controller");

const router = require("express").Router();

router.get("/activate/:otp", activateUser);
router.post("/", newData);
router.get("/", getAllData);
router.get("/:id", getDataByid);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

module.exports = router;
