import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import mailchimp from '@mailchimp/mailchimp_marketing';




// Initialize environment variables
dotenv.config();

// Initialize app
const app = express();
const port = 3000;

app.locals.moment=moment;
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Define API URL and headers
const aipNinjas_url = "https://api.apininjas.com/aviation/v1/flight/status";
const avaitionStack_url = "https://api.aviationstack.com/v1/"
const avaition_api_key= process.env.Avaition_stack_Api_key
const airport_code = process.env.AIRPORT_CODE;

// Define routes home routes
app.get("/", (req, res)=>{
    res.render("home");
})
// Define routes
app.get("/flight-status", async (req, res) => {
    try {
        const response = await axios.get(avaitionStack_url + "flights", {
            params: {
                access_key: avaition_api_key,
                arr_iata: airport_code, // IATA code for Roberts International Airport, Liberia
        limit: 100, // Adjust this as needed
            }
        });
        // Handle the response data 
        const flights = response.data.data; 
        // console.log(flights);
        console.log("API Key:", avaition_api_key);
        res.render("flight_status.ejs", {flightLib: flights});
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

// Mailchimp API configuration
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  });
  
  // POST route for subscribing
  app.post('/subscribe', async (req, res) => {
    const { email } = req.body; // Capture email from the form
    const data = {
      email_address: req.body.email,  // Use the captured email
      status: 'subscribed'
    };

    console.log(data);
  
    try {
      await mailchimp.lists.addListMember('2050a26d2c', data);
      res.send('Successfully subscribed!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error subscribing user');
    }
  });
  
// Route to handle dynamic content ends

app.get("/flight_info", async (req, res)=>{
    try {
        const response = await axios.get(avaitionStack_url + 'flights', {
          params: {
            access_key: avaition_api_key,
            dep_iata: airport_code // Flights departing from Liberia
          },
        });
    
        // Extract flight data
        const flights = response.data.data;
        console.log(flights)
        res.render("flight_info", {airlineLib: flights})
      } catch (error) {
        console.error('Error fetching flight data:', error.message);
      }
    
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