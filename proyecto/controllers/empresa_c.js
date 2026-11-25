const mongoose = require('mongoose');
const Empresa = require('../models/empresa');

const camposPermitidos = ['nombre', 'direccion', 'correo', 'telefono', 'estado'];

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

    console.error('Error al procesar una empresa:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
}

exports.obtenerEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.find();
        return res.json(empresas);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.obtenerEmpresa = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID de la empresa no es válido.' });
    }

    try {
        const empresa = await Empresa.findById(id);

        if (!empresa) {
            return res.status(404).json({ mensaje: 'No se encontró la empresa.' });
        }

        return res.json(empresa);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.crearEmpresa = async (req, res) => {
    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para la empresa.' });
    }

    try {
        const empresa = await Empresa.create(datos);
        return res.status(201).json(empresa);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.actualizarEmpresa = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID de la empresa no es válido.' });
    }

    const datos = filtrarCampos(req.body ?? {});

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({ mensaje: 'Envía al menos un campo válido para actualizar.' });
    }

    try {
        const empresa = await Empresa.findByIdAndUpdate(id, datos, {
            new: true,
            runValidators: true
        });

        if (!empresa) {
            return res.status(404).json({ mensaje: 'No se encontró la empresa.' });
        }

        return res.json(empresa);
    } catch (error) {
        return responderError(res, error);
    }
};

exports.eliminarEmpresa = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: 'El ID de la empresa no es válido.' });
    }

    try {
        const empresa = await Empresa.findByIdAndDelete(id);

        if (!empresa) {
            return res.status(404).json({ mensaje: 'No se encontró la empresa.' });
        }

        return res.status(204).send();
    } catch (error) {
        return responderError(res, error);
    }
};