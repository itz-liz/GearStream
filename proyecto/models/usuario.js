const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    empresa_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    },
    nombre: String,
    correo: String,
    contraseña: String,
    fecha_registro: Date,
    telefono: Number,
    estado: Boolean,
}, {
    collection: 'usuarios'
});

module.exports = mongoose.model('Usuario', usuarioSchema);