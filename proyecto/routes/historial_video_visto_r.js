const express = require('express');
const historialController = require('../controllers/historial_video_visto_c');

const router = express.Router();

router
    .route('/')
    .get(historialController.obtenerHistoriales)
    .post(historialController.crearHistorial);

router
    .route('/:id')
    .get(historialController.obtenerHistorial)
    .patch(historialController.actualizarHistorial)
    .delete(historialController.eliminarHistorial);

module.exports = router;
