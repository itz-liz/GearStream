const express = require('express');
const empresaController = require('../controllers/empresa_c');

const router = express.Router();

router
    .route('/')
    .get(empresaController.obtenerEmpresas)
    .post(empresaController.crearEmpresa);

router
    .route('/:id')
    .get(empresaController.obtenerEmpresa)
    .patch(empresaController.actualizarEmpresa)
    .delete(empresaController.eliminarEmpresa);

module.exports = router;
