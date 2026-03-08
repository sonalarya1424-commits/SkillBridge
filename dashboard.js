if (!requireAuth()) {
    throw new Error('Not authenticated');
}

const userId = getUserId();

async function loadDashboard() {
    await loadUserInfo();
    await loadUserProfile();
    await loadUserSkills();
    await loadMatches();
    await loadExchanges();
}

async function loadUserProfile() {
    try {
        const user = await apiRequest(API_ENDPOINTS.USERS.BY_ID(userId));

        const reputationElement = document.getElementById('reputationScore');
        if (reputationElement) {
            reputationElement.textContent = parseFloat(user.reputationScore || 0).toFixed(1);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function loadUserSkills() {
    try {
        const skills = await apiRequest(API_ENDPOINTS.SKILLS.BASE);
        const userSkills = await apiRequest(API_ENDPOINTS.SKILLS.USER(userId));

        const skillMap = {};
        skills.forEach(skill => {
            skillMap[skill.id] = skill.skillName;
        });

        const offered = userSkills.filter(us => us.skillType === 'OFFER');
        const requested = userSkills.filter(us => us.skillType === 'REQUEST');

        displaySkills('offeredSkills', offered, skillMap);
        displaySkills('requestedSkills', requested, skillMap);
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function displaySkills(containerId, skills, skillMap) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (skills.length === 0) {
        container.innerHTML = '<p class="empty-state">No skills yet</p>';
        return;
    }

    container.innerHTML = skills.slice(0, 3).map(skill => `
        <div class="skill-item">
            <div>
                <h4>${skillMap[skill.skillId]}</h4>
                <span class="skill-level">${skill.proficiencyLevel}</span>
            </div>
        </div>
    `).join('');
}

async function loadMatches() {
    try {
        const matches = await apiRequest(API_ENDPOINTS.MATCHES.BY_USER(userId));
        const container = document.getElementById('matchesList');

        if (!container) return;

        if (matches.length === 0) {
            container.innerHTML = '<p class="empty-state">No matches found. Add skills to get matched!</p>';
            return;
        }

        const skills = await apiRequest(API_ENDPOINTS.SKILLS.BASE);
        const skillMap = {};
        skills.forEach(skill => {
            skillMap[skill.id] = skill.skillName;
        });

        container.innerHTML = matches.slice(0, 3).map(match => `
            <div class="match-card">
                <div class="match-info">
                    <h4>${match.userName}</h4>
                    <p>${match.userLocation || 'Location not specified'}</p>
                    <p>Reputation: ${parseFloat(match.userReputation || 0).toFixed(1)}</p>
                    <p><strong>They offer:</strong> ${skillMap[match.skillTheyOffer]}</p>
                    <p><strong>They need:</strong> ${skillMap[match.skillTheyNeed]}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

async function loadExchanges() {
    try {
        const exchanges = await apiRequest(API_ENDPOINTS.EXCHANGES.BY_USER(userId));
        const container = document.getElementById('exchangesList');

        if (!container) return;

        if (exchanges.length === 0) {
            container.innerHTML = '<p class="empty-state">No exchanges yet</p>';
            return;
        }

        container.innerHTML = exchanges.slice(0, 3).map(exchange => `
            <div class="exchange-card">
                <div class="exchange-header">
                    <span class="status-badge ${exchange.status}">${exchange.status}</span>
                    <span>${formatDate(exchange.createdAt)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading exchanges:', error);
    }
}

loadDashboard();
