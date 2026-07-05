const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");
const depthItems = document.querySelectorAll("[data-depth]");
const contactForm = document.querySelector(".contact-form");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
};

const setDepth = () => {
  const viewportMid = window.innerHeight / 2;

  depthItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const depth = Number(item.dataset.depth || 0.2);
    const offset = (rect.top + rect.height / 2 - viewportMid) * depth;
    const rotate = offset * 0.018;

    item.style.setProperty("--scroll-offset", `${offset.toFixed(2)}px`);
    item.style.transform = `${item.dataset.baseTransform || ""} translate3d(0, ${(-offset * 0.18).toFixed(2)}px, 0) rotateZ(${rotate.toFixed(2)}deg)`;
  });
};

depthItems.forEach((item) => {
  item.dataset.baseTransform = getComputedStyle(item).transform === "none" ? "" : getComputedStyle(item).transform;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 6, 4) * 70}ms`;
  revealObserver.observe(item);
});

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Stäng meny" : "Öppna meny");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Öppna meny");
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("namn") || "";
    const email = formData.get("epost") || "";
    const message = formData.get("meddelande") || "";
    const body = [
      `Namn: ${name}`,
      `E-post: ${email}`,
      "",
      "Meddelande:",
      message
    ].join("\n");

    window.location.href = `mailto:kontakt@aceworks.se?subject=${encodeURIComponent("Kontaktförfrågan från AceWorks hemsida")}&body=${encodeURIComponent(body)}`;
  });
}

window.addEventListener("scroll", () => {
  setHeaderState();
  setDepth();
});

window.addEventListener("resize", setDepth);

setHeaderState();
setDepth();
