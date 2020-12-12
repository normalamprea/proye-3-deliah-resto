# Backend para la App "Delilah Restó"

Proyecto #3 curso de Desarrollo Web Full Stack en Acámica

## Recursos y tecnologías utilizadas

- Node.js
- Nodemon
- Express
- JWT para autenticación via Token
- MySQL
- Sequelize
- Postman para manejo de endpoints y testing

Crear el backend de una app para un restaurante de comida "Delilah Restó", diseñando la arquitectura, bases de datos y endpoints.

## Documentación de la API

Se listarán los endpoints y métodos disponibles y la información necesaria para hacer uso de los mismos.

## Instalación e inicializacion del proyecto

### 1 - Clonar proyecto

Clonar el repositorio desde (https://github.com/normalamprea/proye-3-deliah-resto/).

Desde la consola con el siguiente link:

`git clone https://github.com/normalamprea/proye-3-deliah-resto.git .`

### 2 - Instalación de dependencias

```
npm install
```

### 3 - Crear la base de datos

- Abrir XAMPP y asegurarse que el puerto sobre el cual se está ejecutando es el `4550`
- Inicializar los servicios de Apache y MySQL
- Abrir el panel de control del servicio MySQL
- Generar una nueva base de datos llamada `delilahdb`
- Abrir el archivo en `/base_datos/Scripts.sql` y dentro del `panel de control` de la base de datos ejecutar la serie de queries del archivo o importar el mismo.

### 4 - Iniciando el servidor

Abrir el archivo en `/servidor/servidor.js` desde node

`node server`

### 5 - Listo para usar!

Testear los endpoints provistos desde postman para poder hacer uso de la API y base de datos generadas

(Asegurarse de seleccionar el entorno de desarrollo `Delilah Restó` para poder acceder a las variables globales)