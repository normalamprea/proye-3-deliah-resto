CREATE DATABASE delilahdb;

CREATE TABLE delilahdb.rol (
  idRol INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL UNIQUE);

CREATE TABLE delilahdb.usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(254) NOT NULL UNIQUE,
  clave VARCHAR(60) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  rolId INT NOT NULL,
  FOREIGN KEY (rolId) REFERENCES rol(idRol)
  );

CREATE TABLE delilahdb.producto (
  idProducto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL);
  
CREATE TABLE delilahdb.pedido (
  idPedido INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME NOT NULL,
  estado VARCHAR(45) NOT NULL,
  usuarioId INT NOT NULL,
  FOREIGN KEY (usuarioId) REFERENCES usuario(idUsuario)
  );

CREATE TABLE delilahdb.pedido_producto (
  pedidoId INT NOT NULL,
  productoId INT NOT NULL,  
  PRIMARY KEY (pedidoId, productoId),
  FOREIGN KEY (pedidoId) REFERENCES pedido(idPedido) ON DELETE CASCADE,
  FOREIGN KEY (productoId) REFERENCES producto(idProducto) ON DELETE CASCADE
  );

INSERT INTO delilahdb.rol(nombre)
VALUES ('admin');

INSERT INTO delilahdb.rol(nombre)
VALUES ('basic');