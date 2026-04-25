/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

/* ---- NAV scroll effect ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  // Animate bars
  const bars = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    bars.forEach(b => (b.style.transform = b.style.opacity = ''));
  }
});

// Close mobile menu when any link clicked
document.querySelectorAll('.nav__mobile .nav__link, .nav__mobile .btn').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(b => (b.style.transform = b.style.opacity = ''));
  });
});

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links .nav__link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ---- Intersection Observer — scroll animations ---- */
const aosObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Trigger progress bars inside this element
          entry.target.querySelectorAll('.tech__fill').forEach(fill => {
            fill.classList.add('animated');
          });
        }, delay);
        aosObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// Also observe tech cards for progress bars specifically
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.querySelector('.tech__fill')?.classList.add('animated');
        }, delay + 300);
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.tech__card').forEach(card => barObserver.observe(card));

/* ---- Project filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category || '';
      const show = filter === 'all' || categories.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn .35s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject fadeIn keyframe once
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

/* ---- Contact form ---- */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Adicionamos a palavra 'async' aqui para poder usar o 'await fetch'
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    shakeForm();
    return;
  }

  // Prepara o botão para o estado de carregamento
  const btn = form.querySelector('button[type="submit"]');
  const originalBtnContent = btn.innerHTML; // Guarda o visual original do botão
  btn.disabled = true;
  btn.textContent = 'Enviando…';

  // --- O SEGREDO ESTÁ AQUI: O envio real para o Formspree ---
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Se deu tudo certo no Formspree:
      form.reset();
      btn.disabled = false;
      btn.innerHTML = originalBtnContent; // Volta o botão ao normal
      
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 4000);
    } else {
      // Se o Formspree retornou algum erro
      alert('Oops! Ocorreu um problema ao enviar sua mensagem. Tente novamente.');
      btn.disabled = false;
      btn.innerHTML = originalBtnContent;
    }
  } catch (error) {
    // Se a internet cair no meio do envio, por exemplo
    alert('Oops! Ocorreu um erro de conexão.');
    btn.disabled = false;
    btn.innerHTML = originalBtnContent;
  }
});

// A função shakeForm continua exatamente igual
function shakeForm() {
  form.style.animation = 'shake .4s ease';
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{ transform:translateX(0) }
      25%{ transform:translateX(-6px) }
      75%{ transform:translateX(6px) }
    }
  `;
  document.head.appendChild(shakeStyle);
  setTimeout(() => { form.style.animation = ''; }, 400);
}

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Initial call to set correct active state ---- */
updateActiveLink();