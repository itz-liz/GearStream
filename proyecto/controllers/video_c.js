const mongoose = require('mongoose');
const Video = require('../models/video');

const camposPermitidos = [
    'empresa_id',
    'titulo',
    'descripcion',
    'url_video',
    'categoria',
    'duracion',
    'fecha_publicacion',
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

    console.error('Error al procesar un video:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
}

exports.obtenerVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        return res.json(videos);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.obtenerVideo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del video no es válido.' });
    }

    try {
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ mensaje: 'No se encontró el video.' });
        }

        return res.json(video);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.crearVideo = async (req, res) => {
    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para el video.' });
    }

    try {
        const video = await Video.create(datos);
        return res.status(201).json(video);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.actualizarVideo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del video no es válido.' });
    }

    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para actualizar.' });
    }

    try {
        const video = await Video.findByIdAndUpdate(id, datos, {
            new: true,
            runValidators: true
        });

        if (!video) {
            return res.status(404).json({ mensaje: 'No se encontró el video.' });
        }

        return res.json(video);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.eliminarVideo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID del video no es válido.' });
    }

    try {
        const video = await Video.findByIdAndDelete(id);

        if (!video) {
            return res.status(404).json({ mensaje: 'No se encontró el video.' });
        }

        return res.status(204).send();
    } catch (error) {
        return responderError(res, error);
    }
};