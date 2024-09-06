// Function to validate the form before submission
function validateForm() {
    var fname = document.getElementById("fname").value;
    var email = document.getElementById("email").value;
    var adr = document.getElementById("adr").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").value;
    var zip = document.getElementById("zip").value;
    var paymentMethod = document.getElementById("payment").value;
    var additionalPayment = document.getElementById("additional").value;
  
    // Simple form validation
    if (
      fname === "" ||
      email === "" ||
      adr === "" ||
      city === "" ||
      state === "" ||
      zip === "" ||
      paymentMethod === "choose" ||
      (paymentMethod === "online" && additionalPayment === "option0")
    ) {
      alert("Please fill in all the required fields.");
      return false;
    }
  
    // Email validation
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
  
    return true;
  }
  
  // Function to check if an email is valid
  function isValidEmail(email) {
    // Regular expression pattern for email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  // Function to handle the truck button animation
  function handleTruckButtonAnimation() {
    var truckButton = document.querySelector(".truck-button");
    var box = truckButton.querySelector(".box");
    var truck = truckButton.querySelector(".truck");
  
    if (truckButton.classList.contains("done")) {
      truckButton.classList.remove("animation", "done");
      gsap.set(truck, {
        x: 4,
      });
      gsap.set(truckButton, {
        "--progress": 0,
        "--hx": 0,
        "--bx": 0,
        "--box-s": 0.5,
        "--box-o": 0,
        "--truck-y": 0,
        "--truck-y-n": -26,
      });
      gsap.set(box, {
        x: -24,
        y: -6,
      });
    } else {
      if (validateForm()) {
        // Form is valid, proceed with truck button animation
        animateTruckButton();
      } else {
        // Form is not valid, show an error message or perform other necessary actions
      }
    }
  }
  
  // Function to animate the truck button
  function animateTruckButton() {
    var truckButton = document.querySelector(".truck-button");
    var box = truckButton.querySelector(".box");
    var truck = truckButton.querySelector(".truck");
  
    if (!truckButton.classList.contains("animation")) {
      truckButton.classList.add("animation");
  
      gsap.to(truckButton, {
        "--box-s": 1,
        "--box-o": 1,
        duration: 0.3,
        delay: 0.5,
      });
  
      gsap.to(box, {
        x: 0,
        duration: 0.4,
        delay: 0.7,
      });
  
      gsap.to(truckButton, {
        "--hx": -5,
        "--bx": 50,
        duration: 0.18,
        delay: 0.92,
      });
  
      gsap.to(box, {
        y: 0,
        duration: 0.1,
        delay: 1.15,
      });
  
      gsap.set(truckButton, {
        "--truck-y": 0,
        "--truck-y-n": -26,
      });
  
      gsap.to(truckButton, {
        "--truck-y": 1,
        "--truck-y-n": -25,
        duration: 0.2,
        delay: 1.25,
        onComplete() {
          gsap.timeline({
            onComplete() {
              truckButton.classList.add("done");
            },
          })
            .to(truck, {
              x: 0,
              duration: 0.4,
            })
            .to(truck, {
              x: 40,
              duration: 1,
            })
            .to(truck, {
              x: 20,
              duration: 0.6,
            })
            .to(truck, {
              x: 96,
              duration: 0.4,
            });
  
          gsap.to(truckButton, {
            "--progress": 1,
            duration: 2.4,
            ease: "power2.in",
          });
        },
      });
    }
  }
  

 // Event listener for Complete Order button click
var completeOrderButton = document.querySelector(".truck-button");
completeOrderButton.addEventListener("click", function (event) {
  event.preventDefault();

  if (validateForm()) {
    handleTruckButtonAnimation();
    setTimeout(function () {
      // Show the popup message
      var popup = document.getElementById("PopupMSG");
      popup.style.display = "block";
    }, 5000);
  } else {
    // Form is not complete
    console.log("Order form is not complete");
  }
});

// Close the popup when the close button is clicked
var closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function () {
  var popup = document.getElementById("PopupMSG");
  popup.style.display = "none";
});

// Generate PDF receipt when the download button is clicked
var downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", function () {
  generatePDFReceipt();
});

function generatePDFReceipt() {
  var element = document.querySelector(".container");
  var opt = {
    margin: 1,
    filename: "receipt.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  // Get the current date and time
  var currentDate = new Date();
  var currentTime = currentDate.toLocaleTimeString();
  var formattedDate = currentDate.toLocaleDateString();

  // Get the user input values from the order form
  var fullName = document.querySelector("#fname").value;
  var email = document.querySelector("#email").value;
  var address = document.querySelector("#adr").value;
  var city = document.querySelector("#city").value;
  var state = document.querySelector("#state").value;
  var zip = document.querySelector("#zip").value;

  // Get the selected payment method and additional selection
  var paymentMethod = document.querySelector("#payment").value;
  var additionalSelection = document.querySelector("#additional").value;

  // Get the custom message from the textarea
  var customMessage = document.querySelector("#message").value;

  var totalPriceValue = getQueryParam("totalPrice");

  // Generate a random order number
  var orderNumber = generateOrderNumber();

  var title = "Little Blossom";
  var quote = "When words just won’t do…send a flower!";
  var fullNameText = `Full Name: ${fullName}`;
  var emailText = `Email: ${email}`;
  var addressText = `Address: ${address}`;
  var cityText = `City: ${city}`;
  var stateText = `State: ${state}`;
  var zipText = `Zip: ${zip}`;

  var paymentMethodText = `Payment Method: ${paymentMethod}`;
  var additionalSelectionText = `Additional Selection: ${additionalSelection}`;
  var customMessageText = `Custom Message: ${customMessage}`;

  var totalPriceText = `Total Price: ₱${totalPriceValue}`;

  var receiptContent = `
    <div style="text-align: center;">
      <h3>"${title}"</h3>
      <p style="margin-top: 10px;">"${quote}"</p>
      <p style="margin-top: 10px;">Order #: ${orderNumber}</p>
      <p style="margin-top: 10px;">Time: ${currentTime}</p>
      <p style="margin-top: 10px;">Date: ${formattedDate}</p>
      <p style="margin-top: 10px;"></p>
      <hr>
      <p style="margin-top: 15px;">${fullNameText}</p>
      <p style="margin-top: 10px;">${emailText}</p>
      <p style="margin-top: 10px;">${addressText}</p>
      <p style="margin-top: 10px;">${cityText}</p>
      <p style="margin-top: 10px;">${stateText}</p>
      <p style="margin-top: 10px;">${zipText}</p>
      <p style="margin-top: 10px;"></p>
      <hr>
      <p style="margin-top: 15px;">${paymentMethodText}</p>
      <p style="margin-top: 10px;">${customMessageText}</p>
      <p style="margin-top: 10px;"></p>
      <hr>
      <p style="margin-top: 15px;">${totalPriceText}</p>
      <p style="margin-top: 15px;"></p>
      <hr>
      <p style="margin-top: 20px;">Email: littleblossom@gmail.com</p>
      <p style="margin-top: 10px;">Phone: 123-456-7890</p>
      <p style="margin-top: 10px;">&copy; 2023 Little Blossom. All rights reserved.</p>

    </div>
  `;

  element.innerHTML = receiptContent;

//RETURN HOME
var returnHomeButton = document.getElementById("returnHomeButton");
returnHomeButton.addEventListener("click", function () {
  window.location.href = "Main.html";
});

  html2pdf().from(element).set(opt).save();
}

function generateOrderNumber() {
  return Math.floor(Math.random() * 50) + 1;
}




//custom message area
function updateCounter() {
    var textarea = document.getElementById("message");
    var counter = document.getElementById("counter");
    var remainingChars = 200 - textarea.value.length;
    counter.innerText = "Characters remaining: " + remainingChars;
  }


  function handlePaymentChange() {
  var paymentSelect = document.getElementById("payment");
  var selection = paymentSelect.value;

  var additionalSelect = document.getElementById("additional-selection");
  if (selection === "online") {
    // Show additional selection
    additionalSelect.style.display = "block";
  } else {
    // Hide additional selection
    additionalSelect.style.display = "none";
  }
}

