const aplicacion = require("express").Router();
const conexion = require("../base_datos/conexion");
const bcrypt = require('bcrypt');

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

module.exports = aplicacion;