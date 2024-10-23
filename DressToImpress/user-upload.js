function uploadImages() {
    const userFile = document.getElementById('userUpload').files[0];

    // Check user image file type
    if (userFile) {
        const userFileType = userFile.type;
        if (userFileType !== 'image/png' && userFileType !== 'image/jpeg') {
            alert('Please upload a PNG or JPEG image for the user image.');
            return; // Stop execution if the file type is invalid
        }

        const userReader = new FileReader();
        userReader.onload = function (event) {
            const imageSrc = event.target.result;
            localStorage.setItem('userImage', imageSrc); // Save user image to local storage
            window.location.href = 'clothing-upload.html'; // Redirect to clothing upload page
        };
        userReader.readAsDataURL(userFile);
    } else {
        alert('Please select an image file.');
    }
}

function useSampleImage(imagePath) {
    // Create a new image object
    const sampleImage = new Image();
    sampleImage.src = imagePath;

    sampleImage.onload = function() {
        // Once the sample image loads, save it to local storage
        localStorage.setItem('userImage', sampleImage.src); // Save sample image in local storage
        window.location.href = 'clothing-upload.html'; // Redirect to clothing upload page
    };
}

// Additional functionality for the clothing upload page will go here...
