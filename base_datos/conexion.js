const mysql = require('mysql');

var mysqlConexion = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "delilahdb",
    multipleStatements: true
});

mysqlConexion.connect((err) => {

    if (err) {
        console.log(err);
        return;
    }

    console.log("conectado a base de datos");
});

module.exports = mysqlConexion; 