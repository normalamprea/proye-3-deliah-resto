const aplicacion = require("express").Router();
const conexion = require("../base_datos/conexion");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

aplicacion.post("/registrar", async (req, res) => {
    const { username, clave, telefono, direccion, rolId } = req.body;
    try {
        if (!username || !clave || !telefono || !direccion || !rolId) {
            res.status(400).json("Error en datos de entrada. Verifique sus datos.");
            return;
        }

        var claveEncriptada = await bcrypt.hash(clave, 8);
        
        conexion.query(
            `INSERT INTO delilahdb.usuario 
                (username, clave, telefono, direccion, rolId) 
                VALUES 
                ('${username}', '${claveEncriptada}', '${telefono}', '${direccion}', ${rolId})`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema insertando en base de datos");
                    return;
                }

                console.log(rows);
                console.log(fields);

                res.status(200).json("Usuario registrado de forma exitosa.");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
    }
});

aplicacion.get("/:username", (req, res) => {
    try {

        if (!esAdministrador(req.headers.authorization)) {
            res.status(401).json("Error en authorization.");
            return;
        }
        
        const username = req.params.username;
        console.log(username);
        
        conexion.query(
            `SELECT username, telefono, direccion
            FROM delilahdb.usuario
            WHERE username = '${username}'`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema consultando en base de datos");
                    return;
                }

                console.log(rows);

                if (rows.length > 0) {
                    //var usuario = rows.map(a => obtenerObjeto(a));
                    var response = {
                        username: rows[0].username,
                        telefono: rows[0].telefono,
                        direccion: rows[0].direccion
                    };
                    res.send(response);    
                    return;
                }
                
                res.send(rows);
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

module.exports = aplicacion;

function esAdministrador(token) {
    const dataToken = validarToken(token);

    return dataToken && dataToken.rol === 'admin';
}

function validarToken(token) {
    const dataToken = jwt.verify(token, 'estesupersecretotoken');

    return dataToken;
}