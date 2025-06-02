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

document.addEventListener('DOMContentLoaded', () => {
  // 🎥 MATRIX BACKGROUND SETUP
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initMatrix(); // reinitialize after resize
  });

  const letters = 'アァイィウヴエエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const fontSize = 16;
  let columns;
  let drops;

  function initMatrix() {
    columns = Math.floor(canvas.width / fontSize);
    // Only activate every 3rd column (sparser effect)
    drops = Array.from({ length: columns }).map((_, i) =>
      i % 3 === 0 ? canvas.height / fontSize + 10 : null
    );
  }

  initMatrix();

  function drawMatrix() {
    ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e0e0e0';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      if (drops[i] === null) continue;

      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  // ⏳ Slower frame rate (~12.5 FPS)
  const matrixInterval = setInterval(drawMatrix, 80);

  // 🖱️ "Click to Enter" logic
  const cover = document.getElementById('cover');
  cover.addEventListener('click', () => {
    clearInterval(matrixInterval);
    cover.style.transition = 'opacity 1s ease';
    cover.style.opacity = '0';
    setTimeout(() => {
      cover.style.display = 'none';
    }, 1000);
  });

  // 📌 SCROLL SPY for navigation
  const sections = document.querySelectorAll('.scroll-section');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          if (link) link.classList.add('active');
        }
      });
    },
    { root: null, threshold: 0.5 }
  );

  sections.forEach(section => observer.observe(section));
});