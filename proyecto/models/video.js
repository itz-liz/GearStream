const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    empresa_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    titulo: String,
    descripcion: String,
    url_video: String,
    categoria: String,
    duracion: Number,
    fecha_publicacion: {
        type: Date,
        default: Date.now
    },
    estado: Boolean
}, {
    collection: 'videos'
});

module.exports = mongoose.model('Video', videoSchema);