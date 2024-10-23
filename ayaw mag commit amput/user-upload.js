// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = firebase.storage(); // Move this after initialization

function uploadImages() {
    const userFile = document.getElementById('userUpload').files[0];

    console.log("Upload button clicked."); // Debug statement

    // Check user image file type
    if (userFile) {
        const userFileType = userFile.type;
        if (userFileType !== 'image/png' && userFileType !== 'image/jpeg') {
            alert('Please upload a PNG or JPEG image for the user image.');
            return; // Stop execution if the file type is invalid
        }

        // Create a storage reference for the user image
        const storageRef = storage.ref('user-images/' + userFile.name);
        
        // Upload the file
        const uploadTask = storageRef.put(userFile);

        // Monitor upload progress
        uploadTask.on('state_changed',
            (snapshot) => {
                // Optional: Implement a progress indicator here
                console.log("Upload is in progress..."); // Debug statement
            },
            (error) => {
                console.error('Upload failed:', error); // Log error
                alert('Upload failed: ' + error.message); // Show alert on error
            },
            () => {
                // Get download URL and save it to local storage
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log("Download URL:", downloadURL); // Debug statement
                    localStorage.setItem('userImage', downloadURL); // Save user image to local storage
                    window.location.href = 'clothing-upload.html'; // Redirect to clothing upload page
                });
            }
        );
    } else {
        alert('Please select an image file.');
    }
}

function useSampleImage(imagePath) {
    console.log("Sample image path:", imagePath); // Debug statement

    // Create a new image object
    const sampleImage = new Image();
    sampleImage.src = imagePath;

    sampleImage.onload = function() {
        console.log("Sample image loaded."); // Debug statement
        // Convert the sample image to a Blob and upload to Firebase Storage
        fetch(sampleImage.src)
            .then(response => response.blob())
            .then(blob => {
                const sampleImageName = 'sample-images/' + Date.now() + '.png'; // Unique name for the sample image
                const sampleStorageRef = storage.ref(sampleImageName);

                // Upload the sample image
                const sampleUploadTask = sampleStorageRef.put(blob);
                sampleUploadTask.on('state_changed',
                    null,
                    (error) => {
                        console.error('Sample image upload failed:', error); // Log error
                        alert('Sample image upload failed: ' + error.message); // Show alert on error
                    },
                    () => {
                        // Get download URL and save it to local storage
                        sampleUploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            console.log("Sample image download URL:", downloadURL); // Debug statement
                            localStorage.setItem('userImage', downloadURL); // Save sample image to local storage
                            window.location.href = 'clothing-upload.html'; // Redirect to clothing upload page
                        });
                    }
                );
            })
            .catch(err => {
                console.error('Error fetching sample image:', err); // Log error
                alert('Error fetching sample image: ' + err.message); // Show alert on error
            });
    };
}
