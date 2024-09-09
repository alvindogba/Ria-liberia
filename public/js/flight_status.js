// $(document).ready(function(){
//     $("#myTab a").click(function(e){
//         e.preventDefault();
//         $(this).tab("show");
//     });
// });   
document.getElementById('arrival').addEventListener('click', function () {
  console.log('Arrival button clicked'); // Log the click event
  fetch('/arrival')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch arrivals');
      }
      return response.text();
    })
    .then(data => {
      console.log('Data received for arrivals:', data); // Log the received data
      document.getElementById('data-content').innerHTML = data;
    })
    .catch(err => console.error('Error fetching arrivals:', err));
});

document.getElementById('departure').addEventListener('click', function () {
  console.log('Departure button clicked'); // Log the click event
  fetch('/departures')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch departures');
      }
      return response.text();
    })
    .then(data => {
      console.log('Data received for departures:', data); // Log the received data
      document.getElementById('data-content').innerHTML = data;
    })
    .catch(err => console.error('Error fetching departures:', err));
});