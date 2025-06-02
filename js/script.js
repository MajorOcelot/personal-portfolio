document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
    });
});

const sections = document.querySelectorAll('.scroll-section');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                link?.classList.add('active');
            }
        });
    },
    {
      root: null,
      threshold: 0.5, // Trigger when at least 50% of section is visible
    }
  );

    sections.forEach(section => {
        observer.observe(section);
});