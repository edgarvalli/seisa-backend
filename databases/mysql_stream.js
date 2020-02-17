const mysql = require("mysql");

function MysqlStream({
  query = "",
  db = "test",
  onError = error => error,
  onStream = row => row,
  onEnd = result => result
}) {
  const request = mysql.createConnection({
    host: "localhost",
    user: "seiadmin",
    password: "p4ssw0rd",
    database: db
  });
  request.connect();
  const req = request.query(query);
  req.on("error", onError);
  req.on("result", async row => {
    request.pause();
    await onStream(row);
    request.resume();
  });
  req.on("end", onEnd);
}

module.exports = MysqlStream;
