// MASTER MD — Web Pairing Portal Logic
// Developer: AHSAN

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pairingForm');
    const phoneInput = document.getElementById('phoneNumber');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = document.getElementById('btnSpinner');

    const codeContainer = document.getElementById('codeContainer');
    const pairingCodeEl = document.getElementById('pairingCode');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const copyIcon = document.getElementById('copyIcon');
    const timerText = document.getElementById('timerText');
    const statusMessage = document.getElementById('statusMessage');
    const successBox = document.getElementById('successBox');

    let countdownInterval = null;
    let pollInterval = null;
    let currentSessionId = null;

    // Sanitize phone input
    phoneInput.addEventListener('input', (e) => {
        // Strip non-digits
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    // Handle form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const rawPhone = phoneInput.value.trim().replace(/[^0-9]/g, '');
        if (!rawPhone || rawPhone.length < 10 || rawPhone.length > 15) {
            alert('⚠️ Please enter a valid phone number with country code (10-15 digits).\nExample: 923001234567');
            phoneInput.focus();
            return;
        }

        // Set Loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Generating Code...';
        btnSpinner.style.display = 'inline-block';
        codeContainer.style.display = 'none';
        successBox.style.display = 'none';

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
                throw new Error(data.message || 'Failed to request pairing code.');
            }

            // Display pairing code
            const rawCode = data.code || '';
            const formattedCode = rawCode.length === 8 ? `${rawCode.slice(0, 4)} - ${rawCode.slice(4)}` : rawCode;
            pairingCodeEl.textContent = formattedCode;
            currentSessionId = data.sessionId;

            // Reveal container
            codeContainer.style.display = 'flex';
            statusMessage.textContent = 'Waiting for you to enter the code in WhatsApp...';

            // Start 60s countdown
            startTimer(60);

            // Start polling status
            startStatusPolling(data.sessionId);

        } catch (err) {
            alert(`❌ Error: ${err.message || 'Unable to connect to pairing service.'}`);
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
            copyBtn.style.borderColor = 'var(--primary-cyan)';
            copyBtn.style.color = 'var(--primary-cyan)';

            setTimeout(() => {
                copyText.textContent = 'Copy Pairing Code';
                copyIcon.textContent = '📋';
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 3000);
        } catch (err) {
            alert(`Pairing Code: ${codeToCopy}`);
        }
    });

    // Timer helper
    function startTimer(seconds) {
        if (countdownInterval) clearInterval(countdownInterval);
        let timeLeft = seconds;
        timerText.textContent = `${timeLeft}s`;

        countdownInterval = setInterval(() => {
            timeLeft--;
            timerText.textContent = `${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                timerText.textContent = 'Expired';
                statusMessage.textContent = '⚠️ Code expired. Please generate a new code.';
            }
        }, 1000);
    }

    // Polling helper
    function startStatusPolling(sessionId) {
        if (pollInterval) clearInterval(pollInterval);
        if (!sessionId) return;

        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/status?id=${sessionId}`);
                const data = await res.json();

                if (data.status === 'connected') {
                    clearInterval(pollInterval);
                    if (countdownInterval) clearInterval(countdownInterval);

                    codeContainer.style.display = 'none';
                    successBox.style.display = 'flex';
                } else if (data.status === 'error') {
                    clearInterval(pollInterval);
                    statusMessage.textContent = `❌ ${data.message || 'Pairing error'}`;
                }
            } catch (e) {
                // Ignore transient network polling errors
            }
        }, 3000);
    }
});
