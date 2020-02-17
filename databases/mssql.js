const mssql = require("mssql");
function connecton(db, query) {
  const config = {
    server: "10.1.1.10\\COMPAC",
    user: "sa",
    password: "SERVER2014soporte",
    database: db
  };

  return new Promise(function(resolve, reject) {
    mssql.connect(config, error => {
      if (error) reject(error);
      new mssql.Request().query(query, function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
  });
}

module.exports = connecton;
