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

// Define routes home routes
app.get("/", (req, res)=>{
    res.render("home");
})
// Define routes
app.get("/flight-status", async (req, res) => {
    try {
        const response = await axios.get(avaitionStack_url, {
            params: {
                access_key: avaition_api_key,
            }
        });

        // Handle the response data 
        const flights = response.data.data; 
        // console.log(flights);
        console.log("API Key:", avaition_api_key);
        res.render("flight_status.ejs", {flightLib: flights, showArrival: true}); // By default, show arrival data
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});


// Route to handle dynamic content starts
app.get('/arrival', async (req, res) => {
    try {
        // Fetch data or define flightLib here
        const response = await axios.get(avaitionStack_url, {
            params: {
                access_key: avaition_api_key,
            }
        });

        const flights = response.data.data; 

        res.render('partials/arrival_data', { flightLib: flights }); // Pass flightLib to the template
    } catch (error) {
        console.error("Failed to fetch flight data:", error.message);
        res.status(500).send("Failed to fetch flight data.");
    }
});

app.get('/departures', async (req, res) => {
    try {
        // Fetch data or define flightLib here
        const response = await axios.get(avaitionStack_url, {
            params: {
                access_key: avaition_api_key,
            }
        });

        const flights = response.data.data; // Assuming flights is the data you need

        res.render('partials/departure_data', { flightLib: flights }); // Pass flightLib to the template
    } catch (error) {
        console.error("Failed to fetch flight data:", error.message);
        res.status(500).send("Failed to fetch flight data.");
    }
});

// Route to handle dynamic content ends

app.get("/business_opportities", (req, res)=>{
    res.render("business_opportities");
})

app.get("/flight_info", (req, res)=>{
    res.render("flight_info");
})

app.get("/newsroom", (req, res)=>{
    res.render("newsroom");
})

app.get("/passenager", (req, res)=>{
    res.render("passenager");
})

app.get("/privacy_cookies", (req, res)=>{
    res.render("privacy_cookies");
})

app.get("/services", (req, res)=>{
    res.render("services");
})

app.get("/term_of_use", (req, res)=>{
    res.render("term_of_use");
})

app.get("/thingsto_know", (req, res)=>{
    res.render("thingsto_know");
})

app.get("/visit_monrovia", (req, res)=>{
    res.render("visit_monrovia");
})

app.get("/advertisting", (req, res)=>{
    res.render("advertisting");
})

app.get("/about", (req, res)=>{
    res.render("about");
})

app.get("/parking_transport", (req, res)=>{
    res.render("parking_transport");
})

app.get("/faqs", (req, res)=>{
    res.render("faqs");
})

app.get("/see_more", (req, res)=>{
    res.render("see_more");
})

app.get("/show_more", (req, res)=>{
    res.render("show_more");
})

app.get("/destination", (req, res)=>{
    res.render("destination");
})

app.get("/contact", (req, res)=>{
    res.render("contact");
})

// Start the server on this port 
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});