const elements = {
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  musicCard: document.getElementById('musicCard'),
  musicThumbnail: document.getElementById('musicThumbnail'),
  musicTitle: document.getElementById('musicTitle'),
  musicArtist: document.getElementById('musicArtist'),
  musicStatus: document.getElementById('musicStatus'),
  noMusic: document.getElementById('noMusic'),
  openYTMBtn: document.getElementById('openYTMBtn'),
  githubLink: document.getElementById('githubLink'),
  creatorLink: document.getElementById('creatorLink')
};

function updateUI(status) {
  if (status.isConnected) {
    elements.statusDot.className = 'status-dot connected';
    elements.statusText.textContent = 'CONNECTED TO VENCORD';
  } else {
    elements.statusDot.className = 'status-dot disconnected';
    elements.statusText.textContent = 'WAITING FOR VENCORD...';
  }

  if (status.currentMusic && status.currentMusic.title) {
    elements.musicCard.classList.remove('hidden');
    elements.noMusic.classList.add('hidden');

    elements.musicTitle.textContent = status.currentMusic.title;
    elements.musicArtist.textContent = status.currentMusic.artist || 'Unknown Artist';

    if (status.currentMusic.thumbnail) {
      elements.musicThumbnail.src = status.currentMusic.thumbnail;
      elements.musicThumbnail.style.display = 'block';
    }

    if (status.currentMusic.isPaused) {
      elements.musicStatus.className = 'music-status paused';
      elements.musicStatus.innerHTML = '<span>PAUSED</span>';
    } else {
      elements.musicStatus.className = 'music-status playing';
      elements.musicStatus.innerHTML = '<span>PLAYING</span>';
    }
  } else {
    elements.musicCard.classList.add('hidden');
    elements.noMusic.classList.remove('hidden');
  }
}

async function requestStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    updateUI(response);
  } catch (error) {
    updateUI({
      isConnected: false,
      currentMusic: null
    });
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'STATUS_UPDATE') {
    updateUI(message.data);
  }
});

elements.openYTMBtn.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://music.youtube.com' });
});

elements.githubLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://github.com/Louchatfroff/YTMusic-RPC' });
});

elements.creatorLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://louchat.neurallab.ovh/' });
});

requestStatus();
setInterval(requestStatus, 2000);
