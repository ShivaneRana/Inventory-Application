const express = require("express");
const dotenv = require("dotenv");
const path = require("node:path");
const indexRouter = require("./routers/indexRouter.js");

dotenv.config({ quiet: true, debug: false });
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set(express.urlencoded({ extended: true }));
app.set(express.static(path.join(__dirname, "public")));

app.get("/", indexRouter);

const PORT = process.env.PORT;

app.use((err,req,res,next) => {
  console.error(err);
  console.log(err.message);
})

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`http://localhost:${PORT}`);
});
