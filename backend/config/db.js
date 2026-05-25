const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sql3.freesqldatabase.com",
  user: "sql3825758",
  password: "W8dDRLvt3J",
  database: "sql3825758"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("conectado a MySQL");
});

module.exports = db;
