const express = require("express");
const servidor = express();

const puerto = process.env.PORT || 4550;

servidor.use(express.json());

const usuarioEnrutador = require("../enrutador/usuario");
servidor.use("/usuario", usuarioEnrutador);

const productoEnrutador = require("../enrutador/producto");
servidor.use("/producto", productoEnrutador);

const pedidoEnrutador = require("../enrutador/pedido");
servidor.use("/pedido", pedidoEnrutador);

const autenticacionEnrutador = require("../enrutador/autenticacion");
servidor.use("/autenticacion", autenticacionEnrutador);

servidor.listen(puerto, () => {	
    console.log('Delilah Resto - Servidor inicializado');
    console.log('puerto: ', puerto);
});