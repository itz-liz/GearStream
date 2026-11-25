const express = require('express');
const videoController = require('../controllers/video_c');

const router = express.Router();

router
    .route('/')
    .get(videoController.obtenerVideos)
    .post(videoController.crearVideo);

router
    .route('/:id')
    .get(videoController.obtenerVideo)
    .patch(videoController.actualizarVideo)
    .delete(videoController.eliminarVideo);

module.exports = router;
