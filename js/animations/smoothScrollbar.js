const MathUtils = {
  // map number x from range [a, b] to [c, d]
  map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
  // linear interpolation
  lerp: (a, b, n) => (1 - n) * a + n * b,
};

const body = document.body;
let winsize, docScroll;

const calcWinSize = () =>
  (winsize = { width: window.innerWidth, height: window.innerHeight });
const getPageYScroll = () =>
  (docScroll = window.pageYOffset || document.documentElement.scrollTop);

calcWinSize();
getPageYScroll();

window.addEventListener('resize', calcWinSize);
window.addEventListener('scroll', getPageYScroll);

class SmoothScroll {
  constructor() {
    this.DOM = { main: document.querySelector('main') };
    this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
    this.renderedStyles = {
      translationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        setValue: () => docScroll,
      },
    };
    this.setSize();
    this.update();
    this.style();
    this.initEvents();
    requestAnimationFrame(() => this.render());
  }

  update() {
    for (const key in this.renderedStyles) {
      this.renderedStyles[key].current = this.renderedStyles[
        key
      ].previous = this.renderedStyles[key].setValue();
    }
    this.layout();
  }

  layout() {
    this.DOM.scrollable.style.transform = `translate3d(0,${
      -1 * this.renderedStyles.translationY.previous
    }px, 0)`;
  }

  setSize() {
    body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
  }

  style() {
    this.DOM.main.style.position = 'fixed';
    this.DOM.main.style.width = this.DOM.main.style.height = '100$';
    this.DOM.main.style.top = this.DOM.main.style.left = 0;
    this.DOM.main.style.overflow = 'hidden';
  }

  initEvents() {
    window.addEventListener('resize', () => this.setSize());
  }

  render() {
    for (const key in this.renderedStyles) {
      const styles = this.renderedStyles[key];
      styles.current = styles.setValue();
      styles.previous = MathUtils.lerp(
        styles.previous,
        styles.current,
        styles.ease,
      );
    }
    this.layout();
    requestAnimationFrame(() => this.render());
  }
}

new SmoothScroll();
