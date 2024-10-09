import  pkg   from 'pg';
import dotenv from 'dotenv';


// Initialize environment variables
dotenv.config();



const {Client} = pkg;
// Extablixshing database connection 
const db = new Client({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database_name,
    password: process.env.password,
    port: process.env.port,
    ssl: {
        rejectUnauthorized: false, // Use this if you're connecting to a self-signed certificate
    },
});
db.connect()
    .then(() => {
        console.log('Connected to the database');
        // You can run your queries here
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    });

    const searchFlights = async (query) => {
        const { rows } = await pool.query(
            'SELECT * FROM flights WHERE flight_number ILIKE $1 OR destination ILIKE $1',
            [`%${query}%`]
        );
        return rows;
    };
    
    module.exports = {
        getAllFlights,
        searchFlights,
    };
    