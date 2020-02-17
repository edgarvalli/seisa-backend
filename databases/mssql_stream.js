const mssql = require("mssql");
function connecton({
  query = "use master",
  db = "master",
  onStream = () => null,
  onError = () => null,
  onDone = () => null
}) {
  const config = {
    server: "10.1.1.10\\COMPAC",
    user: "sa",
    password: "SERVER2014soporte",
    database: db
  };
  mssql.connect(config, error => {
    if (error) return { error: true, message: error };
    const request = new mssql.Request();
    request.query(query);
    request.stream = true;
    request.on("row", async row => {
      request.pause();
      await onStream(row);
      request.resume();
    });
    request.on("error", onError);
    request.on("done", onDone);
  });
}

module.exports = connecton;
