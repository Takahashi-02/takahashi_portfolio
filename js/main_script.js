
let currentScreen = 'top';

const VALID_SCREENS = [
  'top', 
  'about', 'about-more',
  'about-value-1', 'about-value-2', 'about-value-3',
  'skills',
  'works','work-1', 'work-2', 'work-3',
  'contact'
];

const GITHUB_USERNAME = 'Takahashi-02';

let reposLoaded = false;

const FADE_MS = 250;
const CONTENT_FADE_MS = 200;
const WELCOME_CHAR_MS = 52;
const WELCOME_LINE_PAUSE_MS = 300;
const LOAD_STEP_MS = 28;
const LOAD_MIN_MS = 2600;
const LOAD_FADE_MS = 700;
const LOAD_PRELOAD_MAX = 92;
let isTransitioning = false;
let welcomeTypingToken = 0;
let currentBgIndex = 1;
let activeBgLayer = 'a';



function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveBackgroundIndex(name) {
  if (name === 'top') return 1;
  if (name === 'skills') return 3;
  if (name === 'contact') return 5;
  if (name === 'works' || /^work-\d+$/.test(name)) return 4;
  if (name === 'about' || name.startsWith('about-')) return 2;
  return 1;
}

function setSceneBackground(name) {
  const nextIndex = resolveBackgroundIndex(name);
  if (nextIndex === currentBgIndex) return;

  const nextLayerKey = activeBgLayer === 'a' ? 'b' : 'a';
  const nextLayer = document.querySelector(`.scene-bg__layer[data-bg-layer="${nextLayerKey}"]`);
  const currentLayer = document.querySelector(`.scene-bg__layer[data-bg-layer="${activeBgLayer}"]`);

  if (!nextLayer || !currentLayer) return;

  const src = `assets/images/bg_${nextIndex}.png`;
  nextLayer.querySelectorAll('.scene-bg__tile').forEach((img) => {
    img.src = src;
  });

  if (prefersReducedMotion()) {
    currentLayer.classList.remove('is-visible');
    nextLayer.classList.add('is-visible');
  } else {
    nextLayer.classList.add('is-visible');
    currentLayer.classList.remove('is-visible');
  }

  activeBgLayer = nextLayerKey;
  currentBgIndex = nextIndex;
}

function applyScreenChange(name) {
  setSceneBackground(name);

  const isTop = (name === 'top');

  document.body.classList.toggle('is-detail-open', !isTop);

  const jumpBar = document.querySelector('.jump-bar');
  if (jumpBar) {
    jumpBar.classList.toggle('is-hidden', isTop);
  }

  const detailPanel = document.querySelector('.detail-panel');
  if (detailPanel) {
    detailPanel.classList.toggle('is-hidden', isTop);
  }

  document.querySelectorAll('.detail-content').forEach((el) => {
    const contentName = el.getAttribute('data-content');
    const isTarget = !isTop && contentName === name;
    el.classList.toggle('is-hidden', !isTarget);
  });

  document.querySelectorAll('.jump-item[data-screen]').forEach((btn) => {
    const target = btn.getAttribute('data-screen');
    
    const isAboutFamily =
    name === 'about' ||
    name === 'about-more' ||
    name === 'about-value-1' ||
    name === 'about-value-2' ||
    name === 'about-value-3';

    const isWorksFamily =
    name === 'works' ||
    name === 'work-1' ||
    name === 'work-2' ||
    name === 'work-3';

    const active = isTop
      ? (target === 'top')
      : (target === name || (isAboutFamily && target === 'about') || (isWorksFamily && target === 'works'));

    btn.classList.toggle('is-active', active);
  });

  if (name === 'contact' && !reposLoaded) {
    loadGitHubRepos();
  }

  const backButton = document.querySelector('.btn-back');
  
  if (backButton) {
  backButton.classList.toggle('is-hidden', isTop);
  }

  const panelBody = document.querySelector('.detail-panel__body');
  
  if (panelBody) {
    panelBody.classList.toggle('is-about-main', name === 'about');
  }

  if (detailPanel) {
    detailPanel.scrollTop = 0;
  }

  if (isTop) {
    playWelcomeTypewriter();
  } else {
    stopWelcomeTypewriter();
  }

}

function createWelcomeCursor() {
  const cursor = document.createElement('span');
  cursor.className = 'top-welcome__cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '▼';
  return cursor;
}

function getWelcomeTypingTarget(line) {
  let target = line.querySelector('.top-welcome__typing');
  if (!target) {
    target = document.createElement('span');
    target.className = 'top-welcome__typing';
    line.appendChild(target);
  }
  return target;
}

function resetWelcomeLines() {
  const welcome = document.querySelector('.top-welcome');
  if (!welcome) return;

  welcome.classList.remove('is-typing', 'is-complete');
  welcome.querySelectorAll('.top-welcome__line[data-text]').forEach((line) => {
    const typing = line.querySelector('.top-welcome__typing');
    if (typing) {
      typing.textContent = '';
    }
  });
}

function stopWelcomeTypewriter() {
  welcomeTypingToken += 1;
  resetWelcomeLines();
}

async function playWelcomeTypewriter() {
  const welcome = document.querySelector('.top-welcome');
  if (!welcome) return;

  const lines = [...welcome.querySelectorAll('.top-welcome__line[data-text]')];
  if (!lines.length) return;

  const token = ++welcomeTypingToken;
  resetWelcomeLines();

  if (prefersReducedMotion()) {
    lines.forEach((line) => {
      getWelcomeTypingTarget(line).textContent = line.dataset.text || '';
    });
    welcome.classList.add('is-complete');
    return;
  }

  welcome.classList.add('is-typing');

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    if (token !== welcomeTypingToken) return;

    const line = lines[lineIndex];
    const text = line.dataset.text || '';
    const isLastLine = lineIndex === lines.length - 1;
    const typing = getWelcomeTypingTarget(line);
    const cursor = createWelcomeCursor();

    typing.appendChild(cursor);

    for (const char of text) {
      if (token !== welcomeTypingToken) return;
      typing.insertBefore(document.createTextNode(char), cursor);
      await wait(WELCOME_CHAR_MS);
    }

    if (!isLastLine) {
      cursor.remove();
      await wait(WELCOME_LINE_PAUSE_MS);
    }
  }

  if (token !== welcomeTypingToken) return;

  welcome.classList.remove('is-typing');
  welcome.classList.add('is-complete');
}

function updateLoadProgress(value) {
  const fill = document.querySelector('.load-screen__gauge-fill');
  const percentLabel = document.querySelector('.load-screen__percent');

  if (fill) {
    fill.style.width = `${value}%`;
  }

  if (percentLabel) {
    percentLabel.textContent = `${value}%`;
  }
}

function preloadCriticalAssets() {
  const urls = [
    'assets/images/bg_1.png',
    'assets/images/floor.png',
    'assets/images/character.png',
  ];

  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
        })
    )
  );
}

async function initLoadScreen() {
  const loadScreen = document.getElementById('load-screen');

  if (!loadScreen) {
    document.body.classList.remove('is-loading');
    playWelcomeTypewriter();
    return;
  }

  if (prefersReducedMotion()) {
    document.body.classList.remove('is-loading');
    loadScreen.remove();
    playWelcomeTypewriter();
    return;
  }

  updateLoadProgress(0);

  const preloadPromise = preloadCriticalAssets();
  const minTimePromise = wait(LOAD_MIN_MS);

  let progress = 0;

  while (progress < LOAD_PRELOAD_MAX) {
    progress += 1;
    updateLoadProgress(progress);
    await wait(LOAD_STEP_MS);
  }

  await Promise.all([preloadPromise, minTimePromise]);

  while (progress < 100) {
    progress += 1;
    updateLoadProgress(progress);
    await wait(LOAD_STEP_MS);
  }

  await wait(350);

  loadScreen.classList.add('is-hidden');
  document.body.classList.remove('is-loading');

  await wait(LOAD_FADE_MS);
  loadScreen.remove();
  playWelcomeTypewriter();
}

async function showScreen(name) {
  if (!VALID_SCREENS.includes(name)) {
    console.warn('未知の画面名:', name);
    return;
  }

  if (currentScreen === name || isTransitioning) {
    return;
  }

  const prevScreen = currentScreen;
  const nextIsTop = (name === 'top');
  const prevIsTop = (prevScreen === 'top');
  const detailPanel = document.querySelector('.detail-panel');
  const panelBody = document.querySelector('.detail-panel__body');

  isTransitioning = true;

  try {
    if (prefersReducedMotion()) {
      currentScreen = name;
      applyScreenChange(name);
      return;
    }

    const isDetailToDetail = !prevIsTop && !nextIsTop;

    // 詳細 → 詳細: 中身だけ一度暗くしてから差し替え
    if (isDetailToDetail && panelBody) {
      panelBody.classList.add('is-fading');
      await wait(CONTENT_FADE_MS);
      currentScreen = name;
      applyScreenChange(name);
      panelBody.classList.remove('is-fading');
      await wait(CONTENT_FADE_MS);
      return;
    }

    // 今見えているパネルをフェードアウト
    if (!prevIsTop && detailPanel) {
      detailPanel.classList.add('is-hidden');
      await wait(FADE_MS);
    }

    currentScreen = name;
    applyScreenChange(name);

    if (!nextIsTop && detailPanel) {
      if (prevIsTop) {
        // TOP → 詳細: いったん非表示にしてからフェードイン
        detailPanel.classList.add('is-hidden');
        void detailPanel.offsetWidth; // reflow（ブラウザに状態変更を認識させる）
        detailPanel.classList.remove('is-hidden');
      }
      else {
        detailPanel.classList.remove('is-hidden');
      } 

      await wait(FADE_MS);
    }

  } 
  
  finally {
    isTransitioning = false;
  }
}

document.addEventListener('DOMContentLoaded', () => 
{
    // コマンド（TOP 用）
    document.querySelectorAll('.command-item[data-screen]').forEach((button) => 
        
        {
        button.addEventListener('click', () => {
        showScreen(button.getAttribute('data-screen'));
        });

    });

  // ジャンプバー（詳細用・TOP 含む）
  document.querySelectorAll('.jump-item[data-screen]').forEach((button) => 
  {
    
    button.addEventListener('click', () => 
    {
      showScreen(button.getAttribute('data-screen'));
    });

  });

    // 戻るボタン
    const backButton = document.querySelector('.btn-back');
  
    if (backButton) 
    {
      backButton.addEventListener('click', () => 
      {
        if (
          currentScreen === 'about-value-1' ||
          currentScreen === 'about-value-2' ||
          currentScreen === 'about-value-3') 
          {
          showScreen('about-more');
          } 
          else if (currentScreen === 'about-more') 
          {
          showScreen('about');
          } 
          else if (
          currentScreen === 'work-1' ||
          currentScreen === 'work-2' ||
          currentScreen === 'work-3') 
          {
          showScreen('works');
          }
          else 
          {
          showScreen('top');
          }
      });
    }

    document.querySelectorAll('.work-card__btn[data-screen]').forEach((button) => 
    {
      button.addEventListener('click', () => 
      {
        showScreen(button.getAttribute('data-screen'));
      });
    });

    document.querySelectorAll('.about-value-btn[data-screen]').forEach((button) => 
    {
      button.addEventListener('click', () => 
      {
        showScreen(button.getAttribute('data-screen'));
      });
    });

    document.querySelectorAll('.btn-more[data-screen]').forEach((button) =>
    {
      button.addEventListener('click', () =>
      {
        showScreen(button.getAttribute('data-screen'));
      });
    });

    initSkillsPanel();
    initLoadScreen();

});

async function loadGitHubRepos() 
{

  const repoList = document.querySelector('#repoList');
  if (!repoList) return;

  repoList.innerHTML = '<p class="repo-message">読み込み中…</p>';

  try {
    const url =
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos` +
      `?sort=updated&per_page=6`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }

    const repos = await response.json();

    if (!repos.length) {
      repoList.innerHTML =
        '<p class="repo-message">公開リポジトリが見つかりませんでした。</p>';
      return;
    }

    repoList.innerHTML = repos
      .map((repo) => {
        const desc = repo.description || '説明文は未設定です。';
        const lang = repo.language || '言語不明';
        const updated = new Date(repo.updated_at).toLocaleDateString('ja-JP');

        return `
          <article class="repo-item">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
            <p>${desc}</p>
            <small>${lang} / 更新: ${updated}</small>
          </article>
        `;
      })
      .join('');

    reposLoaded = true;

  } catch (error) {
    repoList.innerHTML =
      '<p class="repo-message">リポジトリを取得できませんでした。しばらくしてから再度お試しください。</p>';
    console.warn('GitHub API error:', error);
  }
}

document.querySelectorAll('.about-value-btn[data-screen], .about-value-nav[data-screen]').forEach((button) => 
{
  button.addEventListener('click', () => 
  {
  showScreen(button.getAttribute('data-screen'));
  });
});

function initSkillsPanel() {
  const buttons = document.querySelectorAll('.skill-btn[data-skill]');
  const panels = document.querySelectorAll('.skills-detail-panel[data-skill-panel]');
  if (!buttons.length || !panels.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-skill');

      buttons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      panels.forEach((panel) => {
        const isTarget = panel.getAttribute('data-skill-panel') === id;
        panel.toggleAttribute('hidden', !isTarget);
        panel.classList.toggle('is-active', isTarget);
      });
    });
  });
}