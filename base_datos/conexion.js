const mysql = require('mysql');
const conexionData = require('./conexionData');

var mysqlConexion = mysql.createConnection({
    host : conexionData.conf_db_host,
    user : conexionData.conf_user,
    password : conexionData.conf_password,
    database : conexionData.conf_db_name,
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