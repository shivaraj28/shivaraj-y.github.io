const $ = (s, all = false) => all ? document.querySelectorAll(s) : document.querySelector(s);

const header = $("#siteHeader");
const progressBar = $("#progressBar");
const backTop = $("#backTop");
const navLinks = $(".nav-link", true);
const sections = $("main section[id]", true);

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  backTop.classList.toggle("show", y > 500);

  const docHeight = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.width = `${docHeight > 0 ? (y / docHeight) * 100 : 0}%`;

  let current = "home";
  sections.forEach(section => {
    if (y >= section.offsetTop - 160) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const menuToggle = $("#menuToggle");
const navMenu = $("#navMenu");

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
  menuToggle.textContent = open ? "✕" : "☰";
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

const themeToggle = $("#themeToggle");
const root = document.documentElement;

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) root.dataset.theme = savedTheme;
themeToggle.textContent = root.dataset.theme === "light" ? "☾" : "☀";

themeToggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", root.dataset.theme);
  themeToggle.textContent = root.dataset.theme === "light" ? "☾" : "☀";
});

const roles = ["VLSI Design", "RTL Verification", "Physical Design", "Verilog / SystemVerilog", "Embedded & IoT"];
const typingText = $("#typingText");
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const word = roles[roleIndex];
  typingText.textContent = deleting ? word.slice(0, charIndex--) : word.slice(0, charIndex++);

  if (!deleting && charIndex > word.length) {
    deleting = true;
    setTimeout(typeLoop, 1100);
    return;
  }

  if (deleting && charIndex < 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
  }

  setTimeout(typeLoop, deleting ? 48 : 85);
}
typeLoop();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      if (entry.target.classList.contains("skill-bars")) {
        entry.target.querySelectorAll(".skill-bar").forEach(item => {
          item.querySelector(".bar span").style.width = `${item.dataset.level}%`;
        });
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$(".reveal", true).forEach(el => revealObserver.observe(el));

let countersStarted = false;
const about = $("#about");
const counterObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || countersStarted) return;
  countersStarted = true;

  $("[data-count]", true).forEach(el => {
    const target = Number(el.dataset.count);
    const decimal = el.dataset.decimal === "true";
    const duration = 1100;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * progress;
      el.textContent = decimal ? value.toFixed(2) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
}, { threshold: 0.3 });

counterObserver.observe(about);

const filterButtons = $(".filter-btn", true);
const projects = $(".project-card", true);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    projects.forEach(card => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

const modal = $("#projectModal");
const modalTitle = $("#modalTitle");
const modalCategory = $("#modalCategory");
const modalDetails = $("#modalDetails");

$(".project-open", true).forEach(btn => {
  btn.addEventListener("click", () => {
    modalTitle.textContent = btn.dataset.title;
    modalCategory.textContent = btn.dataset.category;
    modalDetails.textContent = btn.dataset.details;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$("[data-close-modal]", true).forEach(el => el.addEventListener("click", closeModal));
window.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

const flowInfo = $("#flowInfo");
$(".flow-step", true).forEach(step => {
  step.addEventListener("click", () => {
    $(".flow-step", true).forEach(s => s.classList.remove("active"));
    step.classList.add("active");
    flowInfo.animate(
      [{ opacity: 0.35, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 260 }
    );
    flowInfo.textContent = step.dataset.flow;
  });
});

const toast = $("#toast");
$("#copyEmail").addEventListener("click", async () => {
  const email = "shivulpr2004@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = "Email copied!";
  } catch {
    toast.textContent = email;
  }
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
});
