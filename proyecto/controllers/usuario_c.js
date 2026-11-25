const mongoose = require('mongoose');
const Usuario = require('../models/usuario');

const camposPermitidos = [
    'empresa_id',
    'nombre',
    'correo',
    'contraseña',
    'fecha_registro',
    'telefono',
    'estado'
];

function filtrarCampos(datos) {
    return Object.fromEntries(
        camposPermitidos
            .filter((campo) => Object.prototype.hasOwnProperty.call(datos, campo))
            .map((campo) => [campo, datos[campo]])
    );
}

function responderError(res, error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({ mensaje: 'Los datos enviados no son válidos.' });
    }

    console.error('Error al procesar un usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
}

function ocultarContrasena(usuario) {
    const datos = usuario.toObject();
    delete datos.contraseña;
    return datos;
}

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-contraseña');
        return res.json(usuarios);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.obtenerUsuario = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del usuario no es válido.' });
    }

    try {
        const usuario = await Usuario.findById(id).select('-contraseña');

        if (!usuario) {
            return res.status(404).json({ mensaje: 'No se encontró el usuario.' });
        }

        return res.json(usuario);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.crearUsuario = async (req, res) => {
    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para el usuario.' });
    }

    try {
        const usuario = await Usuario.create(datos);
        return res.status(201).json(ocultarContrasena(usuario));
    } catch (error) {
        return responderError(res, error);
    }
};

exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del usuario no es válido.' });
    }

    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para actualizar.' });
    }

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, datos, {
            new: true,
            runValidators: true
        }).select('-contraseña');

        if (!usuario) {
            return res.status(404).json({ mensaje: 'No se encontró el usuario.' });
        }

        return res.json(usuario);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del usuario no es válido.' });
    }

    try {
        const usuario = await Usuario.findByIdAndDelete(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'No se encontró el usuario.' });
        }

        return res.status(204).send();
    } catch (error) {
        return responderError(res, error);
    }
};