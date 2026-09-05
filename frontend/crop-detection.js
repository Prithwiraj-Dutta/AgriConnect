/* AGRICONNECT - CROP DETECTION
   AI CROP HEALTH PROTOTYPE */

document.addEventListener("DOMContentLoaded", () => {

    console.log("AgriConnect Crop Detection JS loaded successfully.");

    /* GET HTML ELEMENTS */

    const fileInput = document.getElementById("fileInput");
    const uploadArea = document.getElementById("uploadArea");
    const browseBtn = document.getElementById("browseBtn");

    const imagePreview = document.getElementById("imagePreview");
    const previewContainer = document.getElementById("previewContainer");
    const removeImageBtn = document.getElementById("removeImageBtn");

    const cropSelect = document.getElementById("cropSelect");
    const stageSelect = document.getElementById("stageSelect");
    const locationInput = document.getElementById("locationInput");

    const locationBtn = document.getElementById("locationBtn");
    const analyzeBtn = document.getElementById("analyzeBtn");

    const analysisOverlay = document.getElementById("analysisOverlay");
    const progressBar = document.getElementById("progressBar");
    const analysisStatus = document.getElementById("analysisStatus");

    /* CHECK IMPORTANT ELEMENTS*/

    if (!fileInput) {
        console.error("ERROR: fileInput not found.");
        return;
    }

    if (!uploadArea) {
        console.error("ERROR: uploadArea not found.");
        return;
    }

    if (!analyzeBtn) {
        console.error("ERROR: analyzeBtn not found.");
        return;
    }

    console.log("All required HTML elements found.");


    /* OPEN FILE SELECTOR*/

    if (browseBtn) {
        browseBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            fileInput.click();
        });
    }


    /* CLICK UPLOAD AREA */

    uploadArea.addEventListener("click", () => {
        fileInput.click();
    });


    /* FILE SELECTED */

    fileInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        handleImage(file);

    });


    /* HANDLE IMAGE */

    function handleImage(file) {

        /* Check image type */

        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image file.");

            fileInput.value = "";

            return;
        }


        /* Check image size */

        const maxSize = 10 * 1024 * 1024; // 10 MB

        if (file.size > maxSize) {

            alert("Image size must be less than 10 MB.");

            fileInput.value = "";

            return;
        }


        /* Read image */

        const reader = new FileReader();

        reader.onload = function (event) {

            if (imagePreview) {
                imagePreview.src = event.target.result;
            }

            if (previewContainer) {
                previewContainer.style.display = "block";
            }

            /* Hide upload content if your CSS supports it */

            uploadArea.classList.add("has-image");

            console.log("Image loaded:", file.name);

        };

        reader.readAsDataURL(file);
    }


    /* 
       REMOVE IMAGE
     */

    if (removeImageBtn) {

        removeImageBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            fileInput.value = "";

            if (imagePreview) {
                imagePreview.src = "";
            }

            if (previewContainer) {
                previewContainer.style.display = "none";
            }

            uploadArea.classList.remove("has-image");

            console.log("Image removed.");

        });

    }


    /* DRAG & DROP */

    uploadArea.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadArea.classList.add("drag-over");

    });


    uploadArea.addEventListener("dragleave", () => {

        uploadArea.classList.remove("drag-over");

    });


    uploadArea.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadArea.classList.remove("drag-over");

        const files = event.dataTransfer.files;

        if (files.length > 0) {

            const file = files[0];

            handleImage(file);

            /*
             * Put the dropped file into the file input.
             * This allows the file to be used later.
             */

            try {

                const dataTransfer = new DataTransfer();

                dataTransfer.items.add(file);

                fileInput.files = dataTransfer.files;

            } catch (error) {

                console.log("Could not assign dropped file to input.");

            }

        }

    });


    /* GET FARMER LOCATION */

    if (locationBtn) {

        locationBtn.addEventListener("click", () => {

            if (!navigator.geolocation) {

                alert("Geolocation is not supported by your browser.");

                return;
            }


            locationBtn.innerText = "Getting location...";

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    locationInput.value =
                        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

                    locationBtn.innerText = "Location Added";

                    console.log(
                        "Location:",
                        latitude,
                        longitude
                    );

                },

                (error) => {

                    console.error("Location error:", error);

                    alert(
                        "Unable to get your location. Please enter your farm location manually."
                    );

                    locationBtn.innerText = "Use My Location";

                }

            );

        });

    }


    /* VALIDATE FORM */

    function validateForm() {

        /* Check image */

        if (!fileInput.files || fileInput.files.length === 0) {

            alert("Please upload a crop image first.");

            return false;
        }


        /* Check crop */

        if (!cropSelect || cropSelect.value === "") {

            alert("Please select your crop.");

            return false;
        }


        /* Check crop stage */

        if (!stageSelect || stageSelect.value === "") {

            alert("Please select the crop growth stage.");

            return false;
        }


        return true;

    }


    /* ANALYZE CROP */

    analyzeBtn.addEventListener("click", async () => {

        console.log("Analyze button clicked.");


        /* Validate */

        if (!validateForm()) {

            return;

        }


        /* Open analysis screen */

        if (analysisOverlay) {

            analysisOverlay.style.display = "flex";

        }


        /* Disable button */

        analyzeBtn.disabled = true;


        /* Start AI analysis */

        await runAIAnalysis();


        /* Save result */

        saveAnalysisResult();


        /*
         * IMPORTANT:
         * Make sure result.html exists in the same folder.
         */

        setTimeout(() => {

            window.location.href = "result.html";

        }, 800);

    });


    /* SIMULATED AI ANALYSIS*/

    async function runAIAnalysis() {

        const steps = [

            {
                progress: 15,
                text: "Uploading crop image..."
            },

            {
                progress: 30,
                text: "Processing image..."
            },

            {
                progress: 50,
                text: "Detecting visible symptoms..."
            },

            {
                progress: 70,
                text: "Comparing with disease patterns..."
            },

            {
                progress: 85,
                text: "Analysing weather and crop stage..."
            },

            {
                progress: 95,
                text: "Calculating disease risk..."
            },

            {
                progress: 100,
                text: "Analysis complete."
            }

        ];


        for (const step of steps) {

            await delay(700);


            if (progressBar) {

                progressBar.style.width =
                    step.progress + "%";

            }


            if (analysisStatus) {

                analysisStatus.innerText =
                    step.text;

            }

        }

    }


    /* SAVE ANALYSIS RESULT */

    function saveAnalysisResult() {

        /*
         * This is currently a prototype result.
         *
         * Later we will replace this section with
         * your real TensorFlow model/API.
         */

        const result = {

            crop: cropSelect.value,

            stage: stageSelect.value,

            location: locationInput
                ? locationInput.value
                : "",

            disease: "Tomato Early Blight",

            confidence: 87,

            risk: "HIGH",

            timestamp: new Date().toISOString()

        };


        localStorage.setItem(
            "cropAnalysisResult",
            JSON.stringify(result)
        );


        console.log(
            "Analysis result saved:",
            result
        );

    }


    /* DELAY FUNCTION */

    function delay(milliseconds) {

        return new Promise(resolve => {

            setTimeout(resolve, milliseconds);

        });

    }


    /* INITIAL STATE */

    if (previewContainer) {

        previewContainer.style.display = "none";

    }


    if (analysisOverlay) {

        analysisOverlay.style.display = "none";

    }


    console.log(
        "AgriConnect AI Crop Health module initialized."
    );

});
