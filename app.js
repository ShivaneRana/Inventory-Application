const express = require("express");
const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ quiet: true, debug: false });

//create and epress instance
const app = express();

//set ejs as view engine template
app.set("view engine", "ejs");
//set views as default path for views template tho its views by default
app.set("views", path.join(__dirname, "views"));

// for dealing with form
app.set(express.urlencoded({ extended: true }));
// set publice for static files
app.set(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).send("root route has been reached");
});

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`http://localhost:${PORT}`);
});
