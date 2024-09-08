// $(document).ready(function(){
//     $("#myTab a").click(function(e){
//         e.preventDefault();
//         $(this).tab("show");
//     });
// });   

document.getElementById('arrival').addEventListener('click', function () {
    fetch('/arrivals')
      .then(response => response.text())
      .then(data => {
        document.getElementById('data-content').innerHTML = data;
      })
      .catch(err => console.error('Error:', err));
  });

  document.getElementById('departure').addEventListener('click', function () {
    fetch('/departures')
      .then(response => response.text())
      .then(data => {
        document.getElementById('data-content').innerHTML = data;
      })
      .catch(err => console.error('Error:', err));
  });