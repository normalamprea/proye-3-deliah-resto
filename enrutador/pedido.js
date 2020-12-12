const aplicacion = require("express").Router();
const conexion = require("../base_datos/conexion");
const jwt = require('jsonwebtoken');

aplicacion.get("/:id", (req, res) => {
    try {
        var dataToken = validarToken(req.headers.authorization);
        const idPedido = req.params.id;
        console.log(dataToken.idUsuario);
        console.log(idPedido);        
        conexion.query(
            `SELECT idPedido, username, telefono, direccion, fecha, estado, nombre 
            FROM delilahdb.pedido_producto pp
            INNER JOIN delilahdb.pedido pe ON pe.idPedido = pp.pedidoId
            INNER JOIN delilahdb.usuario us ON us.idUsuario = pe.usuarioId
            INNER JOIN delilahdb.producto pro ON pro.idProducto = pp.productoId
            WHERE pe.idPedido = ${idPedido} AND pe.usuarioId = ${dataToken.idUsuario}`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema consultando en base de datos");
                    return;
                }

                console.log(rows);

                if (rows.length > 0) {
                    var productos = rows.map(a => obtenerObjeto(a));
                    var response = {
                        username: rows[0].username,
                        telefono: rows[0].telefono,
                        direccion: rows[0].direccion,
                        fecha: rows[0].fecha,
                        estado: rows[0].estado,
                        productos
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

aplicacion.post("/agregar", (req, res) => {
    try {

        var dataToken = validarToken(req.headers.authorization);
        const { listaProductos } = req.body;
                
        if (!listaProductos || listaProductos.length < 1) {
            res.status(400).json("Error en datos de entrada. Verifique sus datos.");
            return;
        }

        const fechaActual = new Date();
        const fechaBaseDatos = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        const estado = 'NUEVO';

        conexion.query(
            `INSERT INTO delilahdb.pedido 
                (fecha, estado, usuarioId) 
                VALUES 
                ('${fechaBaseDatos}', '${estado}',${dataToken.idUsuario})`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema insertando en base de datos");
                    return;
                }

                const idNuevoPedido = rows.insertId;
                
                listaProductos.forEach(elemento => {
                    conexion.query(
                        `INSERT INTO delilahdb.pedido_producto 
                            (pedidoId, productoId) 
                            VALUES 
                            (${idNuevoPedido}, ${elemento.productoId})`,
                        (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                res.status(400).json("Problema insertando en base de datos");
                                return;
                            }
                        }
                    );
                });

                res.status(200).json("Pedido agregado de forma correcta");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

aplicacion.put("/:id", (req, res) => {

    try {

        if (!esAdministrador(req.headers.authorization)) {
            res.status(401).json("Error en authorization.");
            return;
        }

        const { estado } = req.body;
        const idPedido = req.params.id;

        if (!estado) {
            res.status(400).json("Error en datos de entrada. Verifique sus datos.");
            return;
        }

        conexion.query(
            `UPDATE delilahdb.pedido
            SET estado = '${estado}'
            WHERE idPedido = (${idPedido})`,
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

                res.status(200).json("Pedido actualizado de forma exitosa.");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

aplicacion.delete("/:id", (req, res) => {

    try {

        if (!esAdministrador(req.headers.authorization)) {
            res.status(401).json("Error en authorization.");
            return;
        }

        const idPedido = req.params.id;
        conexion.query(
            `DELETE FROM delilahdb.pedido            
            WHERE idPedido = (${idPedido})`,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).json("Problema eliminando en base de datos");
                    return;
                }

                if (rows.affectedRows < 1) {
                    res.status(400).json("No se eliminaron datos");
                    return;
                }

                res.status(200).json("Pedido eliminado de forma exitosa.");
            }
        );

    } catch (error) {
        console.log("API Error:", error);
        res.status(400).json("Error en solicitud.");
    }
});

module.exports = aplicacion;

function obtenerObjeto(objeto) {
    return nuevoObjeto = {
        nombre: objeto.nombre
    };
}

function esAdministrador(token) {
    const dataToken = validarToken(token);

    return dataToken && dataToken.rol === 'admin';
}

function validarToken(token) {
    const dataToken = jwt.verify(token, 'estesupersecretotoken');

    return dataToken;
}