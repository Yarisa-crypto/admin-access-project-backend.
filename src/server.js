const sequelize = require('./config/db');
const app = require('./app');
const dotenv = require('dotenv');
require('./models/associations');

dotenv.config();

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a PostgreSQL con sequelize');
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Error conectando a la base de datos:', err));

    sequelize.sync({ force: false }).then(() => {
        console.log('Base de datos sincronizada');
    }).catch(err => {
        console.error('Error sincronizando la base de datos:', err);
    });
