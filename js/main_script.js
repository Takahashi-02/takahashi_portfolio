
let currentScreen = 'top';

const VALID_SCREENS = ['top', 'about', 'skills', 'works', 'contact'];

const GITHUB_USERNAME = 'Takahashi-02';

let reposLoaded = false;

const FADE_MS = 250;
const CONTENT_FADE_MS = 200;
let isTransitioning = false;



function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyScreenChange(name) {
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
    const active = isTop ? (target === 'top') : (target === name);
    btn.classList.toggle('is-active', active);
  });

  if (name === 'contact' && !reposLoaded) {
    loadGitHubRepos();
  }
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

    // 新しいパネルをフェードイン
    if (!nextIsTop && detailPanel) {
      detailPanel.classList.remove('is-hidden');
      await wait(FADE_MS);
    }
  } finally {
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
        showScreen('top');
    });
    }

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