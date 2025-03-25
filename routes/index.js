const router = require("express").Router();

const langs = require("./langs.routes.js");
const users = require("./users.routes.js");
const category = require("./category.routes.js");
const news = require("./news.routes.js");
const newsWithLangs = require("./news-with-langs.routes.js");
const report = require("./report.routes.js");
const comment = require("./comment.routes.js");
const media = require("./media.routes.js");
const like = require("./like.routes.js");

router.use("/langs", langs);
router.use("/users", users);
router.use("/category", category);
router.use("/news", news);
router.use("/news-with-langs", newsWithLangs);
router.use("/report", report);
router.use("/comment", comment);
router.use("/media", media);
router.use("/like", like);

module.exports = router;
