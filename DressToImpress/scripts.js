const userImage = document.getElementById('userImage');
const clothingImage = document.getElementById('clothingImage');
const container = document.querySelector('.container');
const containerHeight = 500; // Fixed height of the box/container (in pixels)
const containerWidth = 300; // Fixed width of the box/container (in pixels)

// Initial position for clothing image
let clothingX = 0;
let clothingY = 0;

function uploadImages() {
    const userFile = document.getElementById('userUpload').files[0];
    const clothingFile = document.getElementById('clothingUpload').files[0];

    if (userFile) {
        const userReader = new FileReader();
        userReader.onload = function (event) {
            userImage.src = event.target.result; // Set the user's image
        };
        userReader.readAsDataURL(userFile);
    }

    if (clothingFile) {
        const clothingReader = new FileReader();
        clothingReader.onload = function (event) {
            clothingImage.src = event.target.result; // Set the clothing image
        };
        clothingReader.readAsDataURL(clothingFile);
    }
}

function resizeUserImage() {
    const userImageRect = userImage.getBoundingClientRect();
    
    // Define the maximum width and height based on the container
    const maxWidth = containerWidth;   // Container width
    const maxHeight = containerHeight;  // Container height

    // Calculate the scaling factor to fit the user image within the container dimensions
    const scaleX = maxWidth / userImageRect.width;
    const scaleY = maxHeight / userImageRect.height;
    const scaleFactor = Math.min(scaleX, scaleY); // Use the smaller scaling factor to maintain aspect ratio

    // Set the user image size based on the scaling factor
    userImage.style.width = `${userImageRect.width * scaleFactor}px`;
    userImage.style.height = `${userImageRect.height * scaleFactor}px`;

    // Center the user image within the container
    const centerX = (maxWidth - userImageRect.width * scaleFactor) / 2;
    const centerY = (maxHeight - userImageRect.height * scaleFactor) / 2;
    userImage.style.transform = `translate(${centerX}px, ${centerY}px)`; // Centering the image
}



function resizeClothing() {
    const userHeight = parseFloat(document.getElementById('userHeight').value);
    const clothingSize = document.getElementById('clothingSize').value;

    if (!userHeight) {
        alert('Please enter your height.');
        return;
    }


    const userHeightCm = userHeight;

    // Define real clothing dimensions (in cm) for small, medium, and large
    let clothingLength, clothingWidth;
    switch (clothingSize) {
        case 'small':
            clothingLength = 66;
            clothingWidth = 46;
            break;
        case 'medium':
            clothingLength = 70;
            clothingWidth = 50;
            break;
        case 'large':
            clothingLength = 74;
            clothingWidth = 54;
            break;
        default:
            alert('Please select a clothing size.');
            return;
    }

    // Calculate the scaling factor to fit the clothing proportionally in the box
    const scaleFactor = (clothingLength / userHeightCm); // Compare clothing length to user's height

    // Calculate how much space the clothing should take in the box (relative to user height)
    const clothingHeightInBox = containerHeight * scaleFactor; // Scaled clothing height in pixels

    // Set the clothing image size based on the calculated height in the box
    clothingImage.style.height = `${clothingHeightInBox}px`;
    clothingImage.style.width = 'auto'; // Maintain aspect ratio for width
}

// Function to move the clothing image, ensuring it stays within bounds
function moveClothing(direction) {
    const step = 10; // Pixels to move per click

    // Get the clothing image's current size
    const clothingRect = clothingImage.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    switch (direction) {
        case 'left':
            if (clothingX - step >= 0) {
                clothingX -= step;
            }
            break;
        case 'right':
            if (clothingX + step + clothingRect.width <= containerRect.width) {
                clothingX += step;
            }
            break;
        case 'up':
            if (clothingY - step >= 0) {
                clothingY -= step;
            }
            break;
        case 'down':
            if (clothingY + step + clothingRect.height <= containerRect.height) {
                clothingY += step;
            }
            break;
    }

    // Apply new position while preventing it from leaving the container
    clothingImage.style.transform = `translate(${clothingX}px, ${clothingY}px)`;
}

// Resize user image after it is loaded
userImage.onload = function() {
    resizeUserImage(); // Resize the user image to fit in the container
    resizeClothing(); // Resize clothing after user image is resized
};

// Resize clothing image after it is loaded
clothingImage.onload = resizeClothing;
