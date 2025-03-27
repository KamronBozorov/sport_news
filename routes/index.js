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
const views = require("./views.routes.js");
const newTags = require("./new-tags.routes.js");
const tags = require("./tags.routes.js");
const notifications = require("./notifications.routes.js");
const authors = require("./authors.routes.js");
const otp = require("./otp.routes.js");

router.use("/users", users);
router.use("/category", category);
router.use("/news", news);
router.use("/news-with-langs", newsWithLangs);
router.use("/report", report);
router.use("/comment", comment);
router.use("/media", media);
router.use("/like", like);
router.use("/views", views);
router.use("/tags", tags);
router.use("/new-tags", newTags);
router.use("/notifications", notifications);
router.use("/authors", authors);
router.use("/langs", langs);
router.use("/otp", otp);

module.exports = router;
