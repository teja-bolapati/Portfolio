const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("[data-section]")];
const themeToggle = document.querySelector("[data-theme-toggle]");
const roleText = document.querySelector("[data-role-text]");
const counters = [...document.querySelectorAll("[data-counter]")];
const skillBars = [...document.querySelectorAll("[data-level]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll(".project-card")];
const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("#modal-title");
const modalImpact = document.querySelector("[data-modal-impact]");
const modalStack = document.querySelector("[data-modal-stack]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const roles = [
    "Java full stack systems",
    "React JS interfaces",
    "responsive portfolio experiences",
    "database-ready project workflows"
];

function getSavedTheme() {
    try {
        return localStorage.getItem("portfolio-theme");
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("portfolio-theme", theme);
    } catch {
        return;
    }
}

const savedTheme = getSavedTheme();
if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
}

navToggle?.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        body.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
        navToggle?.setAttribute("aria-label", "Open menu");
    });
});

themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (isDark) {
        delete document.documentElement.dataset.theme;
        saveTheme("light");
    } else {
        document.documentElement.dataset.theme = "dark";
        saveTheme("dark");
    }
});

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
    if (!roleText) return;

    const current = roles[roleIndex];
    roleText.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
        charIndex += 1;
        setTimeout(typeRole, 52);
        return;
    }

    if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(typeRole, 1100);
        return;
    }

    if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeRole, 28);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 220);
}

typeRole();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

sections.forEach((section) => activeObserver.observe(section));

const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = Number(entry.target.dataset.counter);
        const isDecimal = !Number.isInteger(target);
        const duration = 900;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            entry.target.textContent = isDecimal ? value.toFixed(2) : Math.round(value);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                entry.target.textContent = isDecimal ? target.toFixed(2) : String(target);
            }
        }

        requestAnimationFrame(tick);
        numberObserver.unobserve(entry.target);
    });
}, { threshold: 0.45 });

counters.forEach((counter) => numberObserver.observe(counter));

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const level = entry.target.dataset.level;
        entry.target.style.width = `${level}%`;
        skillObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

skillBars.forEach((bar) => skillObserver.observe(bar));

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

        projectCards.forEach((card) => {
            const categories = card.dataset.category.split(" ");
            card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
        });
    });
});

projectCards.forEach((card) => {
    card.querySelector("[data-open-project]")?.addEventListener("click", () => {
        modalTitle.textContent = card.dataset.title;
        modalImpact.textContent = card.dataset.impact;
        modalStack.textContent = card.dataset.stack;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        modal.querySelector("[data-close-modal]")?.focus();
    });
});

function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
}

modal?.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || message.length < 10) {
        formStatus.textContent = "Please enter your name, a valid email, and a message with at least 10 characters.";
        return;
    }

    formStatus.textContent = `Thanks, ${name}. This frontend form is ready for GitHub Pages and can be connected to email later.`;
    contactForm.reset();
});
