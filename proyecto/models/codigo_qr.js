const mongoose = require('mongoose');

const codigoQRSchema = new mongoose.Schema({
    empresa_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    codigo: String,
    url_imagen: String,
    ubicacion_maquina: String,
    maquina: String,
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    estado: Boolean
}, {
    collection: 'codigos_qr'
});

module.exports = mongoose.model('CodigoQR', codigoQRSchema);