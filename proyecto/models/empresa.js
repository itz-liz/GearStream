const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
    correo: String,
    telefono: String,
    estado: Boolean
}, {
    collection: 'empresas'
});

module.exports = mongoose.model('Empresa', empresaSchema);