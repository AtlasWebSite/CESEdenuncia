const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const faqButtons = document.querySelectorAll(".faq-question");
const revealItems = document.querySelectorAll(".reveal");
const reportForm = document.querySelector("#report-form");
const formNote = document.querySelector("#form-note");
const submitButton = document.querySelector("#submit-button");

const emailJsConfig = {
  publicKey: "-ccNaqVsXCRdYQc1h",
  serviceId: "service_75spfa2",
  templateId: "template_ct13t4m"
};

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

const isEmailJsConfigured = () => {
  const hasPublicKey = emailJsConfig.publicKey !== "COLE_AQUI_PUBLIC_KEY";
  const hasServiceId = emailJsConfig.serviceId !== "COLE_AQUI_SERVICE_ID";
  const hasTemplateId = emailJsConfig.templateId !== "COLE_AQUI_TEMPLATE_ID";

  if (!hasPublicKey || !hasServiceId || !hasTemplateId) {
    return false;
  }

  return true;
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

if (window.emailjs && isEmailJsConfigured()) {
  window.emailjs.init({
    publicKey: emailJsConfig.publicKey
  });
}

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const perfil = document.querySelector("#perfil").value.trim();
  const email = document.querySelector("#email").value.trim();
  const turma = document.querySelector("#turma").value.trim();
  const mensagem = document.querySelector("#mensagem").value.trim();
  const replyToField = reportForm.querySelector('input[name="reply_to"]');

  if (!perfil || !mensagem) {
    formNote.textContent = "Informe pelo menos a relação com a escola e a descrição da situação.";
    return;
  }

  if (!window.emailjs) {
    formNote.textContent = "A biblioteca do envio não foi carregada.";
    return;
  }

  if (!isEmailJsConfigured()) {
    formNote.textContent = "Falta configurar o EmailJS com as chaves da conta.";
    return;
  }

  replyToField.value = email || "gatexdoidex@gmail.com";
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  formNote.textContent = "Enviando denúncia...";

  window.emailjs.sendForm(
    emailJsConfig.serviceId,
    emailJsConfig.templateId,
    reportForm,
    {
      publicKey: emailJsConfig.publicKey
    }
  ).then(() => {
    formNote.textContent = "Denúncia enviada com sucesso.";
    submitButton.disabled = false;
    submitButton.textContent = "Enviar denúncia";
    reportForm.reset();
  }).catch((error) => {
    const errorText = error && error.text ? error.text : "erro_desconhecido";
    formNote.textContent = "Falha no envio: " + errorText;
    submitButton.disabled = false;
    submitButton.textContent = "Enviar denúncia";
  });
});
