const userImage = document.getElementById('userImage');
const clothingImage = document.getElementById('clothingImage');
const container = document.querySelector('.container');
const containerHeight = 500; // Fixed height of the box
const containerWidth = 300; // Fixed width of the box

// Initial position for clothing image
let clothingX = 0;
let clothingY = 0;

// Add event listeners for dragging
let isDragging = false;

clothingImage.addEventListener('mousedown', (e) => {
    isDragging = true;
    clothingImage.style.pointerEvents = 'auto'; // Enable pointer events for dragging
    offsetX = e.clientX - clothingImage.getBoundingClientRect().left;
    offsetY = e.clientY - clothingImage.getBoundingClientRect().top;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        clothingX = e.clientX - container.getBoundingClientRect().left - offsetX;
        clothingY = e.clientY - container.getBoundingClientRect().top - offsetY;

        // Constrain the clothing image within the container
        if (clothingX < 0) clothingX = 0;
        if (clothingY < 0) clothingY = 0;
        if (clothingX + clothingImage.offsetWidth > containerWidth) {
            clothingX = containerWidth - clothingImage.offsetWidth;
        }
        if (clothingY + clothingImage.offsetHeight > containerHeight) {
            clothingY = containerHeight - clothingImage.offsetHeight;
        }

        clothingImage.style.transform = `translate(${clothingX}px, ${clothingY}px)`;
    }
});

// Load user image from local storage
window.onload = function() {
    const userImageData = localStorage.getItem('userImage');
    if (userImageData) {
        document.getElementById('userImage').src = userImageData; // Set user image
        resizeUserImage(); // Call resize function after setting the image
    }
};

function uploadClothingImage() {
    const clothingFile = document.getElementById('clothingUpload').files[0];

    if (!clothingFile || (clothingFile.type !== 'image/png' && clothingFile.type !== 'image/jpeg')) {
        alert('Please upload a valid PNG or JPEG image for clothing.');
        return;
    }

    const clothingReader = new FileReader();
    clothingReader.onload = async function(event) {
        clothingImage.src = event.target.result; // Set clothing image

        // Background removal logic (similar to your previous code)
        const apiKey = '';//'vFw5rFNQVkgqjJbrK8PH1N99';  //HBzT8esCnrCctLiS4YuxfLTZ - guarin ... emG3uH22a7D3BGBbwAPht3qg - mot ... mike api here ... hans api here
        const formData = new FormData();
        formData.append('image_file', clothingFile);
        formData.append('size', 'auto');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': apiKey,
                },
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                clothingImage.src = URL.createObjectURL(blob); // Set the image with removed background
            } else {
                console.error('Error removing background:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    clothingReader.readAsDataURL(clothingFile);
}

function useSampleClothing(imagePath) {
    // Create a new image object
    const sampleClothingImage = new Image();
    sampleClothingImage.src = imagePath;

    sampleClothingImage.onload = function() {
        clothingImage.src = sampleClothingImage.src; // Set the sample clothing image

        // Optional: If you want to apply background removal on sample images
        // You can add the background removal logic here as needed
    };
}

// Resize user image after it is loaded
userImage.onload = function() {
    resizeUserImage(); // Resize the user image to fit in the container
    resizeClothing(); // Resize clothing after user image is resized
};

// Function to resize user image to fit in the container
function resizeUserImage() {
    const userImageRect = userImage.getBoundingClientRect();
    
    const maxWidth = containerWidth;   // Container width
    const maxHeight = containerHeight;  // Container height

    const scaleX = maxWidth / userImageRect.width;
    const scaleY = maxHeight / userImageRect.height;
    const scaleFactor = Math.min(scaleX, scaleY); // Use the smaller scaling factor to maintain aspect ratio

    userImage.style.width = `${userImageRect.width * scaleFactor}px`;
    userImage.style.height = `${userImageRect.height * scaleFactor}px`;

    const centerX = (maxWidth - userImageRect.width * scaleFactor) / 2;
    const centerY = (maxHeight - userImageRect.height * scaleFactor) / 2;

    userImage.style.transform = `translate(${centerX}px, ${centerY}px)`; 
}

// Function to resize clothing based on user height and selected size
function resizeClothing() {
    const userHeight = parseFloat(document.getElementById('userHeight').value);
    const clothingSize = document.getElementById('clothingSize').value;

    if (!userHeight) {
        alert('Please enter your height.');
        return;
    }

    const userHeightCm = userHeight;

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

    const scaleFactor = (clothingLength / userHeightCm); // Compare clothing length to user's height
    const clothingHeightInBox = containerHeight * scaleFactor; // Scaled clothing height in pixels

    clothingImage.style.height = `${clothingHeightInBox}px`;
    clothingImage.style.width = 'auto'; // Maintain aspect ratio for width
}

// Resize clothing image after it is loaded
clothingImage.onload = resizeClothing;
