export class AnimationObserver {
  #animatedElementClassName
  #threshold
  #breakpoints

  get #animatedVisibleElementClassName() {
    return `${this.#animatedElementClassName}_visible`
  }
  get #animatedNoneVisibleElementClassName() {
    return `${this.#animatedElementClassName}_none_internal_use_only`
  }

  constructor({
    animatedElementClassName,
    threshold = 0.5,
    breakpoints = {
      mobile: {
        minWidth: 0,
        maxWidth: 600,
        className: `${animatedElementClassName}_mobile`,
      },
      tablet: {
        minWidth: 601,
        maxWidth: 1023,
        className: `${animatedElementClassName}_tablet`,
      },
      desktop: {
        minWidth: 1024,
        className: `${animatedElementClassName}_desktop`,
      },
    }
  }) {
    this.#animatedElementClassName = animatedElementClassName;
    this.#threshold = threshold;
    this.#breakpoints = breakpoints;
  }

  observe() {
    this.#scrollTop();
    this.#observeIntersect();
    this.#konami();
  }

  #scrollTop() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }

  #observeIntersect() {
    const animatedElements = document.getElementsByClassName(this.#animatedElementClassName);
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        this.handleAdaptiveAnimations(entry);

        window.addEventListener('resize', () => {
          this.handleAdaptiveAnimations(entry);
        });

        if (entry.isIntersecting) {
          entry.target.classList.add(this.#animatedVisibleElementClassName);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: this.#threshold });

    for (const animatedElement of animatedElements) {
      observer.observe(animatedElement);
    }
  }

  handleAdaptiveAnimations(entry) {
    const shouldDisableAnimation = this.checkAnimationBreakpoint(entry);
    if (shouldDisableAnimation) {
      entry.target.classList.add(this.#animatedNoneVisibleElementClassName);
    }
    else {
      entry.target.classList.remove(this.#animatedNoneVisibleElementClassName);
    }
  }

  checkAnimationBreakpoint(entry) {
    const { target } = entry;

    const isMobileAnimation =
        target.classList.contains(this.#breakpoints.mobile.className) &&
        window.innerWidth > this.#breakpoints.mobile.maxWidth;

    const isTabletAnimation =
        target.classList.contains(this.#breakpoints.tablet.className) &&
        window.innerWidth < this.#breakpoints.desktop.maxWidth &&
        window.innerWidth > this.#breakpoints.desktop.minWidth;

    const isDesktopAnimation =
        target.classList.contains(this.#breakpoints.desktop.className) &&
        window.innerWidth < this.#breakpoints.desktop.minWidth;

    return isMobileAnimation || isTabletAnimation || isDesktopAnimation;
  }

  #konami() {
    const konamiCode = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];

    let currentIndex = 0;

    document.addEventListener('keydown', (event) => {
      if (event.code === konamiCode[currentIndex]) {
        currentIndex++;
        if (currentIndex === konamiCode.length) {
          const secretImage = document.createElement('img');
          secretImage.src = "https://i.ibb.co/vwkxr8N/heh.jpg";
          secretImage.classList.add('overlay');
          document.body.appendChild(secretImage);
          setTimeout(() => {
            secretImage.classList.add('animated_fade_out');
            secretImage.addEventListener("animationend", () => {
              secretImage.remove();
            });
          }, 5000);
          currentIndex = 0;
        }
      } else {
        currentIndex = 0;
      }
    });
  }
}
