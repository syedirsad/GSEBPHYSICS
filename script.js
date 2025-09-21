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
        document.getElementById("content").innerHTML = `
            <div class="no-questions" data-aos="fade-up">
                <div class="no-questions-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No questions found</h3>
                <p>Please select a category or try a different search term.</p>
            </div>
        `;
        return;
    }

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const pageQuestions = currentQuestions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);

    let html = `
        <div class="questions-container">
            <h2 class="section-title" data-aos="fade-down">${currentTitle}</h2>
            <div class="question-list">
    `;

    pageQuestions.forEach((q, index) => {
        html += `
            <div class="knowledge-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <h3 class="card-title">
                    <b>Q${q.question_number}</b>
                </h3>
                <p class="card-desc">
                    ${currentLang === 'english' ? q.question_english : q.question_gujarati}
                </p>
                <div class="question-meta">
                    <span class="marks-badge">${currentTitle.includes('2') ? '2' : currentTitle.includes('3') ? '3' : '4'} Marks</span>
                </div>
            </div>
        `;
    });

    html += `</div></div>`;

    // Only show pagination if there are multiple pages
    if (totalPages > 1) {
        html += `
            <div class="pagination" data-aos="fade-up" data-aos-delay="600">
                ${currentPage > 1 ? `<button onclick="changePage(${currentPage - 1})" class="prev-btn">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>` : ''}
                <span class="page-info">
                    Page ${currentPage} of ${totalPages}
                </span>
                ${currentPage < totalPages ? `<button onclick="changePage(${currentPage + 1})" class="next-btn">
                    Next <i class="fas fa-chevron-right"></i>
                </button>` : ''}
            </div>
        `;
    }

    document.getElementById("content").innerHTML = html;

    // Reinitialize AOS for new content
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
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

    // Reinitialize AOS for home content
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Show Part B PYQs using existing loaders
function showPartB() {
    // load 2MARKS by default (user can switch to 3/4 via buttons that will be shown)
    loadQuestions('2MARKS');
}

// Show Materials Section - SIMPLIFIED APPROACH
function showMaterials(type) {
    const contentDiv = document.getElementById('content');

    if (type === 'ncert') {
        // Simple NCERT materials display
        contentDiv.innerHTML = `
            <div class="materials-container">
                <div class="category-header">
                    <h2 class="category-title">NCERT Materials</h2>
                    <p class="category-description">Complete NCERT Physics materials available online</p>
                </div>
                <div class="materials-grid">
                    <div class="material-card">
                        <div class="material-header">
                            <div class="material-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="material-info">
                                <h3>Class 11 Physics Notes</h3>
                                <p>Class 11 - English Medium</p>
                            </div>
                        </div>
                        <div class="material-meta">
                            <span class="material-type">notes</span>
                            <span class="material-size">PDF Document</span>
                        </div>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Complete NCERT Physics notes for Class 11 in English</p>
                        <a href="https://drive.google.com/file/d/1WPOkeP2wPr3_0ry7ZhWV4Tq1isNDd49q/view?usp=drive_link" target="_blank" class="download-btn">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View PDF</span>
                        </a>
                    </div>
                    <div class="material-card">
                        <div class="material-header">
                            <div class="material-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="material-info">
                                <h3>Class 12 Physics Notes</h3>
                                <p>Class 12 - English Medium</p>
                            </div>
                        </div>
                        <div class="material-meta">
                            <span class="material-type">notes</span>
                            <span class="material-size">PDF Document</span>
                        </div>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Complete NCERT Physics notes for Class 12 in English</p>
                        <a href="https://drive.google.com/file/d/153cLBKyh8a7sVxJmSEfyyEj9ZiW0b3Wz/view?usp=drive_link" target="_blank" class="download-btn">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View PDF</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'neet') {
        // Simple NEET category cards
        contentDiv.innerHTML = `
            <div class="materials-container">
                <div class="category-header">
                    <h2 class="category-title">NEET Materials</h2>
                    <p class="category-description">Choose your class and medium</p>
                </div>
                <div class="category-cards-grid">
                    <div class="category-card" onclick="showClass11English()">
                        <div class="category-card-header">
                            <div class="category-card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="category-card-badge">14 PDFs</div>
                        </div>
                        <div class="category-card-content">
                            <h3 class="category-card-title">Class 11 English</h3>
                            <p class="category-card-description">NEET Physics materials for Class 11 in English Medium</p>
                        </div>
                        <div class="category-card-footer">
                            <button class="category-btn">
                                <span>View Materials</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="category-card" onclick="showClass12English()">
                        <div class="category-card-header">
                            <div class="category-card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="category-card-badge">14 PDFs</div>
                        </div>
                        <div class="category-card-content">
                            <h3 class="category-card-title">Class 12 English</h3>
                            <p class="category-card-description">NEET Physics materials for Class 12 in English Medium</p>
                        </div>
                        <div class="category-card-footer">
                            <button class="category-btn">
                                <span>View Materials</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="category-card" onclick="showClass11Gujarati()">
                        <div class="category-card-header">
                            <div class="category-card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                <i class="fas fa-language"></i>
                            </div>
                            <div class="category-card-badge">14 PDFs</div>
                        </div>
                        <div class="category-card-content">
                            <h3 class="category-card-title">Class 11 ગુજરાતી</h3>
                            <p class="category-card-description">NEET Physics materials for Class 11 in Gujarati Medium</p>
                        </div>
                        <div class="category-card-footer">
                            <button class="category-btn">
                                <span>View Materials</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="category-card" onclick="showClass12Gujarati()">
                        <div class="category-card-header">
                            <div class="category-card-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                                <i class="fas fa-atom"></i>
                            </div>
                            <div class="category-card-badge">14 PDFs</div>
                        </div>
                        <div class="category-card-content">
                            <h3 class="category-card-title">Class 12 ગુજરાતી</h3>
                            <p class="category-card-description">NEET Physics materials for Class 12 in Gujarati Medium</p>
                        </div>
                        <div class="category-card-footer">
                            <button class="category-btn">
                                <span>View Materials</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// SIMPLE DIRECT FUNCTIONS - NO COMPLEX DATA MATCHING

function showClass11English() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="materials-container">
            <div class="category-header">
                <button onclick="showMaterials('neet')" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Categories</span>
                </button>
                <h2 class="category-title">Class 11 NEET Materials - English Medium</h2>
                <p class="category-description">14 PDF materials available online</p>
            </div>
            <div class="materials-grid">
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-calculator"></i></div>
                        <div class="material-info">
                            <h3>Basic Mathematics in Physics</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Foundation mathematics for physics</p>
                    <a href="https://drive.google.com/file/d/1eABCx_iEGO3b8iK49t69RGAYRikaBw2p/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-ruler"></i></div>
                        <div class="material-info">
                            <h3>Physical World, Units and Measurements</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 1 & 2 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1Y_82nd5PJt0YBBilRRu4oK9GPwTQ3FY5/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-arrows-alt-h"></i></div>
                        <div class="material-info">
                            <h3>Motion in a Straight Line</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 3 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/11pjPgl6QpOClxSYBJprha-4mMEPVV0a8/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-vector-square"></i></div>
                        <div class="material-info">
                            <h3>Vectors & Motion in a Plane - Part 1</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 4 - NEET Physics (Part 1)</p>
                    <a href="https://drive.google.com/file/d/1-sNuXmX5PHQ2fHxTiABG-EVRXprTT1m7/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-vector-square"></i></div>
                        <div class="material-info">
                            <h3>Vectors & Motion in a Plane - Part 2</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 4 - NEET Physics (Part 2)</p>
                    <a href="pdfs/neet/CLASS 11 NEET MATERIAL EM/04-Vectors & Motion in a Plane-2-F.pdf" download class="download-btn">
                        <i class="fas fa-download"></i>
                        <span>Download PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-balance-scale"></i></div>
                        <div class="material-info">
                            <h3>Laws of Motion</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 5 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1IhmwJ8q0IKTzJkw-uH_fmX4cZ7v-V1Ki/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-bolt"></i></div>
                        <div class="material-info">
                            <h3>Work, Power and Energy</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 6 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1tn16t90hCS9FnUgurGMKDpvV4ljFzZ0B/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-sync-alt"></i></div>
                        <div class="material-info">
                            <h3>System of Particles & Rotational Dynamics</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 7 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1ermgfna4dpVBdUTiGzwfGdGHPB8utCl9/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-globe"></i></div>
                        <div class="material-info">
                            <h3>Gravitation</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 8 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/13sGU2MENKQiHHYCrhok0nogyN4ojG4S9/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-cube"></i></div>
                        <div class="material-info">
                            <h3>Mechanical Properties of Solids</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 9 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1C00rvggK1EdTy4YlgXYj0y9F5NOpTNZD/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-tint"></i></div>
                        <div class="material-info">
                            <h3>Mechanical Properties of Fluids</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 10 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1bXRwRwyJx-rLFe4ZDukAUfLPKlvBGUYy/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-thermometer-half"></i></div>
                        <div class="material-info">
                            <h3>Thermal Properties of Matter</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 11 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/13GL70nN1drRjPubsSDEhG9ML-P7qmjOM/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-fire"></i></div>
                        <div class="material-info">
                            <h3>Thermodynamics</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 12 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1UIEgDUxqolE0cGJZx36RJAly04JxeRK1/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-wind"></i></div>
                        <div class="material-info">
                            <h3>Kinetic Theory of Gases</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 13 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/1i-Pmepc9zWgv713wMlU5T-L8zt4qj7Vl/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-wave-square"></i></div>
                        <div class="material-info">
                            <h3>Oscillations</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 14 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/101vgm-Exi1D2nxLALg5irzr4WY4zrrwa/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-water"></i></div>
                        <div class="material-info">
                            <h3>Waves</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 15 - NEET Physics</p>
                    <a href="https://drive.google.com/file/d/16HcpNPR7DiDPxEyb5FgidWSSqAmHj-HJ/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-bookmark"></i></div>
                        <div class="material-info">
                            <h3>Motion in a Plane - Smart Booklet</h3>
                            <p>Class 11 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">smart-booklet</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Quick reference guide for Motion in a Plane</p>
                    <a href="pdfs/neet/CLASS 11 NEET MATERIAL EM/4.Motion in a Plane_Smart Booklet.pdf" download class="download-btn">
                        <i class="fas fa-download"></i>
                        <span>Download PDF</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function showClass12English() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="materials-container">
            <div class="category-header">
                <button onclick="showMaterials('neet')" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Categories</span>
                </button>
                <h2 class="category-title">Class 12 NEET Materials - English Medium</h2>
                <p class="category-description">14 PDF materials available online</p>
            </div>
            <div class="materials-grid">
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-bolt"></i></div>
                        <div class="material-info">
                            <h3>Electric Charge and Fields</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 1 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1nPP_4b39RQhjQSoXNfenwnS1PZ32PpMN/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-battery-three-quarters"></i></div>
                        <div class="material-info">
                            <h3>Electrostatic Potential and Capacitance</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 2 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1O33BZBIA7KwDy4sNdwHAwg4JpRYfU-Oe/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-plug"></i></div>
                        <div class="material-info">
                            <h3>Current Electricity</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 3 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/14NdIUtinf6baV8Hx9Eb1NoxDUUF2GHIp/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-magnet"></i></div>
                        <div class="material-info">
                            <h3>Moving Charges and Magnetism</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 4 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1QflQo_9kMXb4T8H8yHHZhM9Iyaj6HaLm/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-compass"></i></div>
                        <div class="material-info">
                            <h3>Magnetism and Matter</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 5 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1zOXOlKqdpzRNVJn3wnUHhU6Euo-gWs_p/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-coil"></i></div>
                        <div class="material-info">
                            <h3>Electromagnetic Induction</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 6 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1uy_29ZWZJasjVwDormYYPIH05Nq_IERQ/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-wave-square"></i></div>
                        <div class="material-info">
                            <h3>Alternating Current</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 7 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1entnjjqzTB-m3iF8BbpdmxtPZe_34msB/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-broadcast-tower"></i></div>
                        <div class="material-info">
                            <h3>Electromagnetic Waves</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 8 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/192zReSTxnWp-EOlW8Nq_p91xMGv21FuR/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-eye"></i></div>
                        <div class="material-info">
                            <h3>Ray Optics</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 9 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/18EWbQagCXD9VBflQ_ftVzsEufw2LWoi5/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-prism"></i></div>
                        <div class="material-info">
                            <h3>Wave Optics</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 10 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/14RCcMGy2br-M48itp4tTwqGMupvfaOyU/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-atom"></i></div>
                        <div class="material-info">
                            <h3>Dual Nature of Radiation and Matter</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 11 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1HyXlAho3wEwjiLkVdPQ7I9ZRWQKIdiBc/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-circle-notch"></i></div>
                        <div class="material-info">
                            <h3>Atoms</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 12 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1GORe1drh23TvApJWT_blgAtF7PQdMZvc/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-radiation"></i></div>
                        <div class="material-info">
                            <h3>Nuclei</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 13 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1I60ZAuA7y_gOZE1ArvII5abntv7JuH8T/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-microchip"></i></div>
                        <div class="material-info">
                            <h3>Semiconductor Electronics</h3>
                            <p>Class 12 NEET - English Medium</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Chapter 14 - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1yHlDAjGj_AXaSyOz0Gj3N1y3GBVVk4S-/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function showClass11Gujarati() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="materials-container">
            <div class="category-header">
                <button onclick="showMaterials('neet')" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Categories</span>
                </button>
                <h2 class="category-title">Class 11 NEET Materials - ગુજરાતી માધ્યમ</h2>
                <p class="category-description">14 PDF materials available online</p>
            </div>
            <div class="materials-grid">
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-globe-asia"></i></div>
                        <div class="material-info">
                            <h3>Chapter 1 - Physical World (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ભૌતિક જગત - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1bhHk9Ux1whGkUm-HQzpnXX4SdiRqhMeW/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-ruler"></i></div>
                        <div class="material-info">
                            <h3>Chapter 2 - Units and Measurements (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">એકમો અને માપન - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1fMVKtvpfYfgGG5XS0VvY6USruzAZeqbM/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-arrows-alt-h"></i></div>
                        <div class="material-info">
                            <h3>Chapter 3 - Motion in a Straight Line (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">સુરેખ પથ પર ગતિ - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1q3MIXWp3ial09uy6D5nBD0yJrHLWgcAM/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-vector-square"></i></div>
                        <div class="material-info">
                            <h3>Chapter 4 - Motion in a Plane (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">સમતલમાં ગતિ - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1sWw4LEnM31MDmgq0t7v0epxrNeZh93cc/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-balance-scale"></i></div>
                        <div class="material-info">
                            <h3>Chapter 5 - Laws of Motion (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ગતિના નિયમો - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1cLPBL91wddo1GpkoWrjyDac4KMw9mnJP/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-bolt"></i></div>
                        <div class="material-info">
                            <h3>Chapter 6 - Work, Energy and Power (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">કાર્ય, ઊર્જા અને પાવર - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1TJPonf0D0vV0-xhBnhy6iWRbqfr3j_Ua/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-sync-alt"></i></div>
                        <div class="material-info">
                            <h3>Chapter 7 - System of Particles (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">કણોની પ્રણાલી - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1kF0Ou7YzXAsUtWSnt2YbjEFYxeFL9Asm/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-globe"></i></div>
                        <div class="material-info">
                            <h3>Chapter 8 - Gravitation (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ગુરુત્વાકર્ષણ - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/12ONei7DNd3RT1Yth8Dfh-J7lal5UsZyq/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-cube"></i></div>
                        <div class="material-info">
                            <h3>Chapter 9 - Mechanical Properties of Solids (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ઘન પદાર્થોના યાંત્રિક ગુણધર્મો - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/113XxqK-2J7QUPjxskZUumlJb4ef5fTdA/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-tint"></i></div>
                        <div class="material-info">
                            <h3>Chapter 10 - Mechanical Properties of Fluids (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">પ્રવાહીના યાંત્રિક ગુણધર્મો - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1cJK7kUpspm4fpMAAEn8Uyp0odjAbujie/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-thermometer-half"></i></div>
                        <div class="material-info">
                            <h3>Chapter 11 - Thermal Properties of Matter (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">પદાર્થના ઉષ્મીય ગુણધર્મો - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1hNZWvkKDeu2pW663Whc2fj3azjkW6rAZ/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-fire"></i></div>
                        <div class="material-info">
                            <h3>Chapter 12 - Thermodynamics (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ઉષ્માગતિકી - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1ZPkXPOSdJoKym9UEdYxCZot-9BMxaQaS/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-wind"></i></div>
                        <div class="material-info">
                            <h3>Chapter 13 - Kinetic Theory (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ગતિક સિદ્ધાંત - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1hvhFYhSciCQO1vAh9XlJ0CwGGLJqy6In/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-wave-square"></i></div>
                        <div class="material-info">
                            <h3>Chapter 14 - Oscillations (ગુજરાતી)</h3>
                            <p>Class 11 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">દોલનો - NEET Physics Class 11</p>
                    <a href="https://drive.google.com/file/d/1AltqevWGvE9KfJjKEJ_o0dHz_c3lN9vD/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function showClass12Gujarati() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="materials-container">
            <div class="category-header">
                <button onclick="showMaterials('neet')" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to Categories</span>
                </button>
                <h2 class="category-title">Class 12 NEET Materials - ગુજરાતી માધ્યમ</h2>
                <p class="category-description">14 PDF materials available online</p>
            </div>
            <div class="materials-grid">
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-bolt"></i></div>
                        <div class="material-info">
                            <h3>Chapter 1 - Electric Charges and Fields (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">વિદ્યુતભારો અને ક્ષેત્રો - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1dUFcuzf9oTYxdZTzu0NXNvYjKJvWT6y5/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-battery-three-quarters"></i></div>
                        <div class="material-info">
                            <h3>Chapter 2 - Electrostatic Potential (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">સ્થિતવિદ્યુતસ્થિતિમાન - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1LpCCcCY5kg7APT0uJ530x9s4vveeHaE7/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-plug"></i></div>
                        <div class="material-info">
                            <h3>Chapter 3 - Current Electricity (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">વિદ્યુતપ્રવાહ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1RN5K1aehrNupffk4LF44CCuKX1FPBsxu/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-magnet"></i></div>
                        <div class="material-info">
                            <h3>Chapter 4 - Moving Charges and Magnetism (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ગતિમાન વિદ્યુતભાર અને ચુંબકત્વ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/12JR9YytSIWfPw6wWhrCRtiuSAuqdgmUo/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-compass"></i></div>
                        <div class="material-info">
                            <h3>Chapter 5 - Magnetism and Matter (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ચુંબકત્વ અને પદાર્થ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1rEpHMD4dNQOlfAmMy6ILiUJAPa9JO5XP/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-coil"></i></div>
                        <div class="material-info">
                            <h3>Chapter 6 - Electromagnetic Induction (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">વિદ્યુતચુંબકીય પ્રેરણ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1qGPpsCdbW5HkCXAQOa-EAMv5a0gJU-hq/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-wave-square"></i></div>
                        <div class="material-info">
                            <h3>Chapter 7 - Alternating Current (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">પ્રત્યાવર્તી પ્રવાહ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/10xQCB8Wi8r-WskwltazkzAXLehWMVXyj/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-broadcast-tower"></i></div>
                        <div class="material-info">
                            <h3>Chapter 8 - Electromagnetic Waves (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">વિદ્યુતચુંબકીય તરંગો - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1qeff-H4d6lWmfajrUcxJHcn6t_C6N_Dj/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-eye"></i></div>
                        <div class="material-info">
                            <h3>Chapter 9 - Ray Optics (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">કિરણ પ્રકાશશાસ્ત્ર - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1uGqaR73edrTn7HnE8L0not3cPYIQAVVj/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-prism"></i></div>
                        <div class="material-info">
                            <h3>Chapter 10 - Wave Optics (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">તરંગ પ્રકાશશાસ્ત્ર - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1du0dGEfejZIK2-Yj0DAWJZ_3mQY7htLL/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-atom"></i></div>
                        <div class="material-info">
                            <h3>Chapter 11 - Dual Nature of Radiation (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">કિરણોત્સર્ગ અને પદાર્થની દ્વિ પ્રકૃતિ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1IHcyfpg7KoRzwwXeVQl6kMchsd3UzWFD/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-circle-notch"></i></div>
                        <div class="material-info">
                            <h3>Chapter 12 - Atoms (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">પરમાણુ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1ieWkkN3iYHwA3OHv8kcOfOAVcgceuq7D/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-radiation"></i></div>
                        <div class="material-info">
                            <h3>Chapter 13 - Nuclei (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">ન્યુક્લિયસ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/141vp7Id9UTmzWHKyC1WWpJbttu_4KxvO/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
                
                <div class="material-card">
                    <div class="material-header">
                        <div class="material-icon"><i class="fas fa-microchip"></i></div>
                        <div class="material-info">
                            <h3>Chapter 14 - Semiconductor Electronics (ગુજરાતી)</h3>
                            <p>Class 12 NEET - ગુજરાતી માધ્યમ</p>
                        </div>
                    </div>
                    <div class="material-meta">
                        <span class="material-type">neet-material</span>
                        <span class="material-size">PDF Document</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">અર્ધવાહક ઇલેક્ટ્રોનિક્સ - NEET Physics Class 12</p>
                    <a href="https://drive.google.com/file/d/1Bm1Xi3d9ebjmEXz_LRAkt3gXOGF7vm6n/view?usp=drive_web" target="_blank" class="download-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>View PDF</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}