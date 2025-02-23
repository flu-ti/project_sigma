import '../CSS/themenbloecke.css';
import { marked } from 'marked';



let currentSubject = '';

function toggleNav(subject) {
  const sidenav = document.getElementById("mySidenav");

  // If the clicked subject is the same as the current one, close the sidenav
  if (currentSubject === subject) {
      sidenav.style.display = "none";  // Close the sidenav
      currentSubject = ''; // Reset the current subject
  } else {
      sidenav.style.display = "block";  // Keep the sidenav open
      currentSubject = subject;  // Update the current subject
  }
}

  async function loadLectureList(subject, filePath) {
    const nav = document.querySelector('.sidenav');

    console.log(subject)

    try {
        const response = await fetch(filePath);
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
        toggleNav(subject);

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
      currentSubject ='';
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

  function display(Fach) {
    console.log (Fach)
  }

  
  
window.loadLectureList = loadLectureList;
window.openNav = openNav;
window.closeNav = closeNav;
window.openModal = openModal;
window.closeModal = closeModal;


window.display = display;