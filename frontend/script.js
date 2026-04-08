const routes = ['inicio', 'importancia', 'apoio', 'conteudo', 'denuncia'];
const routeButtons = Array.from(document.querySelectorAll('[data-route]'));
const views = Array.from(document.querySelectorAll('.view'));
const denunciaForm = document.getElementById('denuncia-form');
const formFeedback = document.getElementById('form-feedback');
const adminForm = document.getElementById('admin-form');
const adminPanel = document.getElementById('admin-panel');
const adminFeedback = document.getElementById('admin-feedback');
const adminList = document.getElementById('admin-list');
const refreshAdminButton = document.getElementById('refresh-admin');
const exportAdminButton = document.getElementById('export-admin');
const clearAdminButton = document.getElementById('clear-admin');
const openAdminDrawerButton = document.getElementById('open-admin-drawer');
const closeAdminDrawerButton = document.getElementById('close-admin-drawer');
const adminDrawer = document.getElementById('admin-drawer');
const adminOverlay = document.getElementById('admin-overlay');

let adminPassword = '';

function setFeedback(element, message, isError) {
  element.textContent = message;
  element.classList.remove('is-error');

  if (!isError) {
    return;
  }

  element.classList.add('is-error');
}

function formatDate(value) {
  const date = new Date(value);

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

function getRouteButtonState(button, route) {
  const buttonRoute = button.dataset.route;

  if (buttonRoute !== route) {
    return false;
  }

  return button.classList.contains('tab-button');
}

function goToRoute(route) {
  const safeRoute = routes.includes(route) ? route : 'inicio';

  views.forEach((view) => {
    const isVisible = view.id === `view-${safeRoute}`;
    view.classList.toggle('is-visible', isVisible);
  });

  routeButtons.forEach((button) => {
    const isActiveTab = getRouteButtonState(button, safeRoute);
    button.classList.toggle('is-active', isActiveTab);
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function openAdminDrawer() {
  adminDrawer.classList.add('is-open');
  adminDrawer.setAttribute('aria-hidden', 'false');
  adminOverlay.hidden = false;
  requestAnimationFrame(() => {
    adminOverlay.classList.add('is-visible');
  });
}

function closeAdminDrawer() {
  adminDrawer.classList.remove('is-open');
  adminDrawer.setAttribute('aria-hidden', 'true');
  adminOverlay.classList.remove('is-visible');
  window.setTimeout(() => {
    if (adminDrawer.classList.contains('is-open')) {
      return;
    }

    adminOverlay.hidden = true;
  }, 220);
}

function escapeMarkup(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createAdminItem(denuncia) {
  const article = document.createElement('article');
  article.className = 'admin-item';

  const safeNome = denuncia.nome ? escapeMarkup(denuncia.nome) : 'Anonimo';
  const safeDescricao = escapeMarkup(denuncia.descricao);

  article.innerHTML = `
    <div class="admin-item-header">
      <div>
        <h3>${safeNome}</h3>
        <div class="admin-meta">#${denuncia.id} - ${formatDate(denuncia.data)}</div>
      </div>
      <button class="danger-button" type="button" data-delete-id="${denuncia.id}">Apagar</button>
    </div>
    <p>${safeDescricao}</p>
  `;

  return article;
}

function renderAdminList(denuncias) {
  adminList.innerHTML = '';

  if (denuncias.length) {
    const fragment = document.createDocumentFragment();

    denuncias.forEach((denuncia) => {
      fragment.appendChild(createAdminItem(denuncia));
    });

    adminList.appendChild(fragment);
    return;
  }

  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.textContent = 'Nenhuma denuncia cadastrada no momento.';
  adminList.appendChild(emptyState);
}

async function request(url, options) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    throw new Error(data.error || 'Nao foi possivel concluir a solicitacao.');
  }

  const text = await response.text();

  if (response.ok) {
    return text;
  }

  throw new Error('Nao foi possivel concluir a solicitacao.');
}

async function loadDenuncias() {
  if (!adminPassword) {
    setFeedback(adminFeedback, 'Informe a senha para acessar a area administrativa.', true);
    return;
  }

  const data = await request('/denuncias', {
    method: 'GET',
    headers: {
      'x-admin-password': adminPassword
    }
  });

  renderAdminList(data.denuncias);
  setFeedback(adminFeedback, `Painel atualizado. ${data.total} denuncia(s) encontrada(s).`, false);
}

async function handleDenunciaSubmit(event) {
  event.preventDefault();
  setFeedback(formFeedback, 'Enviando sua denuncia com cuidado...', false);

  const formData = new FormData(denunciaForm);
  const payload = {
    nome: String(formData.get('nome') || ''),
    descricao: String(formData.get('descricao') || '')
  };

  try {
    await request('/denuncias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    denunciaForm.reset();
    setFeedback(formFeedback, 'Denuncia enviada com sucesso. Obrigado por buscar protecao.', false);
  } catch (error) {
    setFeedback(formFeedback, error.message, true);
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById('admin-password');
  adminPassword = passwordInput.value.trim();

  if (!adminPassword) {
    setFeedback(adminFeedback, 'Digite a senha do administrador.', true);
    return;
  }

  adminPanel.classList.remove('is-hidden');

  try {
    await loadDenuncias();
  } catch (error) {
    adminPanel.classList.add('is-hidden');
    setFeedback(adminFeedback, error.message, true);
  }
}

async function handleDeleteClick(event) {
  const button = event.target.closest('[data-delete-id]');

  if (!button) {
    return;
  }

  const id = button.dataset.deleteId;

  try {
    await request(`/denuncias/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': adminPassword
      }
    });

    await loadDenuncias();
  } catch (error) {
    setFeedback(adminFeedback, error.message, true);
  }
}

async function handleDeleteAll() {
  if (!adminPassword) {
    setFeedback(adminFeedback, 'Digite a senha de administrador para continuar.', true);
    return;
  }

  const confirmed = window.confirm('Tem certeza que deseja apagar todas as denuncias?');

  if (!confirmed) {
    return;
  }

  try {
    await request('/denuncias', {
      method: 'DELETE',
      headers: {
        'x-admin-password': adminPassword
      }
    });

    await loadDenuncias();
  } catch (error) {
    setFeedback(adminFeedback, error.message, true);
  }
}

async function handleExport() {
  if (!adminPassword) {
    setFeedback(adminFeedback, 'Digite a senha de administrador para exportar.', true);
    return;
  }

  try {
    const response = await fetch('/export', {
      method: 'GET',
      headers: {
        'x-admin-password': adminPassword
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Nao foi possivel exportar os dados.');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'denuncias.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setFeedback(adminFeedback, 'Arquivo exportado com sucesso.', false);
  } catch (error) {
    setFeedback(adminFeedback, error.message, true);
  }
}

function handleRouteClick(event) {
  const button = event.currentTarget;
  const route = button.dataset.route;
  goToRoute(route);
}

routeButtons.forEach((button) => {
  button.addEventListener('click', handleRouteClick);
});

denunciaForm.addEventListener('submit', handleDenunciaSubmit);
adminForm.addEventListener('submit', handleAdminLogin);
adminList.addEventListener('click', handleDeleteClick);
openAdminDrawerButton.addEventListener('click', openAdminDrawer);
closeAdminDrawerButton.addEventListener('click', closeAdminDrawer);
adminOverlay.addEventListener('click', closeAdminDrawer);
refreshAdminButton.addEventListener('click', () => {
  loadDenuncias().catch((error) => {
    setFeedback(adminFeedback, error.message, true);
  });
});
clearAdminButton.addEventListener('click', () => {
  handleDeleteAll();
});
exportAdminButton.addEventListener('click', () => {
  handleExport();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  closeAdminDrawer();
});

goToRoute('inicio');
