window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'true') {
        alert("✅ Your message has been sent successfully!");
    } else if (urlParams.get('sent') === 'false') {
        alert("❌ CAPTCHA failed. Please try again.");
    }
});
