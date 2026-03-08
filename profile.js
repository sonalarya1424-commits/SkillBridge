if (!requireAuth()) {
    throw new Error('Not authenticated');
}

const userId = getUserId();

async function loadProfile() {
    try {
        const user = await apiRequest(API_ENDPOINTS.USERS.BY_ID(userId));

        document.getElementById('displayName').textContent = user.name;
        document.getElementById('displayEmail').textContent = user.email;
        document.getElementById('displayLocation').textContent = user.location || 'Not specified';
        document.getElementById('displayBio').textContent = user.bio || 'Not specified';
        document.getElementById('displayReputation').textContent = parseFloat(user.reputationScore || 0).toFixed(1);
        document.getElementById('displayRatings').textContent = user.totalRatings || 0;

        document.getElementById('name').value = user.name;
        document.getElementById('location').value = user.location || '';
        document.getElementById('bio').value = user.bio || '';

        await loadRatings();
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadRatings() {
    try {
        const ratings = await apiRequest(API_ENDPOINTS.RATINGS.BY_USER(userId));
        const container = document.getElementById('ratingsContainer');

        if (!container) return;

        if (ratings.length === 0) {
            container.innerHTML = '<p class="empty-state">No ratings yet</p>';
            return;
        }

        const users = await apiRequest(API_ENDPOINTS.USERS.BASE);
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user.name;
        });

        container.innerHTML = ratings.map(rating => `
            <div class="rating-card">
                <div class="rating-stars">
                    ${'★'.repeat(rating.rating)}${'☆'.repeat(5 - rating.rating)}
                </div>
                <p><strong>From:</strong> ${userMap[rating.raterId] || 'Unknown'}</p>
                ${rating.review ? `<p class="rating-review">"${rating.review}"</p>` : ''}
                <p><small>${formatDate(rating.createdAt)}</small></p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading ratings:', error);
    }
}

const updateProfileForm = document.getElementById('updateProfileForm');
if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value;
        const bio = document.getElementById('bio').value;

        try {
            await apiRequest(API_ENDPOINTS.USERS.BY_ID(userId), {
                method: 'PUT',
                body: JSON.stringify({ name, location, bio })
            });

            localStorage.setItem('userName', name);
            showSuccess('successMessage', 'Profile updated successfully!');
            await loadProfile();
        } catch (error) {
            showError('errorMessage', error.message || 'Failed to update profile');
        }
    });
}

loadProfile();
loadUserInfo();
