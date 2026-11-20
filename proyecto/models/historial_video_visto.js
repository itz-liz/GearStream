const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    fecha_inicio: {
        type: Date,
        default: Date.now
    },
    completado: Boolean
}, {
    collection: 'historial_videos_vistos'
});

module.exports = mongoose.model(
    'HistorialVideosVistos',
    historialSchema
);