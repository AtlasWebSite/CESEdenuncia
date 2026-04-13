const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const faqButtons = document.querySelectorAll(".faq-question");
const revealItems = document.querySelectorAll(".reveal");
const reportForm = document.querySelector("#report-form");
const formNote = document.querySelector("#form-note");

const closeMenu = () => {
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const openMenu = () => {
  body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
};

const syncHeaderState = () => {
  const isAtTop = window.scrollY < 24;

  if (isAtTop) {
    header.classList.remove("is-scrolled");
    return;
  }

  header.classList.add("is-scrolled");
};

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.contains("menu-open");

  if (isOpen) {
    closeMenu();
    return;
  }

  openMenu();
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = nav.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (clickedInsideMenu || clickedToggle) {
    return;
  }

  closeMenu();
});

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isActive = item.classList.contains("active");

    faqButtons.forEach((currentButton) => {
      currentButton.setAttribute("aria-expanded", "false");
      currentButton.closest(".faq-item").classList.remove("active");
    });

    if (isActive) {
      return;
    }

    item.classList.add("active");
    button.setAttribute("aria-expanded", "true");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => {
  observer.observe(item);
});

window.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const perfil = document.querySelector("#perfil").value.trim();
  const email = document.querySelector("#email").value.trim();
  const turma = document.querySelector("#turma").value.trim();
  const mensagem = document.querySelector("#mensagem").value.trim();

  if (!perfil || !mensagem) {
    formNote.textContent = "Informe pelo menos a relação com a escola e a descrição da situação.";
    return;
  }

  const assunto = encodeURIComponent("Canal CESE - Relato de possível bullying");
  const corpo = encodeURIComponent(
    "Canal de Apoio e Denúncia - Colégio CESE\n\n" +
    "Nome: " + (nome || "Não informado") + "\n" +
    "Relação com a escola: " + perfil + "\n" +
    "E-mail para retorno: " + (email || "Não informado") + "\n" +
    "Turma ou setor: " + (turma || "Não informado") + "\n\n" +
    "Descrição da situação:\n" + mensagem + "\n"
  );

  formNote.textContent = "A mensagem foi preparada para envio no seu aplicativo de e-mail.";
  window.location.href = "mailto:gatexdoidex@gmail.com?subject=" + assunto + "&body=" + corpo;
});
