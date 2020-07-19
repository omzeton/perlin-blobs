const dataTargets = document.querySelectorAll('[data-letter-split]');

function r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Letter splitting
(function (links) {
  links.forEach(el => {
    el.innerHTML = [...el.innerText.split('')]
      .map(l => `<span class="inline">${l}</span>`)
      .join('');
    el.addEventListener('mouseenter', () =>
      [...el.childNodes].forEach((span, index) => {
        setTimeout(() => {
          span.style.transform = `translateY(100%)`;
        }, (50 * index) / 2);
      }),
    );
    el.addEventListener('mouseleave', () =>
      [...el.childNodes].forEach((span, index) => {
        setTimeout(() => {
          span.style.transform = `translateY(0)`;
        }, (50 * index) / 2);
      }),
    );
  });
})(dataTargets);
