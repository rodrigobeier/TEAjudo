console.log("TEAjudo carregado!");
 
document.addEventListener("DOMContentLoaded", () => {
    // Sombra no cabeçalho ao rolar a página
    const header = document.querySelector(".header");
    if (header) {
        const atualizarHeader = () =>
            header.classList.toggle("rolado", window.scrollY > 10);
        atualizarHeader();
        window.addEventListener("scroll", atualizarHeader, { passive: true });
    }
 
    // Revelação suave dos blocos ao entrar na tela
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alvos = document.querySelectorAll(
        ".card, .info-card, .missao, .sobre-box, .cards-section h2, .info-page h1, .info-page .subtitle"
    );
 
    if (reduzirMovimento || !("IntersectionObserver" in window)) return;
 
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                    observador.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.12 }
    );
 
    alvos.forEach((el, i) => {
        el.classList.add("revelar");
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
        observador.observe(el);
    });
});
 