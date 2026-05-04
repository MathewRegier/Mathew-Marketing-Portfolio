const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const contactForm = document.querySelector("#contact-form");
const submitButton = document.querySelector("#submit-btn");
const formStatus = document.querySelector("[data-form-status]");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeMenu = () => {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  navMenu.classList.remove("is-open");
  document.body.classList.remove("nav-open");
};

const toggleMenu = () => {
  if (!navToggle || !navMenu) return;

  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  navMenu.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  items.forEach((item) => observer.observe(item));
};

const setFormStatus = (message, type = "") => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`.trim();
};

const handleContactSubmit = async (event) => {
  event.preventDefault();
  if (!contactForm || !submitButton) return;

  const originalText = submitButton.textContent;
  const payload = Object.fromEntries(new FormData(contactForm));

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  setFormStatus("");

  try {
    const response = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to send message.");
    }

    contactForm.reset();
    setFormStatus("Message sent successfully. I will get back to you soon.", "success");
  } catch (error) {
    setFormStatus(error.message || "Message failed to send. Please try email or phone instead.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
};

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (target.matches("[data-nav-toggle]") || target.closest("[data-nav-toggle]")) {
    toggleMenu();
    return;
  }

  if (target.matches("[data-nav-menu] a")) {
    closeMenu();
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", handleContactSubmit);
}

setHeaderState();
initReveal();
