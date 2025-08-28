let currentQuestions = [];
let currentTitle = '';
let currentLang = 'english'; // 'english' or 'gujarati'
let currentPage = 1;
let originalQuestions = []; // Store original questions for search reset
let originalHomeContent = ''; // Store original homepage content
const questionsPerPage = 9; // Number of questions per page

function loadQuestions(type) {
    console.log("Loading questions for type:", type); // Debug log
    let data;
    if (type === "2MARKS") {
        console.log("2MARKS data:", window.data2MARKS); // Debug log
        data = window.data2MARKS;
    }
    else if (type === "3MARKS") data = window.data3MARKS;
    else if (type === "4MARKS") data = window.data4MARKS;

    // Guard: if the expected data object isn't present, show a clear message and log useful debug info.
    if (!data) {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `<div style="padding:20px;border:2px solid #f99;background:#fff6f6;color:#900">Data for <strong>${type}</strong> not found.<br/>Ensure the corresponding data file (e.g. data/data${type}.js) is included before <code>script.js</code> in index.html.</div>`;
        }
        console.error('Missing data for', type);
        const dataKeys = Object.keys(window).filter(k => /data/i.test(k));
        console.info('Available global keys matching /data/:', dataKeys);
        return;
    }

    currentQuestions = data.section.questions;
    originalQuestions = [...data.section.questions]; // Keep a copy of original questions
    currentTitle = data.section.title;
    currentPage = 1;
    renderCurrentPage();
    document.getElementById('searchInput').value = '';
}

function renderCurrentPage() {
    if (!currentQuestions || currentQuestions.length === 0) {
        document.getElementById("content").innerHTML = '<p>No questions available. Please select a category.</p>';
        return;
    }

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const pageQuestions = currentQuestions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);

    let html = `<h2>${currentTitle}</h2><div class='question-list'>`;

    pageQuestions.forEach(q => {
        html += `
            <div class="knowledge-card">
                <div class="card-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <h3 class="card-title">
                    <b>Q${q.question_number}</b>
                </h3>
                <p class="card-desc">
                    ${currentLang === 'english' ? q.question_english : q.question_gujarati}
                </p>
            </div>
        `;
    });

    html += `</div>`;

    // Only show pagination if there are multiple pages
    if (totalPages > 1) {
        html += `
            <div class="pagination" style="margin-top: 2rem; display: flex; justify-content: center; gap: 1rem;">
                ${currentPage > 1 ? `<button onclick="changePage(${currentPage - 1})" class="cta-btn prev-btn">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>` : ''}
                <span class="page-info" style="display: flex; align-items: center; font-weight: 500;">
                    Page ${currentPage} of ${totalPages}
                </span>
                ${currentPage < totalPages ? `<button onclick="changePage(${currentPage + 1})" class="cta-btn next-btn">
                    Next <i class="fas fa-chevron-right"></i>
                </button>` : ''}
            </div>
        `;
    }

    document.getElementById("content").innerHTML = html;
}

function changePage(newPage) {
    currentPage = newPage;
    renderCurrentPage();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function searchQuestions() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    // Reset to original questions if search is empty
    if (!query) {
        currentQuestions = [...originalQuestions];
    } else {
        currentQuestions = originalQuestions.filter(q =>
            (currentLang === 'english' ? q.question_english.toLowerCase() : q.question_gujarati.toLowerCase()).includes(query)
        );
    }
    
    currentPage = 1;
    renderCurrentPage();
}

// Call this after every language change and on page load
window.addEventListener('DOMContentLoaded', () => {
    // move initial main content into #content (so showHome can reuse it)
    const mainEl = document.querySelector('main');
    originalHomeContent = mainEl.innerHTML; // Store original homepage markup for reset
    
    // Set initial toggle state
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.checked = currentLang === 'english';
    }
});

function toggleLanguage() {
    currentLang = currentLang === 'english' ? 'gujarati' : 'english';
    renderCurrentPage();
}

// Show the homepage resource cards (replaces content with initial home cards)
function showHome() {
    document.getElementById('content').innerHTML = originalHomeContent;
}

// Show Part B PYQs using existing loaders
function showPartB() {
    // load 2MARKS by default (user can switch to 3/4 via buttons that will be shown)
    loadQuestions('2MARKS');
}

function loadContent(type) {
    const contentDiv = document.getElementById('content');
    let questionsData;
    
    // Match the data structure from our data files
    switch(type) {
        case 'important_questions_2mark.html':
            questionsData = window.data2MARKS.section.questions;
            break;
        case 'important_questions_3mark.html':
            questionsData = window.data3MARKS.section.questions;
            break;
        case 'important_questions_4mark.html':
            questionsData = window.data4MARKS.section.questions;
            break;
        default:
            return;
    }

    // Check if we got the data
    if (!questionsData) {
        console.error('No questions data found');
        return;
    }

    const questionsHTML = `
        <div class="questions-container">
            <h2 class="section-title">${type.includes('2mark') ? '2' : type.includes('3mark') ? '3' : '4'} Marks Questions</h2>
            <div class="questions-list">
                ${questionsData.map((q, index) => `
                    <div class="knowledge-card question-card">
                        <div class="question-number">Q${q.question_number}</div>
                        <div class="question-text">
                            <p class="english">${q.question_english}</p>
                            <p class="gujarati">${q.question_gujarati}</p>
                        </div>
                        <div class="card-meta">
                            <span class="marks-badge">${type.includes('2mark') ? '2' : type.includes('3mark') ? '3' : '4'} Marks</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    contentDiv.innerHTML = questionsHTML;

    // Reset search and update current questions for search functionality
    document.getElementById('searchInput').value = '';
    currentQuestions = questionsData;
    originalQuestions = [...questionsData];
}
