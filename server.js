import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Initialize app
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Define API URL and headers
const aipNinjas_url = "https://api.apininjas.com/aviation/v1/flight/status";
const avaitionStack_url = "https://api.aviationstack.com/v1/flights"
const avaition_api_key= process.env.Avaition_stack_Api_key
const airport_code = process.env.AIRPORT_CODE;

// Define routes
// Define routes
app.get("/flight_status", async (req, res) => {
    try {
        const response = await axios.get( avaitionStack_url, {
            params: {
                access_key: avaition_api_key,
             
     
            }
        });

        // Handle the response data
        const flights = response.data.data; 
        const flightsInLiberia = flights.filter(flight => 
            flight.departure.iata === airport_code || flight.arrival.iata ===airport_code
        );

        res.send(flightsInLiberia); // Send only the filtered data
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});