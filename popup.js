// Notion API設定
const NOTION_VERSION = '2022-06-28';

// DOM要素
const taskList = document.getElementById('taskList');
const refreshBtn = document.getElementById('refreshBtn');
const settingsBtn = document.getElementById('settingsBtn');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  refreshBtn.addEventListener('click', loadTasks);
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  addTaskBtn.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});

// タスク一覧読み込み
async function loadTasks() {
  taskList.innerHTML = '<div class="loading">読み込み中...</div>';

  try {
    const { apiToken, databaseId } = await chrome.storage.sync.get(['apiToken', 'databaseId']);

    if (!apiToken || !databaseId) {
      taskList.innerHTML = '<div class="error">設定が必要です。⚙️ 設定ボタンからAPI TokenとDatabase IDを入力してください。</div>';
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          property: '実行日',
          date: {
            equals: today
          }
        },
        sorts: [
          {
            property: '完了',
            direction: 'ascending'
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'タスクの取得に失敗しました');
    }

    const data = await response.json();
    displayTasks(data.results);

  } catch (error) {
    console.error('Error loading tasks:', error);
    taskList.innerHTML = `<div class="error">エラー: ${error.message}</div>`;
  }
}

// タスク表示
function displayTasks(tasks) {
  if (tasks.length === 0) {
    taskList.innerHTML = '<div class="empty">今日のタスクはありません 🎉</div>';
    return;
  }

  taskList.innerHTML = '';

  tasks.forEach(task => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

// タスク要素作成
function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = task.id;
  checkbox.checked = task.properties['完了']?.checkbox || false;
  checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

  const label = document.createElement('label');
  label.htmlFor = task.id;
  label.textContent = task.properties['Name']?.title[0]?.plain_text || '(タイトルなし)';

  div.appendChild(checkbox);
  div.appendChild(label);

  return div;
}

// タスク完了/未完了切り替え
async function toggleTask(taskId, isChecked) {
  try {
    const { apiToken } = await chrome.storage.sync.get(['apiToken']);

    const response = await fetch(`https://api.notion.com/v1/pages/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          '完了': {
            checkbox: isChecked
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('タスクの更新に失敗しました');
    }

  } catch (error) {
    console.error('Error toggling task:', error);
    alert(`エラー: ${error.message}`);
    loadTasks(); // 再読み込み
  }
}

// タスク追加
async function addTask() {
  const taskName = newTaskInput.value.trim();

  if (!taskName) {
    return;
  }

  try {
    const { apiToken, databaseId } = await chrome.storage.sync.get(['apiToken', 'databaseId']);

    if (!apiToken || !databaseId) {
      alert('設定が必要です。⚙️ 設定ボタンからAPI TokenとDatabase IDを入力してください。');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    addTaskBtn.disabled = true;
    addTaskBtn.textContent = '追加中...';

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          'Name': {
            title: [
              {
                text: {
                  content: taskName
                }
              }
            ]
          },
          '実行日': {
            date: {
              start: today
            }
          },
          '完了': {
            checkbox: false
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'タスクの追加に失敗しました');
    }

    newTaskInput.value = '';
    await loadTasks();

  } catch (error) {
    console.error('Error adding task:', error);
    alert(`エラー: ${error.message}`);
  } finally {
    addTaskBtn.disabled = false;
    addTaskBtn.textContent = '+ 追加';
  }
}
