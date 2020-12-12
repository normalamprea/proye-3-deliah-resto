const aplicacion = require("express").Router();
const conexion = require("../base_datos/conexion");
const jwt = require('jsonwebtoken');

aplicacion.get("/", (req, res) => {
    try {

        validarToken(req.headers.authorization);

        conexion.query(
            'SELECT idProducto, nombre FROM delilahdb.producto',
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema consultando en base de datos");
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

aplicacion.post("/", (req, res) => {
    const { nombre } = req.body;
    console.log(req.body);
    try {

        if (!esAdministrador(req.headers.authorization)) {
            res.status(401).json("Error en authorization.");
            return;
        }

        if (!nombre) {
            res.status(400).json("Error en datos de entrada. Verifique sus datos.");
            return;
        }

        conexion.query(
            `INSERT INTO delilahdb.producto 
                (nombre) 
                VALUES 
                ('${nombre}')`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema insertando en base de datos");
                    return;
                }

                console.log(rows);
                console.log(fields);

                res.status(200).json("Producto agregado de forma exitosa.");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

aplicacion.put("/:id", (req, res) => {

    if (!esAdministrador(req.headers.authorization)) {
        res.status(401).json("Error en authorization.");
        return;
    }

    const { nombre } = req.body;
    const idProducto = req.params.id;
    console.log(idProducto);

    try {
        if (!nombre) {
            res.status(400).json("Error en datos de entrada. Verifique sus datos.");
            return;
        }

        conexion.query(
            `UPDATE delilahdb.producto
            SET nombre = '${nombre}'
            WHERE idProducto = (${idProducto})`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Ocurrió un problema actualizando datos");
                    return;
                }

                if (rows.affectedRows < 1) {
                    res.status(400).json("No se actualizaron datos");
                    return;
                }

                res.status(200).json("Producto actualizado de forma exitosa.");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

aplicacion.delete("/:id", (req, res) => {

    if (!esAdministrador(req.headers.authorization)) {
        res.status(401).json("Error en authorization.");
        return;
    }

    const idProducto = req.params.id;
    console.log(idProducto);

    try {
        conexion.query(
            `DELETE FROM delilahdb.producto            
            WHERE idProducto = (${idProducto})`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema eliminando en base de datos");
                    return;
                }

                console.log(rows);
                console.log(fields);
                if (rows.affectedRows < 1) {
                    res.status(400).json("No se eliminaron datos");
                    return;
                }

                res.status(200).json("Producto eliminado de forma exitosa.");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

function esAdministrador(token) {
    const dataToken = validarToken(token);

    return dataToken && dataToken.rol === 'admin';
}

function validarToken(token) {
    const dataToken = jwt.verify(token, 'estesupersecretotoken');

    return dataToken;
}

module.exports = aplicacion;