const express = require('express');
const usuarioController = require('../controllers/usuario_c');

const router = express.Router();

router
    .route('/')
    .get(usuarioController.obtenerUsuarios)
    .post(usuarioController.crearUsuario);

router
    .route('/:id')
    .get(usuarioController.obtenerUsuario)
    .patch(usuarioController.actualizarUsuario)
    .delete(usuarioController.eliminarUsuario);

module.exports = router;
