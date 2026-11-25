const express = require('express');
const codigoQRController = require('../controllers/codigo_qr_c');

const router = express.Router();

router
    .route('/')
    .get(codigoQRController.obtenerCodigosQR)
    .post(codigoQRController.crearCodigoQR);

router
    .route('/:id')
    .get(codigoQRController.obtenerCodigoQR)
    .patch(codigoQRController.actualizarCodigoQR)
    .delete(codigoQRController.eliminarCodigoQR);

module.exports = router;
