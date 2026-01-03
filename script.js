const chaptersContainer = document.getElementById("chapters");
const quizContainer = document.getElementById("quiz");

// Automatically load Chapter 1 on startup
window.onload = () => {
    loadChapter(1);
};

async function loadChapter(num) {
    // Hide chapters container (though it will be empty now)
    chaptersContainer.style.display = "none";
    quizContainer.innerHTML = "<div class='not-available'>Loading Chapter 1...</div>";
    
    try {
        const res = await fetch(`data/chapter${num}.json`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        quizContainer.innerHTML = "";
        // Removed the "Back to Chapters" button since there are no other chapters
        renderQuiz(data);
        
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    } catch (err) {
        quizContainer.innerHTML = "";
        const errorMsg = document.createElement("div");
        errorMsg.className = "not-available";
        errorMsg.textContent = `Chapter ${num} not available`;
        quizContainer.appendChild(errorMsg);
    }
}

function renderQuiz(questions) {
    questions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "question";
        
        const optionsHtml = q.options.map(opt => `<button class="option-btn">${opt}</button>`).join("");
        
        const imageHtml = q.image ? `<img src="${q.image}" class="q-img" style="max-width:100%; height:auto; margin: 10px 0; display: block; border-radius: 4px;">` : "";

        div.innerHTML = `
            <h3>${i + 1}. ${q.question}</h3>
            ${imageHtml}
            <div class="options">${optionsHtml}</div>
        `;

        const buttons = div.querySelectorAll(".option-btn");
        buttons.forEach((btn, index) => {
            btn.onclick = () => {
                buttons.forEach((b, bIndex) => {
                    b.disabled = true;
                    if (bIndex === q.answer) {
                        b.style.background = "#16a34a";
                        b.style.color = "white";
                    }
                });

                if (index !== q.answer) {
                    btn.style.background = "#dc2626";
                    btn.style.color = "white";
                }
            };
        });

        quizContainer.appendChild(div);
    });
}