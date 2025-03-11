import '../CSS/clinical_reasoning.css';

function openModal(image) {
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById('img01');
    var captionText = document.getElementById('caption');
    modal.style.display = "block";
    modalImg.src = image.src;
    captionText.innerHTML = image.alt;
}


function closeModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = "none";
}


let currentSubject = '';

function toggleNav(subject) {
    const container = document.getElementById("ssp-list-specific");
    const startingText = document.getElementById("starting-text");

    // If clicking the same subject twice, reset to the initial text
    if (currentSubject === subject) {
        container.style.display = "none";  // Hide injected content
        startingText.style.display = "block"; // Show initial text
        currentSubject = '';
    } else {
        container.style.display = "block";
        startingText.style.display = "none";  // Hide initial text
        currentSubject = subject;
    }
}

async function loadLectureList(filePath) {
    const container = document.getElementById("ssp-list-specific");

    console.log(container)

    try {
        const response = await fetch(filePath);
        const data = await response.json();

        console.log(data)

        // Generate the HTML content dynamically
        let content = `<h1 class="title-vorlesungen">${data.title}</h1>`;
        content += `<ul>`;

        data.items.forEach(item => {
            content += `<li>${item}</li>`;
        });

        content += `</ul>`;

        console.log(content)

        // Insert into the target div
        container.innerHTML = content;

        // Toggle visibility
        toggleNav(filePath);


        } catch (error) {
            console.error("Error loading lecture list:", error);
            container.innerHTML = "<p>Error loading lectures.</p>";
        }
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");
    const jsonFiles = ["diseases_grundlagen.json", "diseases_atmung.json", "diseases_herz.json"]; // Add more filenames as needed

    jsonFiles.forEach(file => {
        fetch(`/assets/diseases/${file}`)
            .then(response => response.json())
            .then(data => {
                // Create a wrapper for the entire block (title + groups)
                const blockWrapper = document.createElement("div");
                blockWrapper.className = "block-wrapper"; // Class for styling

                // Create and append the main title inside the wrapper
                const titleElement = document.createElement("h1");
                titleElement.textContent = data.title;
                var block = data.title;

                blockWrapper.appendChild(titleElement); // Append h1 to the wrapper

                data["diseasegroup"].forEach(group => {
                    // Create a wrapper for each disease group
                    const groupWrapper = document.createElement("div");
                    groupWrapper.className = "group-wrapper"; // Add a class for styling
                    const safeGroupname = group.diseasegroup.replace(/\s+|\?/g, '-');
                    groupWrapper.id = `${safeGroupname}`;

                    // Create and append the disease group title
                    const groupTitleElement = document.createElement("h2");
                    groupTitleElement.textContent = group.diseasegroup;
                    groupWrapper.appendChild(groupTitleElement);

                    // Create a new grid container for this group
                    const gridContainer = document.createElement("div");
                    gridContainer.className = "grid-container";
                    groupWrapper.appendChild(gridContainer); // Append grid to group wrapper

                    group.diseases.forEach(disease => {
                        const diseaseDiv = document.createElement("div");
                        diseaseDiv.className = "disease";
                        diseaseDiv.style.cursor = "pointer";
                        diseaseDiv.onclick = function () {
                            location.href = `disease.html?id=${disease.name}&block=${block}`;
                        };

                        const titleBlock = document.createElement("div");
                        titleBlock.className = "title-block";

                        const title = document.createElement("div");
                        title.className = "title_2";
                        title.textContent = disease.name;

                        const bottomBlock = document.createElement("div");
                        bottomBlock.className = "bottom-block";

                        const image = document.createElement("img");
                        image.src = disease.media[0]?.image1 || "default-image.jpg"; // Default image if none provided

                        // Append elements
                        titleBlock.appendChild(title);
                        bottomBlock.appendChild(image);
                        diseaseDiv.appendChild(titleBlock);
                        diseaseDiv.appendChild(bottomBlock);
                        gridContainer.appendChild(diseaseDiv);
                    });

                    // Append the entire group wrapper to the block wrapper
                    blockWrapper.appendChild(groupWrapper);
                });

                // Append the entire block wrapper to the container
                container.appendChild(blockWrapper);
            })
            .catch(error => console.error("Error loading JSON data:", error));
    });
});
  
function openNav() {
    document.getElementById("ssp-list-specific").style.display = "block";
    document.getElementById("text").style.display = "none";
}
    
function closeNav() {
    document.getElementById("ssp-list-specific").style.display = "none";
    document.getElementById("text").style.display = "block";
}





    window.loadLectureList = loadLectureList;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeNav = closeNav;
