// Script sencillo para tu página
window.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer p');
  if (footer) {
    footer.textContent += ' JavaScript está funcionando.';
  }
});
