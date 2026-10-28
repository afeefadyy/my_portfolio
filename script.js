
alert("Welcome to My Portfolio!");

const moreBtn = document.getElementById("moreBtn");
const moreInfo = document.getElementById("moreInfo");

moreBtn.addEventListener("click", function() {
    moreInfo.hidden = !moreInfo.hidden;

    if (moreInfo.hidden) {
        moreBtn.textContent = "More About Me";
    } else {
        moreBtn.textContent = "Show Less";
    }
});

const themeBtn = document.getElementById("themeBtn");

function updateThemeButton() {
    if (document.body.classList.contains("dark-mode")) {
        themeBtn.textContent = "Light Mode";
    } else {
        themeBtn.textContent = "Dark Mode";
    }
}

try {
    const savedTheme = localStorage.getItem("portfolioTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
} catch (error) {
    console.warn("Theme preference could not be loaded.");
}

updateThemeButton();

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    updateThemeButton();

    const selectedTheme =
        document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

    try {
        localStorage.setItem("portfolioTheme", selectedTheme);
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
});

const topBtn = document.getElementById("topBtn");

topBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


const projectSearch = document.getElementById("projectSearch");
const projectFilter = document.getElementById("projectFilter");
const projects = document.querySelectorAll(".project");

function filterProjects() {
    const searchText = projectSearch.value.toLowerCase();
    const selectedCategory = projectFilter.value;

    projects.forEach(function(project) {
        const projectText = project.textContent.toLowerCase();
        const projectCategory = project.dataset.category;

        const matchesSearch = projectText.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            projectCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            project.style.display = "block";
        } else {
            project.style.display = "none";
        }
    });
}

projectSearch.addEventListener("input", filterProjects);
projectFilter.addEventListener("change", filterProjects);

const photoModal = document.getElementById("photoModal");
const largePhoto = document.getElementById("largePhoto");
const closePhoto = document.getElementById("closePhoto");

const photoList = Array.from(
    document.querySelectorAll(".project-photo")
);

let currentPhotoIndex = 0;
let previousFocus = null;

function showPhoto(index) {
    currentPhotoIndex = index;
    largePhoto.src = photoList[index].src;
    largePhoto.alt = photoList[index].alt;
}

function openPhoto(index) {
    previousFocus = document.activeElement;
    showPhoto(index);
    photoModal.hidden = false;
    document.body.style.overflow = "hidden";
    closePhoto.focus();
}

function hidePhoto() {
    photoModal.hidden = true;
    document.body.style.overflow = "";
    largePhoto.removeAttribute("src");

    if (previousFocus) {
        previousFocus.focus();
    }
}

photoList.forEach(function(photo, index) {
    photo.tabIndex = 0;
    photo.setAttribute("role", "button");
    photo.setAttribute("aria-label", "Enlarge: " + photo.alt);

    photo.addEventListener("click", function() {
        openPhoto(index);
    });

    photo.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPhoto(index);
        }
    });
});

closePhoto.addEventListener("click", hidePhoto);

photoModal.addEventListener("click", function(event) {
    if (event.target === photoModal) {
        hidePhoto();
    }
});

const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");

function changePhoto(direction) {
    if (photoList.length === 0) {
        return;
    }

    let newIndex = currentPhotoIndex + direction;

    if (newIndex < 0) {
        newIndex = photoList.length - 1;
    }

    if (newIndex >= photoList.length) {
        newIndex = 0;
    }

    showPhoto(newIndex);
}

prevPhoto.addEventListener("click", function() {
    changePhoto(-1);
});

nextPhoto.addEventListener("click", function() {
    changePhoto(1);
});

document.addEventListener("keydown", function(event) {
    if (photoModal.hidden) {
        return;
    }

    if (event.key === "Escape") {
        hidePhoto();
    }

    if (event.key === "ArrowLeft") {
        changePhoto(-1);
    }

    if (event.key === "ArrowRight") {
        changePhoto(1);
    }

    if (event.key === "Tab") {
        const controls = [closePhoto, prevPhoto, nextPhoto];
        const currentIndex = controls.indexOf(document.activeElement);

        if (event.shiftKey && currentIndex <= 0) {
            event.preventDefault();
            nextPhoto.focus();
        } else if (!event.shiftKey &&
                   currentIndex === controls.length - 1) {
            event.preventDefault();
            closePhoto.focus();
        }
    }
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function updateActiveNavigation() {
    let currentSection = "";

    sections.forEach(function(section) {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= 180) {
            currentSection = section.id;
        }
    });

    if (window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 5) {
        currentSection = "contact";
    }

    navLinks.forEach(function(link) {
        const isActive =
            link.getAttribute("href") === "#" + currentSection;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("scroll", updateActiveNavigation);
window.addEventListener("resize", updateActiveNavigation);
updateActiveNavigation();
