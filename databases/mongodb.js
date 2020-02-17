const mongodb = require("mongodb");

module.exports = async (db) => {
  const uri = "mongodb://localhost:27017/";
  const client = await mongodb.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return client.db(db);
};
