if (!requireAuth()) {
    throw new Error('Not authenticated');
}

const userId = getUserId();
let allSkills = [];
let userSkills = [];

async function loadSkills() {
    try {
        allSkills = await apiRequest(API_ENDPOINTS.SKILLS.BASE);
        userSkills = await apiRequest(API_ENDPOINTS.SKILLS.USER(userId));
        displayUserSkills();
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function displayUserSkills() {
    const skillMap = {};
    allSkills.forEach(skill => {
        skillMap[skill.id] = skill.skillName;
    });

    const offered = userSkills.filter(us => us.skillType === 'OFFER');
    const requested = userSkills.filter(us => us.skillType === 'REQUEST');

    displaySkillList('offeredSkills', offered, skillMap);
    displaySkillList('requestedSkills', requested, skillMap);
}

function displaySkillList(containerId, skills, skillMap) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (skills.length === 0) {
        container.innerHTML = '<p class="empty-state">No skills yet</p>';
        return;
    }

    container.innerHTML = skills.map(skill => `
        <div class="skill-tag">
            ${skillMap[skill.skillId]} (${skill.proficiencyLevel})
            <button onclick="removeSkill('${skill.skillId}', '${skill.skillType}')">×</button>
        </div>
    `).join('');
}

const addSkillForm = document.getElementById('addSkillForm');
if (addSkillForm) {
    addSkillForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const skillType = document.getElementById('skillType').value;
        const skillName = document.getElementById('skillName').value;
        const category = document.getElementById('category').value || 'General';
        const proficiency = document.getElementById('proficiency').value;
        const description = document.getElementById('description').value;

        try {
            let skill = allSkills.find(s => s.skillName.toLowerCase() === skillName.toLowerCase());

            if (!skill) {
                skill = await apiRequest(API_ENDPOINTS.SKILLS.BASE, {
                    method: 'POST',
                    body: JSON.stringify({ skillName, category })
                });
                allSkills.push(skill);
            }

            await apiRequest(API_ENDPOINTS.SKILLS.USER_SKILL, {
                method: 'POST',
                body: JSON.stringify({
                    userId,
                    skillId: skill.id,
                    skillType,
                    proficiencyLevel: proficiency,
                    description
                })
            });

            showSuccess('successMessage', 'Skill added successfully!');
            addSkillForm.reset();
            await loadSkills();
        } catch (error) {
            showError('errorMessage', error.message || 'Failed to add skill');
        }
    });
}

async function removeSkill(skillId, skillType) {
    if (!confirm('Are you sure you want to remove this skill?')) {
        return;
    }

    try {
        await apiRequest(API_ENDPOINTS.SKILLS.DELETE(userId, skillId, skillType), {
            method: 'DELETE'
        });

        await loadSkills();
    } catch (error) {
        console.error('Error removing skill:', error);
        alert('Failed to remove skill');
    }
}

loadSkills();
loadUserInfo();
