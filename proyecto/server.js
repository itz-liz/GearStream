require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use('/api/empresas', require('./routes/empresa_r'));
app.use('/api/usuarios', require('./routes/usuario_r'));
app.use('/api/videos', require('./routes/video_r'));
app.use('/api/codigos-qr', require('./routes/codigo_qr_r'));
app.use('/api/historial-videos-vistos', require('./routes/historial_video_visto_r'));

app.use((req, res) => {
    res.status(404).json({ mensaje: 'La ruta solicitada no existe.' });
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no contiene JSON válido.' });
    }

    console.error('Error en la API:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

async function iniciarServidor() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI no está definida en el archivo .env');
    }

    await mongoose.connect(mongoUri.trim(), { dbName: 'GearStreamDb' });

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`API GearStream disponible en http://localhost:${port}`);
    });
}

if (require.main === module) {
    iniciarServidor().catch((error) => {
        console.error('No se pudo iniciar la API:', error);
        process.exitCode = 1;
    });
}

module.exports = { app, iniciarServidor };
