/**
 * portfolio.js — Portfolio Filter & Card Rendering
 */

export const projectsData = [
  {
    id: 'ecommerce-dashboard',
    title: 'E-Commerce Dashboard',
    description: 'Dashboard admin untuk manajemen toko online dengan fitur analitik penjualan real-time dan manajemen inventaris yang lengkap.',
    thumbnail: '/src/assets/images/projects/ecommerce-dashboard.webp',
    category: 'Web App',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    repoUrl: 'https://github.com/dina-kartika/ecommerce-dashboard',
    demoUrl: 'https://ecommerce-dashboard-demo.netlify.app',
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    description: 'Aplikasi cuaca mobile-first dengan prakiraan 7 hari, animasi cuaca dinamis, dan integrasi OpenWeather API.',
    thumbnail: '/src/assets/images/projects/weather-app.webp',
    category: 'Mobile',
    techStack: ['React Native', 'OpenWeather API', 'AsyncStorage'],
    repoUrl: 'https://github.com/dina-kartika/weather-app',
  },
  {
    id: 'data-visualizer',
    title: 'Data Visualizer',
    description: 'Platform visualisasi data interaktif untuk analisis dataset CSV dengan berbagai tipe chart dan ekspor laporan PDF.',
    thumbnail: '/src/assets/images/projects/data-visualizer.webp',
    category: 'Data',
    techStack: ['Python', 'D3.js', 'Pandas', 'Flask'],
  },
];

export function filterProjects(projects, category) {
  if (category === 'all') return projects;
  return projects.filter((p) => p.category === category);
}

export function createProjectCard(project, index = 0) {
  const article = document.createElement('article');
  article.className = 'project-card reveal';
  article.dataset.category = project.category;
  article.style.animationDelay = `${index * 0.1}s`;

  // Thumbnail
  const img = document.createElement('img');
  img.className = 'project-card__thumbnail';
  img.src = project.thumbnail;
  img.alt = project.title;
  img.loading = 'lazy';
  img.onerror = function () {
    this.src = '/src/assets/images/placeholder.svg';
    this.onerror = null;
  };

  // Card body
  const body = document.createElement('div');
  body.className = 'project-card__body';

  // Category badge
  const cat = document.createElement('span');
  cat.className = 'project-card__category';
  cat.textContent = project.category;

  // Title
  const title = document.createElement('h3');
  title.className = 'project-card__title';
  title.textContent = project.title;

  // Description
  const desc = document.createElement('p');
  desc.className = 'project-card__desc';
  desc.textContent = project.description;

  // Tech tags
  const tags = document.createElement('div');
  tags.className = 'project-card__tags';
  (project.techStack || []).forEach((tech) => {
    const tag = document.createElement('span');
    tag.className = 'project-card__tag';
    tag.textContent = tech;
    tags.appendChild(tag);
  });

  // Links
  const links = document.createElement('div');
  links.className = 'project-card__links';

  if (project.repoUrl) {
    const repoLink = document.createElement('a');
    repoLink.className = 'project-card__link project-card__link--repo';
    repoLink.href = project.repoUrl;
    repoLink.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> GitHub`;
    repoLink.target = '_blank';
    repoLink.rel = 'noopener noreferrer';
    repoLink.setAttribute('aria-label', `Repositori ${project.title}`);
    links.appendChild(repoLink);
  }

  if (project.demoUrl) {
    const demoLink = document.createElement('a');
    demoLink.className = 'project-card__link project-card__link--demo';
    demoLink.href = project.demoUrl;
    demoLink.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Live Demo`;
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.setAttribute('aria-label', `Demo ${project.title}`);
    links.appendChild(demoLink);
  }

  body.appendChild(cat);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(tags);
  body.appendChild(links);

  article.appendChild(img);
  article.appendChild(body);
  return article;
}

export function initPortfolioFilter(projects) {
  const grid = document.querySelector('#project-grid');
  if (!grid) return;

  const filterButtons = document.querySelectorAll('.filter-btn');

  function renderCards(items) {
    grid.style.opacity = '0';
    setTimeout(() => {
      grid.innerHTML = '';
      items.forEach((project, idx) => grid.appendChild(createProjectCard(project, idx)));
      grid.style.opacity = '1';
      grid.style.transition = 'opacity 0.3s ease';
      // Re-trigger reveal for new cards
      grid.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('in-view');
        requestAnimationFrame(() => {
          setTimeout(() => el.classList.add('in-view'), 50);
        });
      });
    }, 200);
  }

  renderCards(projects);

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => { b.setAttribute('aria-pressed', 'false'); b.classList.remove('filter-btn--active'); });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('filter-btn--active');
      renderCards(filterProjects(projects, btn.dataset.filter || 'all'));
    });
  });

  const allBtn = Array.from(filterButtons).find(b => (b.dataset.filter || '').toLowerCase() === 'all');
  if (allBtn) { allBtn.setAttribute('aria-pressed', 'true'); allBtn.classList.add('filter-btn--active'); }
}
