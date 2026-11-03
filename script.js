// MASTER MD — Ultra Web Pairing Logic
// Developer: AHSAN (03107260507)

function normalizePhoneNumber(raw) {
    let n = String(raw || '').replace(/[^0-9]/g, '');
    if (n.startsWith('00')) n = n.slice(2);
    if (n.startsWith('920') && n.length === 13) n = '92' + n.slice(3);
    else if (n.startsWith('9203') && n.length >= 13) n = '92' + n.slice(3);
    else if (n.startsWith('03') && n.length === 11) n = '92' + n.slice(1);
    else if (n.startsWith('0') && n.length === 11) n = '92' + n.slice(1);
    else if (n.startsWith('3') && n.length === 10) n = '92' + n;
    else if (n.startsWith('910') && n.length === 13) n = '91' + n.slice(3);
    else if (n.startsWith('440') && n.length === 13) n = '44' + n.slice(3);
    else if (n.startsWith('620') && (n.length === 13 || n.length === 14)) n = '62' + n.slice(3);
    return n;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pairingForm');
    const phoneInput = document.getElementById('phoneNumber');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const prefixBtns = document.querySelectorAll('.btn-prefix');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = document.getElementById('btnSpinner');

    const codeCard = document.getElementById('codeCard');
    const pairingCodeEl = document.getElementById('pairingCode');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const copyIcon = document.getElementById('copyIcon');
    const timerText = document.getElementById('timerText');
    const timerBadge = document.getElementById('timerBadge');
    const statusMessage = document.getElementById('statusMessage');
    const successCard = document.getElementById('successCard');

    let countdownInterval = null;
    let pollInterval = null;
    let currentSessionId = null;

    // Synthetic audio chime on copy / success
    function playBeep(freq = 600, duration = 0.12) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {}
    }

    // Input sanitizer
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.startsWith('920') && val.length > 3) {
            val = '92' + val.slice(3);
        }
        e.target.value = val;
        clearInputBtn.style.display = val.length > 0 ? 'flex' : 'none';
    });

    clearInputBtn.addEventListener('click', () => {
        phoneInput.value = '';
        clearInputBtn.style.display = 'none';
        phoneInput.focus();
    });

    // Country prefix shortcuts
    prefixBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            prefixBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const prefix = btn.dataset.prefix;
            let current = phoneInput.value.replace(/[^0-9]/g, '');
            // If already starts with prefix or empty, replace prefix
            phoneInput.value = prefix;
            clearInputBtn.style.display = 'flex';
            phoneInput.focus();
        });
    });



    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let rawPhone = normalizePhoneNumber(phoneInput.value.trim());
        if (!rawPhone || rawPhone.length < 10 || rawPhone.length > 15) {
            alert('⚠️ Please enter a valid WhatsApp number with country code (10-15 digits).\n\nExample: 923107260507 or 923001234567');
            phoneInput.focus();
            return;
        }

        // Set UI loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Connecting WhatsApp Socket...';
        btnSpinner.style.display = 'inline-block';
        codeCard.style.display = 'none';
        successCard.style.display = 'none';

        if (countdownInterval) clearInterval(countdownInterval);
        if (pollInterval) clearInterval(pollInterval);

        try {
            const response = await fetch('/api/pair', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: rawPhone })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to generate WhatsApp pairing code.');
            }

            // Display formatted pairing code
            const rawCode = data.code || '';
            const formattedCode = rawCode.length === 8 ? `${rawCode.slice(0, 4)} - ${rawCode.slice(4)}` : rawCode;
            pairingCodeEl.textContent = formattedCode;
            currentSessionId = data.sessionId;

            // Reveal code card with smooth scroll
            codeCard.style.display = 'flex';
            codeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            statusMessage.textContent = 'Waiting for you to enter the code in WhatsApp...';

            playBeep(880, 0.15);

            // Start 120s countdown
            startTimer(120);

            // Start polling status
            startStatusPolling(data.sessionId);

        } catch (err) {
            alert(`❌ Pairing Error: ${err.message || 'Could not connect to pairing service.'}`);
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Generate Pairing Code';
            btnSpinner.style.display = 'none';
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        const codeToCopy = pairingCodeEl.textContent.replace(/[\s-]/g, '');
        if (!codeToCopy || codeToCopy === '--------') return;

        try {
            await navigator.clipboard.writeText(codeToCopy);
            copyText.textContent = 'Copied to Clipboard!';
            copyIcon.textContent = '✅';
            copyBtn.style.borderColor = 'var(--cyan-neon)';
            copyBtn.style.color = 'var(--cyan-neon)';
            playBeep(1200, 0.1);

            setTimeout(() => {
                copyText.textContent = 'Copy Pairing Code';
                copyIcon.textContent = '📋';
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 3000);
        } catch {
            const tempInput = document.createElement('input');
            tempInput.value = codeToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            copyText.textContent = 'Copied!';
            setTimeout(() => { copyText.textContent = 'Copy Pairing Code'; }, 2000);
        }
    });

    let isLoggingIn = false;

    // Countdown Timer (120s)
    function startTimer(durationSeconds) {
        let timeLeft = durationSeconds;
        isLoggingIn = false;
        timerText.textContent = `${timeLeft}s`;
        timerBadge.style.color = 'var(--amber-neon)';
        timerBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';

        countdownInterval = setInterval(() => {
            if (isLoggingIn) {
                timerText.textContent = 'Linking...';
                timerBadge.style.color = 'var(--cyan-neon)';
                timerBadge.style.borderColor = 'rgba(0, 242, 254, 0.45)';
                return;
            }

            timeLeft--;
            timerText.textContent = `${timeLeft}s`;

            if (timeLeft <= 25) {
                timerBadge.style.color = 'var(--red-neon)';
                timerBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                timerText.textContent = 'Expired';
                statusMessage.textContent = '⚠️ Code expired. Please click "Generate Pairing Code" to request a new code.';
            }
        }, 1000);
    }

    // Polling session status
    function startStatusPolling(sessionId) {
        if (!sessionId) return;

        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/status?id=${encodeURIComponent(sessionId)}`);
                if (!res.ok) return;

                const data = await res.json();
                if (data.code && (!pairingCodeEl.textContent || pairingCodeEl.textContent === '--------' || pairingCodeEl.textContent.trim() === '')) {
                    const rawCode = data.code;
                    pairingCodeEl.textContent = rawCode.length === 8 ? `${rawCode.slice(0, 4)} - ${rawCode.slice(4)}` : rawCode;
                    codeCard.style.display = 'flex';
                    playBeep(880, 0.15);
                }
                if (data.status === 'logging_in') {
                    isLoggingIn = true;
                    timerText.textContent = 'Linking...';
                    timerBadge.style.color = 'var(--cyan-neon)';
                    timerBadge.style.borderColor = 'rgba(0, 242, 254, 0.5)';
                    statusMessage.innerHTML = '🔄 <strong>Logging in...</strong> WhatsApp is linking your device. Please wait!';
                } else if (data.status === 'connected') {
                    clearInterval(pollInterval);
                    clearInterval(countdownInterval);

                    // Successful connection UI
                    codeCard.style.display = 'none';
                    successCard.style.display = 'flex';
                    successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                    playBeep(880, 0.1);
                    setTimeout(() => playBeep(1320, 0.25), 150);

                    triggerConfetti();
                } else if (data.status === 'error') {
                    statusMessage.textContent = `❌ ${data.message || 'Connection failed. Please retry.'}`;
                }
            } catch {}
        }, 2000);
    }

    // Festive Confetti Generator
    function triggerConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#00f2fe', '#4facfe', '#10b981', '#f59e0b', '#9333ea', '#ffffff'];

        for (let i = 0; i < 40; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'absolute';
            piece.style.width = `${Math.floor(Math.random() * 8 + 6)}px`;
            piece.style.height = `${Math.floor(Math.random() * 12 + 6)}px`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = '-10px';
            piece.style.opacity = '1';
            piece.style.borderRadius = '2px';
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
            piece.style.transition = `top ${Math.random() * 1.5 + 1.2}s ease-out, transform 2s ease-out, opacity 2s ease-out`;

            container.appendChild(piece);

            setTimeout(() => {
                piece.style.top = `${Math.random() * 200 + 100}px`;
                piece.style.transform = `rotate(${Math.random() * 720}deg)`;
                piece.style.opacity = '0';
            }, 50);
        }
    }
});
