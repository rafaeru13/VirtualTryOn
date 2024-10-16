const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const userImage = new Image();
const clothingImage = new Image();

let clothingX = 0;
let clothingY = 0;
let clothingWidth = 150;
let clothingHeight = 150;
let isDragging = false;

// Function to handle user image upload and overlay
function uploadImages() {
    const userUpload = document.getElementById('userUpload').files[0];
    const clothingUpload = document.getElementById('clothingUpload').files[0];

    if (userUpload) {
        const reader = new FileReader();
        reader.onload = function (e) {
            userImage.src = e.target.result;
            userImage.onload = function () {
                drawUserImage();
                if (clothingUpload) {
                    // Load clothing image if uploaded
                    const clothingReader = new FileReader();
                    clothingReader.onload = function (e) {
                        clothingImage.src = e.target.result;
                        clothingImage.onload = function () {
                            drawClothing();
                        };
                    };
                    clothingReader.readAsDataURL(clothingUpload);
                }
            };
        };
        reader.readAsDataURL(userUpload);
    } else {
        alert('Please upload a full body image.');
    }
}

// Function to draw the user image in the center
function drawUserImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleFactor = Math.min(canvas.width / userImage.width, canvas.height / userImage.height);
    const scaledWidth = userImage.width * scaleFactor;
    const scaledHeight = userImage.height * scaleFactor;
    const xOffset = (canvas.width - scaledWidth) / 2;
    const yOffset = (canvas.height - scaledHeight) / 2;
    ctx.drawImage(userImage, xOffset, yOffset, scaledWidth, scaledHeight);
}

// Function to load preset clothing image
function selectPreset(presetImagePath) {
    clothingImage.src = presetImagePath;
    clothingImage.onload = drawClothing;
}

// Function to draw the clothing over the user image
function drawClothing() {
    ctx.drawImage(clothingImage, clothingX, clothingY, clothingWidth, clothingHeight);
}

// Add event listeners for dragging the clothing
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the mouse is over the clothing image
    if (mouseX >= clothingX && mouseX <= clothingX + clothingWidth && mouseY >= clothingY && mouseY <= clothingY + clothingHeight) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Update clothing position based on mouse movement
        clothingX = mouseX - clothingWidth / 2;
        clothingY = mouseY - clothingHeight / 2;

        drawUserImage();
        drawClothing();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});
