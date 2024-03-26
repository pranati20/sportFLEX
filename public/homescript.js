// Fetch data from server
fetch("/api/sportsvenues")
  .then((response) => response.json())
  .then((data) => {
    const sportData = document.getElementById("sportData");

    // Function to render venues
    function renderVenues(venues) {
      const sportData = document.getElementById("sportData");
      if (sportData) {
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
    }

    // Render all venues initially
    renderVenues(data);
  });

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterVenuesBySport(selectedSports) {
  console.log("Selected sports:", selectedSports); // Log the selected sports

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const cardSport = card.querySelector(".sport").textContent.trim();
    const isSportMatch = selectedSports.includes(cardSport.toLowerCase());
    if (isSportMatch) {
      card.style.display = "block"; // Show card if the sport matches
    } else {
      card.style.display = "none"; // Hide card if the sport doesn't match
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the "See Nearby Venues" button
  const seeNearbyVenuesButton = document.getElementById("seeNearbyVenues");
  if (seeNearbyVenuesButton) {
    seeNearbyVenuesButton.addEventListener("click", function () {
      const selectedSports = Array.from(
        document.querySelectorAll(
          '.sport-selection input[type="checkbox"]:checked'
        )
      ).map((checkbox) => checkbox.value);

      // Build the query string with selected sports
      const queryString =
        selectedSports.length > 0 ? `?sports=${selectedSports.join(",")}` : "";

      // Redirect to the Venue page with the selected sports in the query string
      window.location.href = `/Venue.ejs${queryString}`;
    });
  }
});
// Event listener for the "Generate Team ID" button
document.getElementById("generateTeamId").addEventListener("click", () => {
  const teamName = document.getElementById("teamName").value;
  const numPlayers = document.getElementById("numPlayers").value;

  // Send a POST request to the server with the team name and number of players
  fetch("/generateTeamId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamName: teamName, numPlayers: numPlayers }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the team ID in the popup
      document.getElementById("teamIdDisplay").innerText = data.teamId;

      // Generate the QR code from the team ID
      let qrcode = new QRCode(document.getElementById("qrcodeContainer"), {
        text: data.teamId,
        width: 128,
        height: 128,
      });

      // Show the popup
      document.getElementById("popupContainer").style.display = "flex";
    });
});

// Event listener for the close button in the popup
document.querySelector(".close").addEventListener("click", () => {
  // Hide the popup
  document.getElementById("popupContainer").style.display = "none";

  // Clear the QR code container
  document.getElementById("qrcodeContainer").innerHTML = "";
});
// Event listener for the "Show Team QR" button
// Event listener for the "Show Team QR" button
document.getElementById("generateQRButton").addEventListener("click", () => {
  const teamId = document.getElementById("teamIdInput").value; // Assuming you have an input field with id 'teamIdInput' for entering the team ID

  // Send a POST request to the server with the team ID
  fetch("/verifyTeamId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamId: teamId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isValid) {
        // Clear the QR code container
        document.getElementById("qrcodeContainer").innerHTML = "";

        // Generate the QR code from the team ID
        let qrcode = new QRCode(document.getElementById("qrcodeContainer"), {
          text: teamId,
          width: 128,
          height: 128,
        });

        // Show the popup
        document.getElementById("popupContainer").style.display = "flex";
      } else {
        alert("The entered team ID is not registered.");
      }
    });
});

// Event listener for the close button in the popup
document.querySelector(".close").addEventListener("click", () => {
  // Hide the popup
  document.getElementById("popupContainer").style.display = "none";

  // Clear the QR code container
  document.getElementById("qrcodeContainer").innerHTML = "";
});
