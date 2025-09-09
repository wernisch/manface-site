window.addEventListener('load', () => {
    const blurredElements = document.querySelectorAll('.blur-to-clear');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
    });

    blurredElements.forEach(el => observer.observe(el));
});
