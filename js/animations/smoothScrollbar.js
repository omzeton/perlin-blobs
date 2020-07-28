/**
 * Necessary HTML structure for this to work:
 * body > main > div[data-scroll] > content
 */
{
  const li = (a, b, n) => (1 - n) * a + n * b;
  const _EASE = 0.09;
  const theBody = document.body;
  const theMain = document.querySelector('main');
  const theScrollMover = theMain.querySelector('[data-scroll]');
  let thatPreviousScrollValue = 0;
  let thisCurrentScrollValue = 0;

  theBody.style.height = `${theScrollMover.scrollHeight}px`;
  theMain.style.position = 'fixed';
  theMain.style.width = theMain.style.height = '100%';

  window.addEventListener('scroll', () => (thisCurrentScrollValue = window.pageYOffset || document.documentElement.scrollTop));

  function animate() {
    thatPreviousScrollValue = li(thatPreviousScrollValue, thisCurrentScrollValue, _EASE);
    theScrollMover.style.transform = `translate3d(0, ${-1 * thatPreviousScrollValue}px, 0)`;
    requestAnimationFrame(animate);
  }

  animate();
}
