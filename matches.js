if (!requireAuth()) {
    throw new Error('Not authenticated');
}

const userId = getUserId();
let currentMatches = [];
let allSkills = [];

async function loadMatches() {
    try {
        currentMatches = await apiRequest(API_ENDPOINTS.MATCHES.BY_USER(userId));
        allSkills = await apiRequest(API_ENDPOINTS.SKILLS.BASE);
        displayMatches();
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

function displayMatches() {
    const container = document.getElementById('matchesContainer');
    if (!container) return;

    if (currentMatches.length === 0) {
        container.innerHTML = '<p class="empty-state">No matches found. Add skills you offer and skills you want to learn to get matched!</p>';
        return;
    }

    const skillMap = {};
    allSkills.forEach(skill => {
        skillMap[skill.id] = skill.skillName;
    });

    container.innerHTML = currentMatches.map(match => `
        <div class="match-card">
            <div class="match-header">
                <div class="match-info">
                    <h3>${match.userName}</h3>
                    <p>${match.userLocation || 'Location not specified'}</p>
                    <p class="reputation-badge">⭐ ${parseFloat(match.userReputation || 0).toFixed(1)}</p>
                </div>
            </div>
            <div class="exchange-details">
                <div class="exchange-row">
                    <span><strong>You teach:</strong> ${skillMap[match.skillTheyNeed]}</span>
                </div>
                <div class="exchange-row">
                    <span><strong>You learn:</strong> ${skillMap[match.skillTheyOffer]}</span>
                </div>
            </div>
            <button class="btn-primary" onclick="openExchangeModal('${match.userId}', '${match.skillTheyNeed}', '${match.skillTheyOffer}', '${match.userName}', '${skillMap[match.skillTheyNeed]}', '${skillMap[match.skillTheyOffer]}')">
                Send Exchange Request
            </button>
        </div>
    `).join('');
}

function openExchangeModal(partnerId, skillGivenId, skillReceivedId, partnerName, skillGivenName, skillReceivedName) {
    const modal = document.getElementById('exchangeModal');
    const summary = document.getElementById('exchangeSummary');

    document.getElementById('partnerId').value = partnerId;
    document.getElementById('skillGivenId').value = skillGivenId;
    document.getElementById('skillReceivedId').value = skillReceivedId;

    summary.innerHTML = `
        <p><strong>Partner:</strong> ${partnerName}</p>
        <p><strong>You will teach:</strong> ${skillGivenName}</p>
        <p><strong>You will learn:</strong> ${skillReceivedName}</p>
    `;

    modal.classList.add('show');
}

const modal = document.getElementById('exchangeModal');
const closeBtn = modal.querySelector('.close');

closeBtn.onclick = function() {
    modal.classList.remove('show');
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.remove('show');
    }
};

const exchangeForm = document.getElementById('exchangeForm');
if (exchangeForm) {
    exchangeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const partnerId = document.getElementById('partnerId').value;
        const skillGivenId = document.getElementById('skillGivenId').value;
        const skillReceivedId = document.getElementById('skillReceivedId').value;
        const message = document.getElementById('message').value;

        try {
            await apiRequest(API_ENDPOINTS.EXCHANGES.BASE, {
                method: 'POST',
                body: JSON.stringify({
                    requesterId: userId,
                    partnerId,
                    skillGivenId,
                    skillReceivedId,
                    message
                })
            });

            modal.classList.remove('show');
            alert('Exchange request sent successfully!');
            exchangeForm.reset();
        } catch (error) {
            showError('modalError', error.message || 'Failed to send request');
        }
    });
}

loadMatches();
loadUserInfo();
