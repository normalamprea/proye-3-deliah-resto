const aplicacion = require("express").Router();
const conexion = require("../base_datos/conexion");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

aplicacion.post("/", async (req, res) => {
    const { username, clave } = req.body;
    try {
        if (!username || !clave) {
            res.status(400).json("Error en datos de entrada. Verifique sus datos.");
            return;
        }

        conexion.query(
            `SELECT idUsuario, username, clave, rolId, nombre 
            FROM delilahdb.usuario
            INNER JOIN delilahdb.rol ON idRol = rolId 
            WHERE  username = '${username}'`,
            async (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema consultando en base de datos");
                    return;
                }


                console.log(rows);
                if (rows.length > 0) {                     
                    const claveCoincide = await bcrypt.compare(clave, rows[0].clave);
                    
                    console.log(claveCoincide);
                    if (claveCoincide) {
                        const token = jwt.sign(
                            {idUsuario: rows[0].idUsuario, username: rows[0].username, rol: rows[0].nombre},
                            'estesupersecretotoken')
                        res.status(200).json(token);
                        return;
                    }
                }

                res.status(401).json("Autenticación fallida. Verifique su usuario y/o clave.");
                return;
            }
        );

    } catch (error) {
        console.log("API Error:", error);
    }
});

module.exports = aplicacion;