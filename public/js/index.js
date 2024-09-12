//The script for the scroll up arrow

var scrollUpArrow = document.getElementById("scroll_arrow");

    $(scrollUpArrow).fadeOut()

// trying Scroll behavior

window.onscroll= function scrollFunction(){

  var myHeader=$("header");
    if (document.documentElement.scrollTop > 100 ){
      $(myHeader).slideUp(400);
  }
  else{$(myHeader).slideDown(800);}

  if (document.documentElement.scrollTop > 700 ) {
    
    $(scrollUpArrow).fadeIn(500)
  
  }
  else{
    $(scrollUpArrow).fadeOut(500)
  }
} // when a scroll gets detected on the window it should look for where the scrollFunction() was created and run it

function flightDropDown(){  
  var flightLink=$(".flight_link");
  var flightDrop=$(".flight_dropdown");
  $(flightLink).on("mouseenter", function(){
    $(flightDrop).style.display="block";
  });
}

flightDropDown();
 //Creating a function that toggle the handburger menu 

faqsDropDown();
function showNavDropDown(){
    
$(".fa-bars").on("click", function(){
  //Displaying the handburger drop down
    $(this).toggleClass("fa-x");
    $(".handBurger_menu_dropdown").toggleClass("show_hand_burger");
});
//Displaying the FLIGHT AND TERMINAL INFORMATION DROP DOWN
$(".flight_btn").on("click", function(){
  $(".flight_drop_down1").toggleClass("show_flight_cont");
});

$(".terminal_info_btn").on("click", function(){
  $(".terminal_drop_down1").toggleClass("show_ter_info");
});

}
showNavDropDown();

//Creating a callback function to display the find your flight options and also rotate the angle down
var angleDown=$(".fa-angle-down"); 
var chooseFlightDropDown=$(".find_ur_flight_drop_down");
var degree=180;
var greede=0;

angleDown.on("click", function(){
    chooseFlightDropDown.toggleClass("show");
    $(this).toggleClass("rotate_angle");
});

//Creating Image slider to change the hero Image  after every three seconds
var slideIndex=0; // This variable is declear to keep track of the current slide that is displayed
showImg();
function showImg(){
 //Getting all of the images and looping through them to set their display to none
 var images=$(".background_image");
 var circle=$(".dot");
 let i;
  for(i = 0; i < images.length; i++){
  
    images[i].style.display="none";    
 
  }

  slideIndex++;
  if (slideIndex > images.length){slideIndex=1}
 
  images[slideIndex - 1].style.display="block";
 

  // looping through the dotted to display inline with the image
  for (i = 0; i < circle.length; i++){
    circle[i].className = circle[i].className.replace(" active", "");
  }
 circle[slideIndex-1].className += " active";
  setTimeout(showImg, 5000);
}

//This is a function that display the FAQS Question to bring out the Answer for Each of the question
function faqsDropDown(){
  var ques=$(".question");

let i;
for(i = 0; i < ques.length; i++){
  ques[i].addEventListener("click", function(){
 //togging between showing and hidding answer
    var ans= this.nextElementSibling;
    
    $(ans).fadeToggle();
  });
}
}

// Creating the Latest News section functionality
var litNewsIndex = 1;
displaySlides(litNewsIndex);

// Function to slide image forward or backward
function pushSlide(n) {
  displaySlides(litNewsIndex += n);
}

function displaySlides(n) {
  var litNews_slides = $(".news_slider");
  
  // Adding a conditional statement for the slides
  if (n > litNews_slides.length) {
    litNewsIndex = 1;
  }
  if (n < 1) {
    litNewsIndex = litNews_slides.length;
  }
  
  for (let l = 0; l < litNews_slides.length; l++) {
    litNews_slides[l].style.display = "none";
  } 
  
  litNews_slides[litNewsIndex - 1].style.display = "flex";
}

//example

//Animation Function

function showAnimation(){
  
//Animation for the New Website section on the index page
const indexSection1 = document.querySelector(".new_website_grid_container")
const indexSection2 = document.querySelector(".flight_today_container")
const indexSection3 = document.querySelector(".latest_news_in_monrovia_container")
const indexSection4 = document.querySelector(".all_latest_news")
const indexSection5 = document.querySelector(".Our_Airlines")
const indexSection6 = document.querySelector(".all_latest_news")
const indexSection7 = document.querySelector(".subscribe_to_newsletter_container")

//initializing option to pass it as arguement to the observer
const options = {
  rootMargin: "0px",
  threshold: 0.25
}

const observer1 = new IntersectionObserver(
  newWebsite,
  options
)


observer1.observe(indexSection1)
observer1.observe(indexSection2)
observer1.observe(indexSection3)
observer1.observe(indexSection4)
observer1.observe(indexSection5)
observer1.observe(indexSection6)
observer1.observe(indexSection7)
//initializing a callbackFunction to be pass as an arguement also to the observer
function newWebsite(entries){
entries.forEach(entry => {
  if(entry.isIntersecting){
    //Animating the index section 1
    if(entry.target.id === 'newWebsite'){
      entry.target.classList.add("new_website_slideup")
    }
    //Animating the index section 2
    if(entry.target.id === 'flightToday'){
      entry.target.classList.add("flightTodayAnimation")
    }
    //Animating the index section 3
    if (entry.target.id === 'latestNews'){
      entry.target.classList.add("flightTodayAnimation")
    }

    //iAnimation the index section 4
    if(entry.target.id === 'ourAirLines'){
      entry.target.classList.add("our_airline_animation")
    }

    if(entry.target.id === 'subscribe_to_newsletter_container'){
      entry.target.classList.add("animateSubscribe")
    }
     observer1.unobserve(entry.target)
  }
})
}

}


function airlineFunction(){
  const airlineSection1 = document.querySelector(".Our_Airlines")

  //initializing option to pass it as arguement to the observer
let option = {
rootMargin: "0px",
threshold: 0.25
}

const observer10= new IntersectionObserver(
airLine,
option
)

observer10.observe(airlineSection1)
//initializing 
function airLine(entries){
  entries.forEach(entry => {
    if(entry.isIntersecting){
      if(entry.target.id === 'ourSecondAirline'){
        entry.target.classList.add("our_airline_animation")
      }
    }
  })
}
}

// Js for the box model on the newsletter
// document.getElementById('subscribeForm').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const email = document.getElementById('subscriberName').value;

//   try {
//     const response = await fetch('/subscribe', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email })
//     });

//     const result = await response.json();  // Parse the response as JSON
//     document.getElementById('subscribeMessage').textContent = result.message;

//     const modal = new bootstrap.Modal(document.getElementById('subscribeModal'));
//     modal.show();
//   } catch (error) {
//     document.getElementById('subscribeMessage').textContent = 'Subscription failed!';
//     const modal = new bootstrap.Modal(document.getElementById('subscribeModal'));
//     modal.show();
//   }
// });
// JavaScript for the header search bar
function headerSearchBar() {
  let hSearchInput = document.querySelector(".header-input");

  // Fetch the local JSON file
  const fetchLinks = async () => {
    try {
      const response = await fetch('json/hearder_search.json'); // Ensure the path is correct
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching the JSON data:', error);
    }
  };

  // Display search results with animation
  const displayResults = (results) => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<li>No results found</li>';
    }
  
    results.forEach((link) => {
      const li = document.createElement('li');
      li.classList.add('result-item'); // Add class for styling
      li.innerHTML = `<a href="${link.url}">${link.title}</a> - ${link.category}`;
      resultsContainer.appendChild(li);
    });
  
    // Show the results container with animation
    resultsContainer.style.display = 'block';  // Display results container
    setTimeout(() => {
      resultsContainer.classList.add('show');  // Trigger fade/scale animation
    }, 10); // Slight delay ensures animation starts after display is set
  };

  const hideResults = () => {
    const resultsContainer = document.getElementById('results');
  
    // Start fading out the results
    resultsContainer.classList.remove('show');  // Remove the animation class
  
    // Set a timeout to hide the container completely after the animation is done
    setTimeout(() => {
      resultsContainer.style.display = 'none';  // Fully hide the container
    }, 400);  // Matches the 0.4s transition duration
  };
  


  // Filter links based on the search term
  const filterLinks = (links, searchTerm) => {
    return links.filter(link => 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Sort links alphabetically by title
  const sortLinks = (links) => {
    return links.sort((a, b) => a.title.localeCompare(b.title));
  };

  // Handle search input and filter/sort links
  const handleSearch = async () => {
    const searchTerm = hSearchInput.value;
    let links = await fetchLinks(); // Get the links data from the JSON file

    if (!searchTerm.trim()) {
      // Hide the result box if the search term is empty
      hideResults();
      return;
    }

    links = filterLinks(links, searchTerm); // Filter the links
    links = sortLinks(links); // Sort the links alphabetically
    displayResults(links); // Display the filtered and sorted results
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Add event listener for the search bar input with debounce
  const debouncedSearch = debounce(handleSearch, 300);
  hSearchInput.addEventListener('input', debouncedSearch);
}

