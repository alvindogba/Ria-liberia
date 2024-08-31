import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Initialize app
const app = express();
const port = 3000;

// Define API URL and headers
const api_url = "https://api.api-ninjas.com/v1/airlines?name=Brussels Airlines";
const api_key = process.env.API_KEY; // Make sure to set this in your .env file

// Define routes
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(api_url, {
            headers: {
                'X-Api-Key': api_key // Correct header key for API key
            }
        });
        res.send(response.data); // Send only the data part of the response
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});
