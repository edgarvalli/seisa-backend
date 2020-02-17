const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", function(_, res) {
  res.send("Express - SEISA Backend");
});

app.use("/api/proyectos", require("./api/proyectos"));

app.listen(3080, function(error) {
  if (error) throw error;
  console.log("Server running on port " + 3080);
});
