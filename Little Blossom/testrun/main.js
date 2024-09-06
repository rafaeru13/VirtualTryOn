// Loading screen
window.addEventListener('load', function() {
  var loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.display = 'none'; // Hide the loading screen when the page finishes loading
});



// NAV BAR
let theEnd = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  var scrollTop = window.pageXOffset || document.documentElement.scrollTop;
  if (scrollTop > theEnd) {
    navbar.style.top = '-80px';
  } else {
    navbar.style.top = '0';
  }
  theEnd = scrollTop;
});



// SIDEBAR
document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.getElementById("cart-button");
  const sidebar = document.getElementById("sidebar");
  const closeButton = document.getElementById("close-button");

  cartButton.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent scrolling to the top
    sidebar.classList.add("open");
    openSidebar();
  });

  closeButton.addEventListener("click", function () {
    sidebar.classList.remove("open");
    closeSidebar();
  });
});

// Get the cart sidebar and close button
const cartSidebar = document.querySelector(".sidebar");
const closeButton = document.querySelector(".close-button");

// Add click event listener to the document
document.addEventListener("click", (event) => {
  const target = event.target;

  // Close the sidebar if the target is outside the sidebar or the cart button
  if (!cartSidebar.contains(target) && target !== cartButton && !target.classList.contains("add-to-cart") && !target.classList.contains("remove-button")) {
    cartSidebar.classList.remove("open");
    closeSidebar();
  }
});

function openSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var content = document.querySelector('.content');

  // Move other elements to the left
  var otherElements = document.querySelectorAll('.section');
  otherElements.forEach(element => {
    element.style.marginLeft = '250px'; // Adjust the value based on your sidebar width
  });
  sidebar.classList.add('active');
  content.style.marginLeft = '250px'; // Adjust the value based on your sidebar width
}

function closeSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var content = document.querySelector('.content');

  sidebar.classList.remove('active');
  content.style.marginLeft = '0';

  // Move other elements back to their original position
  var otherElements = document.querySelectorAll('.section');
  otherElements.forEach(element => {
    element.style.marginLeft = '0';
  });
}



// ADD TO CART 
// Get all the "Add to Cart" buttons
const addToCartButton = document.querySelectorAll(".add-to-cart");

// Add click event listeners to each button
addToCartButton.forEach((button) => {
  button.addEventListener("click", addToCart);
});

// Get the cart button and quantity element
const cartButton = document.getElementById("cart-button");
const quantityElement = document.querySelector(".quantity");

// Set the initial quantity to 0
let quantity = 0;

// Function to update the total price in the sidebar
function updateTotalPrice() {
  const cartItems = document.querySelectorAll(".cart-item");
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const priceText = item.querySelector(".price").textContent;
    const price = parseFloat(priceText.replace("PHP ", ""));
    const quantity = parseInt(item.querySelector(".quantity-value").textContent);
    totalPrice += price * quantity;
  });

  const totalElement = document.querySelector(".total-price");
  totalElement.textContent = `Total Price:₱ ${totalPrice.toFixed(2)}`;

   // Save the total price to localStorage
   localStorage.setItem("totalPrice", totalPrice.toFixed(2));
}

// Function to update the quantity
function updateQuantity(change) {
  quantity += change;
  quantityElement.textContent = quantity;
}

// Function to handle the "Add to Cart" action
function addToCart(event) {
  const product = event.target.parentElement;
  const productName = product.querySelector("h3").textContent;

  // Check if the item is already in the cart
  const cartItems = document.querySelectorAll(".cart-item");
  for (const cartItem of cartItems) {
    const itemTitle = cartItem.querySelector("h4").textContent;
    if (itemTitle === productName) {
      alert("Item is already in the cart.");
      return; // Exit the function if item is already in the cart
    }
  }

  const productImage = product.querySelector("img").src;
  const productPriceText = product.querySelector("p").textContent;
  const productPrice = parseInt(productPriceText.replace("₱ ", ""));

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.innerHTML = `
    <div class="item-image">
      <img src="${productImage}" alt="${productName}" class="cart-item-image">
      <div class="check-animation"></div>
    </div>
    <div class="item-details">
      <div class="item-info">
        <h4>${productName}</h4>
        <p class="price">${productPriceText}</p>
      </div>
      <div class="item-quantity">
        <button class="remove-button">-</button>
        <span class="quantity-value">1</span>
        <button class="add-button">+</button>
      </div>
    </div>
  `;

  // Add the cart item to the sidebar
  const cartItemsContainer = document.querySelector(".cart-items");
  cartItemsContainer.appendChild(cartItem);

  // Add click event listeners to the remove and add buttons
  const removeButton = cartItem.querySelector(".remove-button");
  const addButton = cartItem.querySelector(".add-button");

  removeButton.addEventListener("click", () => {
    const quantityValue = cartItem.querySelector(".quantity-value");
    const currentQuantity = parseInt(quantityValue.textContent);
    if (currentQuantity > 1) {
      quantityValue.textContent = currentQuantity - 1;
      updateTotalPrice();
      updateQuantity(-1);
    } else {
      cartItemsContainer.removeChild(cartItem);
      updateTotalPrice();
      updateQuantity(-1);
    }
  });

  addButton.addEventListener("click", () => {
    const quantityValue = cartItem.querySelector(".quantity-value");
    quantityValue.textContent = parseInt(quantityValue.textContent) + 1;
    updateTotalPrice();
    updateQuantity(1);
  });

  // Update the total price and quantity
  updateTotalPrice();
  updateQuantity(1);

}

// Get the checkout button
const checkoutButton = document.getElementById("checkout-button");

// Add click event listener to the checkout button
checkoutButton.addEventListener("click", checkout);


// Function to handle the checkout process
function checkout() {
  // Clear the shopping list
  const cartItemsContainer = document.querySelector(".cart-items");

  // Check if the cart is empty
  if (cartItemsContainer.children.length === 0) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }

  cartItemsContainer.innerHTML = "";

 // Get the total price
 const totalPrice = localStorage.getItem("totalPrice");

 // Redirect to the desired HTML page along with the total price as a query parameter
 window.location.href = `checkout.html?totalPrice=${totalPrice}`;


// Get the checkout button
const checkoutButton = document.getElementById("checkout-button");

// Add click event listener to the checkout button
checkoutButton.addEventListener("click", checkout);

// Load the total price from localStorage if available
window.addEventListener("load", () => {
  const totalPrice = localStorage.getItem("totalPrice");
  if (totalPrice) {
    const totalElement = document.querySelector(".total-price");
    totalElement.textContent = `Total Price:₱ ${totalPrice}`;
  }
})
  // Reset the quantity and update the UI
  quantity = 0;
  quantityElement.textContent = quantity;

  // Show a confirmation message
  alert("Redirecting...");

};


  
//scroll trigger text animation 
function animateOnScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}
  
const textElements = document.querySelectorAll('.scroll-animation');
  
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};
  
const observer = new IntersectionObserver(animateOnScroll, options);
  
textElements.forEach(textElement => {
  observer.observe(textElement);
});


//DELIVERY OPTIONS--Free Delivery
const options1 = document.querySelectorAll('#delivery-options li');

options.forEach(option => {
  option.addEventListener('click', () => {
    console.log(`Clicked on: ${option.querySelector('h3').textContent}`);
  });
});
