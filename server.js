import express from 'express';

const app = express();
const port = 3000;

// Setting views engin and peasing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res)=>{
    res.render("home")
})
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`)
})