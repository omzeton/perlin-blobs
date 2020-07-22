class ShapeOverlays {
  constructor(elm, parent) {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.parent = parent;
    this.numPoints = 8;
    this.duration = 1000;
    this.delayPointsArray = [];
    this.delayPointsMax = 200;
    this.delayPerPath = 100;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    const range = 4 * Math.random() + 6;
    for (var i = 0; i < this.numPoints; i++) {
      const radian = (i / (this.numPoints - 1)) * Math.PI;
      this.delayPointsArray[i] =
        ((Math.sin(-radian) + Math.sin(-radian * range) + 2) / 4) *
        this.delayPointsMax;
    }
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.isOpened = true;
    this.parent.classList.add('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  close() {
    this.isOpened = false;
    this.parent.classList.remove('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      const thisEase = i % 2 === 1 ? ease.sineOut : ease.exponentialInOut;
      points[i] =
        (1 -
          thisEase(
            Math.min(
              Math.max(time - this.delayPointsArray[i], 0) / this.duration,
              1,
            ),
          )) *
        100;
    }

    let str = '';
    str += this.isOpened ? `M 0 0 H ${points[0]}` : `M ${points[0]} 0`;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = ((i + 1) / (this.numPoints - 1)) * 100;
      const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
      str += `C ${points[i]} ${cp} ${points[i + 1]} ${cp} ${
        points[i + 1]
      } ${p} `;
    }
    str += this.isOpened ? `H 100 V 0` : `H 0 V 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute(
          'd',
          this.updatePath(
            Date.now() - (this.timeStart + this.delayPerPath * i),
          ),
        );
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute(
          'd',
          this.updatePath(
            Date.now() -
              (this.timeStart + this.delayPerPath * (this.path.length - i - 1)),
          ),
        );
      }
    }
  }
  renderLoop() {
    this.render();
    if (
      Date.now() - this.timeStart <
      this.duration +
        this.delayPerPath * (this.path.length - 1) +
        this.delayPointsMax
    ) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    } else {
      this.isAnimating = false;
    }
  }
}

const overlay = new ShapeOverlays(
  document.getElementById('shapeOverlay'),
  document.querySelector('.hidden-wrapper'),
);
const openBtn = document.getElementById('openMenuBtn');
const closeBtn = document.getElementById('closeBtn');
const menuThings = document.querySelectorAll('.menu-item');
const animationDelay = 1500;

const clickHandler = () => {
  if (overlay.isAnimating) {
    return;
  }
  overlay.toggle();
  if (overlay.isOpened) {
    openBtn.classList.add('active');
    closeBtn.classList.remove('active');

    overlay.parent.style.zIndex = 9;
    setTimeout(() => {
      menuThings.forEach(el => (el.style.opacity = 1));
    }, animationDelay);
  } else {
    openBtn.classList.remove('active');
    closeBtn.classList.add('active');

    menuThings.forEach(el => (el.style.opacity = 0));
    setTimeout(() => {
      overlay.parent.style.zIndex = -1;
    }, animationDelay);
  }
};

openBtn.addEventListener('click', clickHandler);
closeBtn.addEventListener('click', clickHandler);

window.overlay = overlay;
