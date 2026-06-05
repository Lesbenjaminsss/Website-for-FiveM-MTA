document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCityLifeTabs();
  initCookieBanner();
  initScrollAnimations();
  initServerStatus();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('.navbar__link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  });

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('navbar__burger--open');
    navMenu.classList.toggle('navbar__nav--open');
    document.body.style.overflow = navMenu.classList.contains('navbar__nav--open') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('navbar__burger--open');
      navMenu.classList.remove('navbar__nav--open');
      document.body.style.overflow = '';

      if (link.getAttribute('href').startsWith('#')) {
        navLinks.forEach(l => l.classList.remove('navbar__link--active'));
        link.classList.add('navbar__link--active');
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('navbar__link--active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

function initCityLifeTabs() {
  const tabs = document.querySelectorAll('.city-life__tab');
  const panels = document.querySelectorAll('.city-life__content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('city-life__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('city-life__tab--active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        panel.classList.toggle('city-life__content--active', panel.dataset.panel === target);
      });
    });
  });
}

function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');

  if (localStorage.getItem('cookiesAccepted')) {
    banner.classList.add('cookie-banner--hidden');
    return;
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.classList.add('cookie-banner--hidden');
  });
}

function initScrollAnimations() {
  const animated = document.querySelectorAll(
    '.step-card, .character-card, .team-card, .gallery__item, .rules__item, .faq__item'
  );

  animated.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animated.forEach(el => observer.observe(el));
}

function initServerStatus() {
  const badge = document.getElementById('serverStatus');
  const dot = badge.querySelector('.status-badge__dot');
  const text = badge.querySelector('.status-badge__text');

  // Sunucu IP'nizi buraya ekleyin — FiveM status API ile entegre edilebilir
  const SERVER_IP = '127.0.0.1:30120';

  fetch(`https://servers-frontend.fivem.net/api/servers/single/${SERVER_IP}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.Data) {
        const players = data.Data.clients || 0;
        const maxPlayers = data.Data.sv_maxclients || 0;
        badge.classList.add('status-badge--online');
        text.textContent = `Sunucu Çevrimiçi — ${players}/${maxPlayers} Oyuncu`;
      } else {
        setOffline();
      }
    })
    .catch(() => setOffline());

  function setOffline() {
    badge.classList.remove('status-badge--online');
    text.textContent = 'Sunucu Çevrimdışı';
  }
}
