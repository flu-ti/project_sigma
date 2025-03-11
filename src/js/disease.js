import '../css/disease.css'
var showdown = require('showdown');

async function loadDiseaseContent() {
    const params = new URLSearchParams(window.location.search);
    const diseaseId = params.get('id');
    var block = params.get('block')

    if (!diseaseId) {
        console.error("No disease ID provided.");
        document.getElementById("disease-content").innerHTML = "<p>No content found.</p>";
        return;
    }

    try {
        // Fetch the markdown file
        const response = await fetch(`/assets/Diseases/diseases_${block}.json`);
        if (!response.ok) throw new Error("Failed to fetch Disease list JSON");

        const data = await response.json();

        const disease = data.diseasegroup
        .flatMap(diseasegroup => diseasegroup.diseases)
        .find(d => d.name === diseaseId)

        if (!disease) {
            console.error("Disease not found.");
            document.getElementById("content").innerHTML = "<p>Lecture not found.</p>";
            return;
        }

        // Fetch the markdown file
        const link = `/assets/Diseases/Scripts/${disease.subject}/${disease.markdown}`
        const mdResponse = await fetch(`/assets/Diseases/Scripts/${disease.subject}/${disease.markdown}`);
        if (!mdResponse.ok) throw new Error("Failed to fetch markdown file");

        const markdownText = await mdResponse.text();

        // Convert markdown to HTML
        const converter = new showdown.Converter();
        const rawHtml = converter.makeHtml(markdownText);

        // Create a temporary container to manipulate the generated HTML
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = rawHtml;

        // Define expected sections
        const sections = ["Epidemiologie", "Pathomechanismus", "Krankheitsbild", "Verlauf", 
                          "Prävention & Screening", "Diagnostik", "Therapie", "Follow-up & Prognose"];
        
        const sectionContent = {};
        let currentSection = null;

        tempContainer.childNodes.forEach(node => {
            if (node.nodeType === 1 && node.tagName === "H2" && sections.includes(node.innerText.trim())) {
                currentSection = node.innerText.trim();
                sectionContent[currentSection] = "";
            } else if (currentSection) {
                if (node.nodeType === Node.TEXT_NODE) {
                    sectionContent[currentSection] += node.textContent; // Preserve text nodes
                } else if (node.outerHTML) {
                    sectionContent[currentSection] += node.outerHTML; // Preserve element nodes
                }
            }
        });

        // Generate the grid layout
        const gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");
        gridContainer.id = "content-container"
        
        sections.forEach(section => {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            const safeSection = section.replace(/\s+|\?|&/g, '-');
            gridItem.id = `${safeSection}`
            gridItem.innerHTML = `<h2>${section}</h2>` + (sectionContent[section] || "<p>No content available.</p>");
            gridContainer.appendChild(gridItem);
        });


        // Add a second grid for the images
        const imageGridContainer = document.createElement("div");
        imageGridContainer.classList.add("grid-container");
        imageGridContainer.id = "image-container"

        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");

        disease.media.forEach(image => {
            const imgElement = document.createElement("img");
            const safeNameDisease = disease.name.replace(/\s+|\?/g, '-');
            imgElement.src = `/media/diseases/${safeNameDisease}/${image}`; // Assuming the images are stored in /assets/Diseases/Images
            console.log(imgElement)
            imgElement.alt = diseaseId + " Image";
            imgElement.classList.add("disease-image");
            imgElement.onclick = function () {
                console.log("Image clicked:", this); // Debugging
                openModal(this);
            };
            console.log(imgElement);
            mediaContainer.appendChild(imgElement);
        });

        imageGridContainer.appendChild(mediaContainer);




        // Insert content into div
        document.getElementById("disease-title").innerText = diseaseId.replace(/-/g, ' ');
        document.getElementById("disease-content").innerHTML = "";
        document.getElementById("disease-content").appendChild(gridContainer);
        document.getElementById("disease-content").appendChild(imageGridContainer);
        document.title = diseaseId.replace(/-/g, ' ');
    
    } catch (error) {
        console.error("Error loading disease content:", error);
        document.getElementById("disease-content").innerHTML = "<p>Error loading content.</p>";
    }
}


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

window.onload = loadDiseaseContent;

window.openModal = openModal;
window.closeModal = closeModal;




