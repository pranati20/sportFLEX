const urlParams = new URLSearchParams(window.location.search);
const sports = urlParams.get("sports")
  ? urlParams.get("sports").split(",")
  : [];

// Fetch the venues from the server with the sports query parameter
fetch(`/api/sportsvenues?sports=${sports.join(",")}`)
  .then((response) => response.json())
  .then((data) => {
    const sportData = document.getElementById("sportData");

    // Function to render venues
    function renderVenues(venues) {
      sportData.innerHTML = ""; // Clear previous content
      venues.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = document.createElement("img");
        image.src = item.imagePath;
        image.alt = "Venue Image";

        const content = document.createElement("div");
        content.classList.add("content");

        const sport = document.createElement("p");
        sport.textContent = "Sport: " + capitalizeFirstLetter(item.sport);

        const players = document.createElement("p");
        players.textContent = "Players: " + item.players;

        const fromTime = document.createElement("p");
        fromTime.textContent = "From Time: " + item.fromTime;

        const toTime = document.createElement("p");
        toTime.textContent = "To Time: " + item.toTime;

        const address = document.createElement("p");
        address.textContent = "Address: " + item.address;

        const pricing = document.createElement("p");
        pricing.textContent = "Pricing: ₹" + item.pricing;

        content.appendChild(sport);
        content.appendChild(players);
        content.appendChild(fromTime);
        content.appendChild(toTime);
        content.appendChild(address);
        content.appendChild(pricing);
        card.appendChild(image);
        card.appendChild(content);

        sportData.appendChild(card);
      });
    }

    // Render all venues initially
    renderVenues(data);

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to filter venues by sport
    function filterVenuesBySport(sport) {
      console.log("Selected sport:", sport); // Log the selected sport
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        const cardSport = card.querySelector(".sport").textContent.trim();
        if (cardSport.toLowerCase() === sport.toLowerCase()) {
          card.style.display = "block"; // Show card if the sport matches
        } else {
          card.style.display = "none"; // Hide card if the sport doesn't match
        }
      });
    }

    // Add event listener to the "See Nearby Venues" button
    const seeNearbyVenuesButton = document.getElementById("seeNearbyVenues");
    if (seeNearbyVenuesButton) {
      seeNearbyVenuesButton.addEventListener("click", function () {
        const selectedSports = Array.from(
          document.querySelectorAll(
            '.sport-selection input[type="checkbox"]:checked'
          )
        ).map((checkbox) => checkbox.value);

        console.log("Selected sports:", selectedSports); // Log the selected sports

        // Filter venues based on the selected sports
        filterVenuesBySport(selectedSports);

        // Build the query string with selected sports
        const queryString =
          selectedSports.length > 0
            ? `?sports=${selectedSports.join(",")}`
            : "";

        console.log("Query string:", queryString); // Log the constructed query string

        // Redirect to the Venue page with the selected sports in the query string
        window.location.href = `/Venue.ejs${queryString}`;
      });
    }
  });
