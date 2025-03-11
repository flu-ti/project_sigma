import '../css/lecture.css'
var showdown = require('showdown')

async function loadLectureContent() {
    const params = new URLSearchParams(window.location.search);
    const lectureId = params.get('id');
    var block = params.get('block')

    const imageMap = {
        "psychosozial": "/media/themenblöcke/psychosozial.jpg",
        "grundlagen": "/media/themenblöcke/diagnostics.jpg",
        "herz": "/media/themenblöcke/herz.jpg",
        "atmung": "/media/themenblöcke/atmung.jpg",
        "bewegungsapparat": "/media/themenblöcke/bewegungsapparat.jpg"
    };
    
    if (imageMap[block]) {
        document.getElementById("title-img").src = imageMap[block];
    }

    if (!lectureId) {
        console.error("No lecture ID provided.");
        document.getElementById("lecture-content").innerHTML = "<p>No content found.</p>";
        return;
    }

    try {
        // Fetch the metadata JSON
        const response = await fetch(`/assets/lectures_${block}.json`);
        if (!response.ok) throw new Error("Failed to fetch Lecture List JSON");

        const data = await response.json();

        const lecture = data.week
        .flatMap(week => week.days)
        .flatMap(day => day.lectures)
        .find(l => l.title === lectureId)

        console.log(data)
        

        if (!lecture) {
            console.error("Lecture not found.");
            document.getElementById("content").innerHTML = "<p>Lecture not found.</p>";
            return;
        }

        if (!lecture.url) {
            console.error("Lecture URL is missing!");
            return;
        }

        // Fetch the markdown file
        const mdResponse = await fetch(lecture.url);
        if (!mdResponse.ok) throw new Error("Failed to fetch markdown file");
        

        const markdownText = await mdResponse.text();

        // Convert markdown to HTML
        const converter = new showdown.Converter();
        const rawHtml = converter.makeHtml(markdownText);

        // Create a temporary container to manipulate the generated HTML
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = rawHtml;

        // Select all H2 elements and wrap them with their content in a div
        const sections = [];
        let currentSection = null;

        tempContainer.childNodes.forEach(node => {
            if (node.nodeType === 1 && node.tagName === "H2") {
                // Start a new section
                currentSection = document.createElement("div");
                currentSection.classList.add("section");
                currentSection.id =  node.id + "1";// Assign the same ID as the H2
                currentSection.appendChild(node); // Add the H2 to the section

            // If this H2 has the id "lectureslides", add the slides div
            if (node.id === "lectureslides") {
                const slidesDiv = document.createElement("div");
                slidesDiv.id = "slides";
                slidesDiv.innerHTML = `
                    <a href="${lecture.slides}" target="_blank">📄 Vorlesungsfolien (PDF)</a>
                    <object data="${lecture.slides}" type="application/pdf" width="100%" height="700px">
                        <p>Your browser does not support embedded PDFs. <a href="${lecture.slides}" target="_blank">Download the PDF</a> instead.</p>
                    </object>
                `;
                currentSection.appendChild(slidesDiv);
            }

                sections.push(currentSection);
            } else if (currentSection) {
                // Append all elements below H2 (p, ul, images, etc.) into the current section
                currentSection.appendChild(node);
            }
        });

        // Insert content into div
        document.getElementById("lecture-title").innerText = lecture.title;
        document.getElementById("lecture-subject").innerText = lecture.subject;
        document.getElementById("lecture-content").innerHTML = "";
            sections.forEach(section => document.getElementById("lecture-content").appendChild(section));
        document.title = lecture.title;

        const titleElement = document.getElementById("lecture-title");

        const titleLength = titleElement.innerText.length;

        // Remove the class first to reset
        titleElement.classList.remove("small-title");

        // Apply size rules only if screen is larger than 1000px
        if (window.innerWidth > 1000) {
            if (titleLength > 25 && titleLength <49) {
                titleElement.classList.add("small-title"); // Set 35px
            } 
            if (titleLength > 50) {
                titleElement.classList.add("smaller-title");
            }
            else {
                // No class needed, it remains 40px (default CSS)
            }
        }

    } catch (error) {
        console.error("Error loading lecture content:", error);
        document.getElementById("content").innerHTML = "<p>Error loading content.</p>";
    }
}

window.onload = loadLectureContent;




function toggleNav() {
    const sidenav = document.getElementById("mySidenav");
  
    // If the clicked subject is the same as the current one, close the sidenav
    if (sidenav.style.display === "block") {
        sidenav.style.display = "none";  // Close the sidenav
    } else {
        sidenav.style.display = "block";  // Keep the sidenav open
    }
  }






  async function loadLectureList() {
    const nav = document.querySelector('.sidenav');

    const params = new URLSearchParams(window.location.search);
    var block = params.get('block')


    try {
        const response = await fetch(`/assets/lectures_${block}.json`);
        const lectures = await response.json();

        console.log(lectures)

        // Generate the HTML content dynamically
        let content = `<a href="javascript:void(0)" class="close" id="button" onclick="closeNav()">&times;</a>`;
        content += `<h1 class="title-vorlesungen">${lectures.title}</h1>`;

        lectures.week.forEach(week => {
            content += `<div class="Woche" id="Woche${week.weekNumber}">`;
            content += `<h2>Woche ${week.weekNumber}</h2>`;

            week.days.forEach(day => {
                content += `<h3>${day.date}</h3>`;
                day.lectures.forEach(lecture => {
                  if (lecture.title) {
                    const safeId = lecture.subject.replace(/\s+|\?/g, '-');
                    content += `<p><a href="lecture.html?id=${lecture.title}&block=${lecture.themenblock}" class="link" id="${safeId}" style="cursor: pointer;">${lecture.subject}: ${lecture.title}</a></p>`;
                  }
                });
            });

            content += `</div>`;
        });

        // Insert into the sidenav
        nav.innerHTML = content;

        // Toggle navigation
        toggleNav();

        nav.scrollTop = 0;


    } catch (error) {
        console.error("Error loading lecture list:", error);
        nav.innerHTML = "<p>Error loading lectures.</p>";
    }
}


  
  function openNav() {
      document.getElementById("mySidenav").style.display = "block";
    }
    
    function closeNav() {
      document.getElementById("mySidenav").style.display = "none";
    }


window.openNav = openNav;
window.closeNav = closeNav;
window.loadLectureList = loadLectureList;
window.toggleNav = toggleNav;
