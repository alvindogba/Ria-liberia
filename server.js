import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import mailchimp from '@mailchimp/mailchimp_marketing';
import pkg from 'pg'; // Adjusted import for PostgreSQL client
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';


// Initialize environment variables
dotenv.config();
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const port = 8080;
app.locals.moment=moment; //Package to convert international time to local time

// Set up multer for file uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Load the SQL query from the file

// Middleware to parse JSON request bodies
app.use(express.json()); 
app.set('view engine', 'ejs');

// Define API URL and headers
const aipNinjas_url = "https://api.apininjas.com/aviation/v1/flight/status";
const avaitionStack_url = "https://api.aviationstack.com/v1/"
const avaition_api_key= process.env.Avaition_stack_Api_key
const airport_code = process.env.AIRPORT_CODE;
const news_url=process.env.news_api_url;
const news_api_key= process.env.news_api_key;

// Load SQL query from file
const queryFilePath = path.join(__dirname, 'query.sql');
const sqlQuery = fs.readFileSync(queryFilePath, 'utf8');


const {Client} = pkg;
// Extablixshing database connection 
const db = new Client({
    user: process.env.DB_USER ,
    host: process.env.DB_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.port,
    ssl: {
        rejectUnauthorized: false, // Use this if you're connecting to a self-signed certificate
    },
});
db.connect()
    .then(() => {
        // CREATING TABLES ======================================
        return db.query(sqlQuery);
    })
    .then(() => {
        console.log('Table created successfully');
    })
    .catch(err => {
        console.error('Error executing query', err.stack);
    })
 




app.get("/", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("home", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

//=============== ROUTES FOR THE FLIGHT SEARCH ON THE HOME PAGE ===============================================



//============================================== Endpoint for searching by flight number
app.post('/api/search/flight-number', async (req, res) => {
    const { flightNumber } = req.body;

    // Define the base API URL and access key
    const apiUrl = `${avaitionStack_url}flights`;
    
    try {
        const response = await axios.get(apiUrl, {
            params: {
                access_key: avaition_api_key,
                flight_iata: flightNumber, // Use the correct parameter for flight number
                limit: 100,
            },
        });

        // Send the response data back to the client
        res.json(response.data);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Error fetching flight data' });
    }
});


//========================================= Endpoint for searching by route and date
app.post('/api/search/route', async (req, res) => {
    const { from, to, date } = req.body;
    console.log(from, to, date)
    // Replace with your actual API endpoint
    const apiUrl = `${avaitionStack_url}routes`;

    try {
        const response = await axios.get(apiUrl, {
            params: {
                access_key: avaition_api_key,
                dep_iata: from, // IATA code for departure airport
                arr_iata: to,   // IATA code for arrival airport
                flight_date: date, // Optional: specify the date
                limit: 100,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching flight data:', error.response ? error.response.data : error.message);

        // Check if the error has a response from the external API
        if (error.response) {
            // Send the error message from the external API
            res.status(error.response.status).json({
                error: error.response.data.error.message || 'Error fetching flight data',
                details: error.response.data.message,
            });
        } else {
            // If there's no response, send a generic error message
            res.status(500).json({ error: 'Error fetching flight data' });
        }}
});

// Endpoint========================================== for searching by date and time
app.post('/api/search/date', async (req, res) => {
    const { date, time } = req.body;
    // Replace with your actual API endpoint
    const apiUrl = `${avaitionStack_url}flights?date=${date}&time=${time}`;

    try {
        const response = await axios.get(apiUrl, {
            params: {
                access_key: avaition_api_key,
                flight_iata: flightNumber, // Use the correct parameter for flight number
                limit: 100,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching flight data' });
    }
});





// Define routes
app.get("/flight-status", async (req, res) => {
    try {
        const response = await axios.get(avaitionStack_url + "flights", {
            params: {
                access_key: avaition_api_key,
                arr_iata: 'ROB', // IATA code for Roberts International Airport, Liberia
        limit: 100, 
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

// POST route for subscribing
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email); // Log the received email
  
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }
  
    const data = {
      email_address: email,
      status: 'subscribed'
    };
  
    console.log('Sending data to Mailchimp:', data); // Log the data sent to Mailchimp
  
    try {
      await mailchimp.lists.addListMember('2050a26d2c', data);
      res.json({ message: 'Successfully subscribed!' });
    } catch (error) {
      console.error('Error subscribing:', error);
      res.status(500).json({ message: 'Error subscribing user' });
    }
  });
  
  
// Route to handle dynamic content ends

app.get("/flight_info", async (req, res)=>{
    try {
        const response = await axios.get(avaitionStack_url + 'flights', {
          params: {
            access_key: avaition_api_key,
            dep_iata: 'ROB' // Flights departing from Liberia
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

app.get("/newsroom", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("newsroom", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/business_opportities", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("business_opportities", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/passenager", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("passenager", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/privacy_cookies", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("privacy_cookies", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/services", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("services", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/term_of_use", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("term_of_use", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/thingsto_know", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("thingsto_know", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/visit_monrovia", async(req, res)=>{
    try {
          // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const hlinkresult = await db.query(`SELECT * FROM  headerLinks`)
        const result = await db.query(`SELECT hotel_name, description, location, website, large_url, url_1, url_2, url_3 FROM hotels
            JOIN hotel_image ON hotels.id = hotel_image.hotel_id`)
            res.render("visit_monrovia", {hotels: result.rows, searchResult: hlinkresult.rows});
    } catch (error) {
        console.error('Error fetching flight data:', error.message);
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }

})

app.get("/advertisting", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("advertisting", {searchResult: result.rows, title: "Advertising | RIA Website"});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/about", async (req, res) => {
    try {
        const aboutResult = await db.query(`SELECT * FROM about`);
        // QUERING through the links in the database to display it in the searct bar on the about page =====
        const result = await db.query(`SELECT * FROM  headerLinks`)

        res.render("about", {
            ab_content: aboutResult.rows,
            title: 'About | RIA Website',
            searchResult: result.rows
        });
    } catch (error) {
        console.error('Error fetching about content data:', error.stack);
        res.status(500).send('An error occurred while fetching the about content data.');
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/parking_transport", async (req, res) => {
    try {
        const parkTranResult = await db.query(`SELECT * FROM parking_tran`);
        // QUERING through the links in the database to display it in the searct bar on the home page ===
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("parking_transport", {searchResult: result.rows, title: "Parking & Transport | RIA Website",  prakT_content: parkTranResult.rows,});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/faqs", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("faqs", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/see_more", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("see_more", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/show_more", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("show_more", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/destination", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("destination", {searchResult: result.rows});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

app.get("/contact", async (req, res) => {
    try {
        // QUERING through the links in the database to display it in the searct bar on the home page ===================
        const result = await db.query(`SELECT * FROM  headerLinks`)
        res.render("contact", {searchResult: result.rows, title: "Contact | RIA Website"});
   
    } catch (error) {
        console.error("Failed to make request:", error.response ? error.response.data : error.message);
        res.status(500).send("Failed to fetch data, please try again.");
    }
});

//////////////////////////////////////////////////////////////////////
//Administrative Access Only 
app.get("/add_hotel_image", async(req, res)=>{
    try {
        const result = await db.query(`SELECT * FROM hotels`)
            res.render("add_hotel_image", {hotels: result.rows});
    } catch (error) {
        console.error('Error fetching flight data:', error.message);
    }
})

// Administrator
app.get('/admin', async (req, res)=>{
    
    try {
        res.render('admin/admin-views/admin', {
            title: 'Admin Dashbord | RIA Website'
        });
    } catch (error) {
        console.error('Error loading the admin dashboard page:', error.stack);
        res.status(500).send('An error occurred while displaying.');
    }
})

app.get("/ad_about", async (req, res) => {
    try {
        const aboutResult = await db.query(`SELECT * FROM about`);
      
        res.render("admin/admin-views/admin_about", {
            ab_content: aboutResult.rows,
            title: 'Admin About | RIA Website'
        });
    } catch (error) {
        console.error('Error fetching about content data:', error.stack);
        res.status(500).send('An error occurred while fetching the about content data.');
    }
});

app.get("/ad_park_tran", async (req, res) => {
    try {
        const parkTranResult = await db.query(`SELECT * FROM parking_tran`);
        
        // Render the EJS template with the retrieved data
        res.render("admin/admin-views/admin_parking_transport", {
            prakT_content: parkTranResult.rows,
            title: 'Admin Parking & Transport | RIA Website'
        });

      
    } catch (error) {
        console.error('Error loading parking/transport page:', error.stack);
        res.status(500).send('An error occurred while loading the parking/transport page.');
    }
});

// Handle form submission
app.post('/add-images', async (req, res) => {
    try {
        // Extracting the data from the form
        const { large_url, url_1, url_2, url_3, hotel_id } = req.body; 
        // Inserting the data into the database using parameterized query
        const query = `INSERT INTO hotel_image (large_url, url_1, url_2, url_3, hotel_id) 
                       VALUES ($1, $2, $3, $4, $5)`;
        // Parameterized values from the form
        const values = [large_url, url_1, url_2, url_3, hotel_id];
        // Execute the query
        await db.query(query, values);
        // Redirect or respond with a success message
        res.redirect('/add_hotel_image');  // Redirect back to the form or another page

    } catch (error) {
        console.error('Error inserting image data:', error.message);
        res.status(500).send('An error occurred while saving the images.');
    }
});

// Handle form about submission
app.post('/ad_about_form', upload.single('image'), async (req, res) => {
    try {
        const photo = req.file ? req.file.buffer : null;
        const photoType = req.file ? req.file.mimetype : null; // Capture MIME type
        const { label, content } = req.body; 

        // Validate required fields
        if (!label || !content) {
            return res.status(400).send('Label and Content are required.');
        }

        // Inserting the data into the database using parameterized query
        const query = `INSERT INTO about (label, image, content, photoType) 
                       VALUES ($1, $2, $3, $4)`;
        // Parameterized values from the form
        const values = [label, photo, content, photoType];
        // Execute the query
        await db.query(query, values);
        // Redirect or respond with a success message
        res.redirect('/ad_about');  // Redirect back to the form or another page

    } catch (error) {
        console.error('Error inserting image data:', error.stack); // Use stack for more details
        if (error.code === '23505') { // Unique violation
            res.status(400).send('Duplicate entry detected.');
        } else if (error.code === '22021') { // Character not in encoding
            res.status(400).send('Invalid character encoding in input.');
        } else {
            res.status(500).send('An error occurred while saving the images.');
        }
    }
});

// Handle parking & transport form submission
app.post('/ad_park_tran_form', async (req, res) => {
    try {
        const { pt_label, pt_content } = req.body;

        // Validate required fields
        if (!pt_label || !pt_content) {
            return res.status(400).send('Label and Content are required.');
        }

        // Inserting the data into the correct table using parameterized query
        const query = `INSERT INTO parking_tran (pt_label, pt_content) 
                       VALUES ($1, $2)`;
        // Parameterized values from the form
        const values = [pt_label, pt_content];
        // Execute the query
        await db.query(query, values);

        // Redirect or respond with a success message
        res.redirect('/ad_park_tran');  // Redirect back to the form or another page

    } catch (error) {
        if (error.code === '23505') { // Unique violation
            res.status(400).send('Duplicate entry detected.');
        } else {
            console.error('Error while saving data:', error.stack);  // Log the error
            res.status(500).send('An error occurred while saving the data.');
        }
    }
});


// route for editing the about content
app.post('/ad_about_form/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;  // Get the ID from the URL
        const photo = req.file ? req.file.buffer : null;
        const photoType = req.file ? req.file.mimetype : null; 
        const { label, content } = req.body;

        // Validate required fields
        if (!label || !content) {
            return res.status(400).send('Label and Content are required.');
        }

        // Prepare the update query (without updating the image if none provided)
        let query = `UPDATE about SET label = $1, content = $2`;
        const values = [label, content];

        if (photo) {
            query += `, image = $3, photoType = $4 WHERE id = $5`;
            values.push(photo, photoType, id);
        } else {
            query += ` WHERE id = $3`;
            values.push(id);
        }

        // Execute the query
        await db.query(query, values);

        // Redirect or respond with a success message
        res.redirect('/ad_about');
    } catch (error) {
        console.error('Error updating about content:', error.stack);
        res.status(500).send('An error occurred while updating the about content.');
    }
});

// route for editing the parking & transport content
app.post('/ad_park_tran_form/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Get the ID from the URL

        const { pt_label, pt_content } = req.body;

        // Validate required fields
        if (!label || !content) {
            return res.status(400).send('Label and Content are required.');
        }

        // Prepare the update query (without updating the image if none provided)
        let query = `UPDATE parking_tran SET pt_label = $1, pt_content = $2`;
        const values = [pt_label, pt_content];

        if (id) {
            query += ` WHERE id = $3`;
            values.push(id);
        }

        // Execute the query
        await db.query(query, values);

        // Redirect or respond with a success message
        res.redirect('/ad_park_tran');
    } catch (error) {
        console.error('Error updating parking and transport content:', error.stack);
        res.status(500).send('An error occurred while updating the about content.');
    }
});

// Shutdown handler
process.on('SIGINT', async () => {
    console.log('Closing database connection...');
    await db.end(); // Close the database connection
    console.log('Database connection closed.');
    process.exit(0); // Exit the process
});
// Start the server on this port 
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});