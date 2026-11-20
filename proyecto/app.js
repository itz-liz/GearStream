require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const modelsDirectory = path.join(__dirname, 'models');
fs.readdirSync(modelsDirectory)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => require(path.join(modelsDirectory, file)));

async function seedTestData() {
    const Empresa = mongoose.model('Empresa');
    const Usuario = mongoose.model('Usuario');
    const Video = mongoose.model('Video');
    const CodigoQR = mongoose.model('CodigoQR');
    const Historial = mongoose.model('HistorialVideosVistos');

    const empresa = await Empresa.findOneAndUpdate(
        { correo: 'contacto@gearstream.test' },
        {
            nombre: 'GearStream Demo',
            direccion: 'Avenida Principal 123',
            correo: 'contacto@gearstream.test',
            telefono: '555-0100',
            estado: true
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const usuario = await Usuario.findOneAndUpdate(
        { correo: 'demo@gearstream.test' },
        {
            empresa_id: empresa._id,
            nombre: 'Usuario Demo',
            correo: 'demo@gearstream.test',
            contraseña: 'Demo123!',
            fecha_registro: new Date(),
            telefono: 5550101,
            estado: true
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const video = await Video.findOneAndUpdate(
        { titulo: 'Introduccion a GearStream' },
        {
            empresa_id: empresa._id,
            titulo: 'Introduccion a GearStream',
            descripcion: 'Video de prueba para la plataforma.',
            url_video: 'https://example.com/videos/introduccion.mp4',
            categoria: 'Capacitacion',
            duracion: 300,
            fecha_publicacion: new Date(),
            estado: true
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    await CodigoQR.findOneAndUpdate(
        { codigo: 'GS-DEMO-001' },
        {
            empresa_id: empresa._id,
            video_id: video._id,
            codigo: 'GS-DEMO-001',
            url_imagen: 'https://example.com/qr/GS-DEMO-001.png',
            ubicacion_maquina: 'Planta Central',
            maquina: 'Maquina Demo 1',
            fecha_creacion: new Date(),
            estado: true
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    await Historial.findOneAndUpdate(
        { usuario_id: usuario._id, video_id: video._id },
        {
            usuario_id: usuario._id,
            video_id: video._id,
            fecha_inicio: new Date(),
            completado: true
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const seedCounts = await Promise.all([
        Empresa.countDocuments(),
        Usuario.countDocuments(),
        Video.countDocuments(),
        CodigoQR.countDocuments(),
        Historial.countDocuments()
    ]);

    console.log('Conteo de datos de prueba:');
    console.log(`- empresas: ${seedCounts[0]}`);
    console.log(`- usuarios: ${seedCounts[1]}`);
    console.log(`- videos: ${seedCounts[2]}`);
    console.log(`- codigos_qr: ${seedCounts[3]}`);
    console.log(`- historial_videos_vistos: ${seedCounts[4]}`);
}

async function connectToDatabase() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI no esta definida en el archivo .env');
    }

    try {
        await mongoose.connect(mongoUri.trim(), {
            dbName: 'GearStreamDb'
        });

        console.log(`Conexion exitosa a MongoDB: ${mongoose.connection.name}`);

        for (const model of Object.values(mongoose.models)) {
            const collections = await mongoose.connection.db
                .listCollections({ name: model.collection.name })
                .toArray();

            if (collections.length > 0) {
                console.log(`Coleccion ya existe: ${model.collection.name}`);
                continue;
            }

            await model.createCollection();
            console.log(`Coleccion creada: ${model.collection.name}`);
        }

        console.log('Schemas registrados en MongoDB:');
        Object.values(mongoose.models).forEach((model) => {
            console.log(`- ${model.modelName} -> ${model.collection.name}`);
        });

        await seedTestData();
        console.log('Datos de prueba insertados o actualizados en GearStreamDb.');
    } catch (error) {
        console.error('Error al conectar o crear las colecciones en MongoDB:', error);
        process.exitCode = 1;
        throw error;
    }
}

connectToDatabase()
    .then(async () => {
        await mongoose.disconnect();
    })
    .catch(() => {
        process.exitCode = 1;
    });