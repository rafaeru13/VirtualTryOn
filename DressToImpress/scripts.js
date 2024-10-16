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

function uploadImages() {
    const userFile = document.getElementById('userUpload').files[0];
    const clothingFile = document.getElementById('clothingUpload').files[0];

    // Check user image file type
    if (userFile) {
        const userFileType = userFile.type;
        if (userFileType !== 'image/png' && userFileType !== 'image/jpeg') {
            alert('Please upload a PNG or JPEG image for the user image.');
            return; // Stop execution if the file type is invalid
        }

        const userReader = new FileReader();
        userReader.onload = function (event) {
            userImage.src = event.target.result; // Set the user's image
        };
        userReader.readAsDataURL(userFile);
    }

    // Check clothing image file type
    if (clothingFile) {
        const clothingFileType = clothingFile.type;
        if (clothingFileType !== 'image/png' && clothingFileType !== 'image/jpeg') {
            alert('Please upload a PNG or JPEG image for the clothing image.');
            return; // Stop execution if the file type is invalid
        }

        const clothingReader = new FileReader();
        clothingReader.onload = async function (event) {
            clothingImage.src = event.target.result; // Set the clothing image

            // Remove background
            const apiKey = 'vFw5rFNQVkgqjJbrK8PH1N99';  //HBzT8esCnrCctLiS4YuxfLTZ - guarin ... emG3uH22a7D3BGBbwAPht3qg - mot
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

    // Center the user image vertically and horizontally within the container
    const centerX = (maxWidth - userImageRect.width * scaleFactor) / 2;
    const centerY = (maxHeight - userImageRect.height * scaleFactor) / 2;

    // Set translate to center the image based on its new size
    userImage.style.transform = `translate(${centerX}px, ${centerY}px)`; 
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

// Resize user image after it is loaded
userImage.onload = function() {
    resizeUserImage(); // Resize the user image to fit in the container
    resizeClothing(); // Resize clothing after user image is resized
};

// Resize clothing image after it is loaded
clothingImage.onload = resizeClothing;
