const mongoose = require('mongoose');
const CodigoQR = require('../models/codigo_qr');

const camposPermitidos = [
    'empresa_id',
    'video_id',
    'codigo',
    'url_imagen',
    'ubicacion_maquina',
    'maquina',
    'fecha_creacion',
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

    console.error('Error al procesar un código QR:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
}

exports.obtenerCodigosQR = async (req, res) => {
    try {
        const codigosQR = await CodigoQR.find();
        return res.json(codigosQR);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.obtenerCodigoQR = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del código QR no es válido.' });
    }

    try {
        const codigoQR = await CodigoQR.findById(id);

        if (!codigoQR) {
            return res.status(404).json({ mensaje: 'No se encontró el código QR.' });
        }

        return res.json(codigoQR);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.crearCodigoQR = async (req, res) => {
    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para el código QR.' });
    }

    try {
        const codigoQR = await CodigoQR.create(datos);
        return res.status(201).json(codigoQR);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.actualizarCodigoQR = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del código QR no es válido.' });
    }

    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para actualizar.' });
    }

    try {
        const codigoQR = await CodigoQR.findByIdAndUpdate(id, datos, {
            new: true,
            runValidators: true
        });

        if (!codigoQR) {
            return res.status(404).json({ mensaje: 'No se encontró el código QR.' });
        }

        return res.json(codigoQR);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.eliminarCodigoQR = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del código QR no es válido.' });
    }

    try {
        const codigoQR = await CodigoQR.findByIdAndDelete(id);

        if (!codigoQR) {
            return res.status(404).json({ mensaje: 'No se encontró el código QR.' });
        }

        return res.status(204).send();
    } catch (error) {
        return responderError(res, error);
    }
};