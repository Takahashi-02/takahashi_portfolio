let currentScreen = 'top';
const VALID_SCREENS = ['top', 'about', 'skills', 'works', 'timeline', 'contact'];

function showScreen(name) {
  if (!VALID_SCREENS.includes(name)) {
    console.warn('未知の画面名:', name);
    return;
  }
  if (currentScreen === name) {
    return;
  }

  currentScreen = name;
  const isTop = (name === 'top');

  // 詳細モード ON/OFF（キャラ移動・コマンド非表示もここで制御）
  document.body.classList.toggle('is-detail-open', !isTop);

  // ジャンプバー
  const jumpBar = document.querySelector('.jump-bar');
  if (jumpBar) {
    jumpBar.classList.toggle('is-hidden', isTop);
  }

  // 大詳細パネル
  const detailPanel = document.querySelector('.detail-panel');
  if (detailPanel) {
    detailPanel.classList.toggle('is-hidden', isTop);
  }

  // パネル内コンテンツの切り替え
  document.querySelectorAll('.detail-content').forEach((el) => {
    const contentName = el.getAttribute('data-content');
    const isTarget = !isTop && contentName === name;
    el.classList.toggle('is-hidden', !isTarget);
  });

  // ジャンプバーの現在位置ハイライト
  document.querySelectorAll('.jump-item[data-screen]').forEach((btn) => {
    const target = btn.getAttribute('data-screen');
    const active = isTop ? (target === 'top') : (target === name);
    btn.classList.toggle('is-active', active);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // コマンド（TOP 用）
  document.querySelectorAll('.command-item[data-screen]').forEach((button) => {
    button.addEventListener('click', () => {
      showScreen(button.getAttribute('data-screen'));
    });
  });

  // ジャンプバー（詳細用・TOP 含む）
  document.querySelectorAll('.jump-item[data-screen]').forEach((button) => {
    button.addEventListener('click', () => {
      showScreen(button.getAttribute('data-screen'));
    });
  });

  // 戻るボタン
  const backButton = document.querySelector('.btn-back');
  if (backButton) {
    backButton.addEventListener('click', () => {
      showScreen('top');
    });
  }
});