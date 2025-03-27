const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const mainRoutes = require("./routes/index.js");

const PORT = config.get("port") || 5000;

const app = express();

app.use(express.json({ extended: true }));
app.use(cookieParser());
app.use("/api", mainRoutes);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server has been started on port http://localhost:${PORT}...`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

start();
