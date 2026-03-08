if (!requireAuth()) {
    throw new Error('Not authenticated');
}

const userId = getUserId();
let allExchanges = [];
let allUsers = [];
let allSkills = [];
let currentFilter = 'all';

async function loadExchanges() {
    try {
        allExchanges = await apiRequest(API_ENDPOINTS.EXCHANGES.BY_USER(userId));
        allUsers = await apiRequest(API_ENDPOINTS.USERS.BASE);
        allSkills = await apiRequest(API_ENDPOINTS.SKILLS.BASE);
        displayExchanges();
    } catch (error) {
        console.error('Error loading exchanges:', error);
    }
}

function displayExchanges() {
    const container = document.getElementById('exchangesContainer');
    if (!container) return;

    const userMap = {};
    allUsers.forEach(user => {
        userMap[user.id] = user.name;
    });

    const skillMap = {};
    allSkills.forEach(skill => {
        skillMap[skill.id] = skill.skillName;
    });

    let filtered = allExchanges;
    if (currentFilter !== 'all') {
        filtered = allExchanges.filter(ex => ex.status === currentFilter);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-state">No exchanges found</p>';
        return;
    }

    container.innerHTML = filtered.map(exchange => {
        const isRequester = exchange.requesterId === userId;
        const partnerId = isRequester ? exchange.partnerId : exchange.requesterId;
        const partnerName = userMap[partnerId] || 'Unknown';

        return `
            <div class="exchange-card">
                <div class="exchange-header">
                    <div>
                        <h4>${isRequester ? 'Request to' : 'Request from'} ${partnerName}</h4>
                        <p>${formatDate(exchange.createdAt)}</p>
                    </div>
                    <span class="status-badge ${exchange.status}">${exchange.status}</span>
                </div>
                <div class="exchange-details">
                    <p><strong>You teach:</strong> ${skillMap[exchange.skillGivenId]}</p>
                    <p><strong>You learn:</strong> ${skillMap[exchange.skillReceivedId]}</p>
                    ${exchange.message ? `<p><strong>Message:</strong> ${exchange.message}</p>` : ''}
                </div>
                <div class="exchange-actions">
                    ${!isRequester && exchange.status === 'PENDING' ? `
                        <button class="btn-primary btn-small" onclick="updateExchangeStatus('${exchange.id}', 'ACCEPTED')">Accept</button>
                        <button class="btn-secondary btn-small" onclick="updateExchangeStatus('${exchange.id}', 'REJECTED')">Reject</button>
                    ` : ''}
                    ${exchange.status === 'ACCEPTED' ? `
                        <button class="btn-primary btn-small" onclick="updateExchangeStatus('${exchange.id}', 'COMPLETED')">Mark as Completed</button>
                    ` : ''}
                    ${exchange.status === 'COMPLETED' ? `
                        <button class="btn-primary btn-small" onclick="openRatingModal('${exchange.id}', '${partnerId}')">Rate Exchange</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function updateExchangeStatus(exchangeId, status) {
    try {
        await apiRequest(API_ENDPOINTS.EXCHANGES.UPDATE_STATUS(exchangeId), {
            method: 'PUT',
            body: JSON.stringify({ status })
        });

        await loadExchanges();
    } catch (error) {
        console.error('Error updating exchange:', error);
        alert('Failed to update exchange status');
    }
}

function openRatingModal(exchangeId, ratedUserId) {
    const modal = document.getElementById('ratingModal');
    document.getElementById('exchangeId').value = exchangeId;
    document.getElementById('ratedUserId').value = ratedUserId;
    modal.classList.add('show');
}

const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.tab;
        displayExchanges();
    });
});

const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        ratingInput.value = rating;
        stars.forEach(s => {
            if (s.dataset.rating <= rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

const modal = document.getElementById('ratingModal');
const closeBtn = modal.querySelector('.close');

closeBtn.onclick = function() {
    modal.classList.remove('show');
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.remove('show');
    }
};

const ratingForm = document.getElementById('ratingForm');
if (ratingForm) {
    ratingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const exchangeId = document.getElementById('exchangeId').value;
        const ratedUserId = document.getElementById('ratedUserId').value;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        if (!rating) {
            showError('modalError', 'Please select a rating');
            return;
        }

        try {
            await apiRequest(API_ENDPOINTS.RATINGS.BASE, {
                method: 'POST',
                body: JSON.stringify({
                    exchangeId,
                    raterId: userId,
                    ratedId: ratedUserId,
                    rating,
                    review
                })
            });

            modal.classList.remove('show');
            alert('Rating submitted successfully!');
            ratingForm.reset();
            stars.forEach(s => s.classList.remove('active'));
        } catch (error) {
            showError('modalError', error.message || 'Failed to submit rating');
        }
    });
}

loadExchanges();
loadUserInfo();
