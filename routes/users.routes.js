const {
  newData,
  getDataByid,
  getAllData,
  updateData,
  deleteData,
  activateUser,
  login,
  logout,
  refreshToken,
} = require("../controllers/users.controller");
const authGuard = require("../guards/auth.guard");

const router = require("express").Router();

router.get("/activate/:otp", activateUser);
router.post("/", newData);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/", getAllData);
router.get("/:id", getDataByid);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

module.exports = router;
