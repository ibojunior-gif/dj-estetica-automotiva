/**
 * DJ Estética Automotiva — Main JavaScript
 * Interatividade: Slider Antes & Depois, Filtros de Galeria, Menu Mobile,
 * Modal de Orçamento com WhatsApp e Scroll Suave.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu Mobile
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.getElementById('headerNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = headerNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Header Scroll Effect & Active Link Highlight
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Highlight menu link
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });

  // 3. Slider Interativo Antes & Depois
  const baContainer = document.getElementById('baSliderContainer');
  const baAfter = document.getElementById('baSliderAfter');
  const baHandle = document.getElementById('baHandle');
  const baRange = document.getElementById('baRange');

  if (baContainer && baAfter && baHandle && baRange) {
    function updateSlider(val) {
      baAfter.style.width = val + '%';
      baHandle.style.left = val + '%';
    }

    baRange.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    // Touch and mouse drag support directly on the container
    let isDragging = false;

    function handleMove(clientX) {
      const rect = baContainer.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      baRange.value = percentage;
      updateSlider(percentage);
    }

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleMove(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 4. Filtro da Galeria de Resultados
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 5. Modal Pedir Orçamento
  const modalBackdrop = document.getElementById('orcamentoModal');
  const openModalBtns = document.querySelectorAll('.btn-open-orcamento');
  const closeModalBtn = document.getElementById('closeOrcamentoModal');
  const orcamentoForm = document.getElementById('orcamentoForm');

  function openModal(defaultService = '') {
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (defaultService) {
        const select = document.getElementById('modalServico');
        if (select) select.value = defaultService;
      }
    }
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || '';
      openModal(serviceName);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Submissão do Formulário de Orçamento para o WhatsApp
  if (orcamentoForm) {
    orcamentoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('modalNome')?.value.trim() || 'Cliente';
      const viatura = document.getElementById('modalViatura')?.value.trim() || 'Não especificada';
      const servico = document.getElementById('modalServico')?.value || 'Orçamento Geral';
      const detalhes = document.getElementById('modalDetalhes')?.value.trim() || 'Nenhum detalhe adicional';

      const mensagem = `Olá, DJ Estética Automotiva!%0A%0A*Pedido de Orçamento:*%0A👤 *Nome:* ${encodeURIComponent(nome)}%0A🚗 *Viatura:* ${encodeURIComponent(viatura)}%0A🛠️ *Serviço Pretendido:* ${encodeURIComponent(servico)}%0A📝 *Observações:* ${encodeURIComponent(detalhes)}%0A%0AAguardo contacto e valores para agendamento. Obrigado!`;

      // Número principal de Cascais
      const url = `https://wa.me/351926557626?text=${mensagem}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }
});
