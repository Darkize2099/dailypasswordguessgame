/**
 * P4SSW0RD: SYSTEM BREACH ENGINE v1.0.42
 */

// --- 1. GAME STATE ---
const target = getDailyPassword();
const inputField = document.getElementById('user-input');
const terminalLog = document.getElementById('terminal-log');
const scoreDisplay = document.getElementById('score-val');
const attemptDisplay = document.getElementById('attempt-val');
const encryptionStatus = document.getElementById('encryption-status');

let attempts = 0;
let score = 10000;
let isGameOver = false;
let guessHistory = [];
let permanentMask = Array(target.length).fill('_'); 

// --- 2. INITIALIZATION ---
const bootPhrases = [
    "INITIALIZING KERNEL...", "MOUNTING VIRTUAL DRIVES...", "ESTABLISHING CONNECTION...",
    "SPOOFING IP MAC...", "REROUTING PROXIES...", "BYPASSING FIREWALL...",
    "INJECTING PAYLOAD...", "FETCHING HASH...", "TARGET ACQUIRED.", "BOOT COMPLETE."
];

window.onload = () => { runBootSequence(); };

function runBootSequence() {
    const loadingScreen = document.getElementById('loading-screen');
    const bootLog = document.getElementById('boot-log');
    let delay = 0;
    bootPhrases.forEach((phrase, index) => {
        delay += Math.random() * 150 + 50; 
        setTimeout(() => {
            const line = document.createElement('div');
            line.innerText = `> ${phrase}`;
            bootLog.appendChild(line);
            if (index === bootPhrases.length - 1) {
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (!localStorage.getItem('returning_hacker')) {
                        openHelp();
                        localStorage.setItem('returning_hacker', 'true');
                    } else { inputField.focus(); }
                }, 600);
            }
        }, delay);
    });
}

// --- 3. UI CONTROLS ---
function openHelp() { document.getElementById('help-modal').style.display = 'flex'; }
function closeHelp() { document.getElementById('help-modal').style.display = 'none'; inputField.focus(); }
function appendToLog(text, className) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    terminalLog.appendChild(div);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}
function triggerGlitch() {
    const container = document.querySelector('.terminal-container');
    container.classList.add('glitch');
    setTimeout(() => container.classList.remove('glitch'), 200);
}

// --- 4. CORE ENGINE ---
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isGameOver) {
        const guess = inputField.value.trim().toUpperCase();
        if (guess.length > 0) { processGuess(guess); inputField.value = ''; }
    }
});

function processGuess(guess) {
    attempts++;
    guessHistory.push(guess);
    attemptDisplay.innerText = attempts;

    for (let i = 0; i < target.length; i++) {
        if (guess[i] === target[i]) { permanentMask[i] = target[i]; }
    }

    if (guess === target) { winGame(); return; }

    score -= 500;
    scoreDisplay.innerText = Math.max(0, score);
    appendToLog(`> ${guess}`, 'guess-entry');
    appendToLog(`[DENIED] ACCESS_VIOLATION`, 'denied');
    
    triggerGlitch();
    checkHints();
    updateEncryptionHeader(); 
}

function checkHints() {
    if (attempts === 3) {
        score -= 1000;
        appendToLog(`SYSTEM LEAK: PASSWORD LENGTH IS [ ${target.length} ]`, 'leak');
    }
    if (attempts === 5) {
        score -= 1500;
        const hasLetters = /[A-Z]/.test(target);
        const hasNumbers = /[0-9]/.test(target);
        const hasSymbols = /[^A-Z0-9]/.test(target);
        appendToLog(`SYSTEM LEAK: TYPE [ALPHA: ${hasLetters}] [NUMS: ${hasNumbers}] [SYMBOLS: ${hasSymbols}]`, 'leak');
    }
    if (attempts === 8) {
        score -= 2000;
        appendToLog(`CRITICAL LEAK: INJECTING AUDIT DATA...`, 'leak');
    }
    if (attempts >= 10 && attempts % 2 === 0) {
        revealActualCharacter();
    }

    if (attempts >= 8) {
        const lastGuess = guessHistory[guessHistory.length - 1];
        let feedback = [];
        for (let i = 0; i < target.length; i++) {
            if (permanentMask[i] !== '_') { feedback.push(permanentMask[i]); } 
            else if (lastGuess[i] === target[i]) { feedback.push(lastGuess[i]); }
            else if (target.includes(lastGuess[i])) { feedback.push(`(${lastGuess[i]})`); } 
            else { feedback.push("_"); }
        }
        appendToLog(`AUDIT_RESULT: [ ${feedback.join(' ')} ]`, 'system-msg');
    }
    scoreDisplay.innerText = Math.max(0, score);
}

function updateEncryptionHeader() {
    encryptionStatus.innerText = (attempts < 3) ? "UNKNOWN LENGTH" : permanentMask.join(' ');
}

function revealActualCharacter() {
    let hiddenIndices = [];
    for (let i = 0; i < target.length; i++) {
        if (permanentMask[i] === '_') hiddenIndices.push(i);
    }
    if (hiddenIndices.length > 0) {
        const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
        permanentMask[randomIndex] = target[randomIndex];
        score -= 1000;
        appendToLog(`SYSTEM FAILURE: RECOVERED_CHAR_AT_POS_${randomIndex + 1}: [ ${target[randomIndex]} ]`, 'leak');
    }
}

// --- 5. END GAME ---
function winGame() {
    isGameOver = true;
    inputField.disabled = true;
    permanentMask = target.split('');
    updateEncryptionHeader();
    appendToLog(`************************************`, 'system-msg');
    appendToLog(`ACCESS GRANTED. SYSTEM BREACHED.`, 'leak');
    appendToLog(`FINAL SCORE: ${score}`, 'system-msg');
    const report = generateShareText();
    document.getElementById('share-report').innerText = report;
    setTimeout(() => { document.getElementById('results-modal').style.display = 'flex'; }, 1000);
}

function generateShareText() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`;
    let report = `P4SSW0RD BREACH: ${dateStr}\nSCORE: ${score}\nATTEMPTS: ${attempts}\n\n`;
    guessHistory.forEach((g, i) => {
        report += `[ ${g.split('').map(() => "█").join("")} ] DENIED\n`;
    });
    report += `\n[ ${target} ] ACCESS_GRANTED`;
    return report;
}

function copyToClipboard() {
    const text = document.getElementById('share-report').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.innerText = "COPIED_TO_BUFFER";
        btn.style.background = "#fff";
    });
}