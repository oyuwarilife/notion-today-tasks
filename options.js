// DOM要素
const form = document.getElementById('settingsForm');
const apiTokenInput = document.getElementById('apiToken');
const databaseIdInput = document.getElementById('databaseId');
const statusDiv = document.getElementById('status');

// 保存済み設定を読み込み
document.addEventListener('DOMContentLoaded', async () => {
  const { apiToken, databaseId } = await chrome.storage.sync.get(['apiToken', 'databaseId']);

  if (apiToken) {
    apiTokenInput.value = apiToken;
  }

  if (databaseId) {
    databaseIdInput.value = databaseId;
  }
});

// フォーム送信
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiToken = apiTokenInput.value.trim();
  const databaseId = databaseIdInput.value.trim();

  if (!apiToken || !databaseId) {
    showStatus('すべての項目を入力してください', 'error');
    return;
  }

  // API Token形式チェック
  if (!apiToken.startsWith('secret_')) {
    showStatus('API Tokenは "secret_" で始まる必要があります', 'error');
    return;
  }

  // Database ID形式チェック（32文字の英数字またはハイフン）
  if (!/^[a-f0-9]{32}$/i.test(databaseId.replace(/-/g, ''))) {
    showStatus('Database IDの形式が正しくありません（32文字の英数字）', 'error');
    return;
  }

  try {
    // 設定を保存
    await chrome.storage.sync.set({ apiToken, databaseId });

    showStatus('設定を保存しました ✓', 'success');

    // 2秒後にステータスを非表示
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 2000);

  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('設定の保存に失敗しました', 'error');
  }
});

// ステータス表示
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
}
