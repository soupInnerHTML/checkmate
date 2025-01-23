class Control {
    #parent
    to // -1 or 1

    get element() {
        return this.#parent.querySelector(`.controls__arrow_${this.to > 0 ? "next": "prev"}`)
    }

    disable = () => {
        this.element.setAttribute('disabled', 'disabled');
    }
    enable = () => {
        this.element.removeAttribute('disabled')
    }
    handleClick = (callback) => {
        this.element.addEventListener('click', callback)
    }

    constructor({to, parent}) {
        this.to = to;
        this.#parent = parent;
    }
}

export class Slider {
    // private fields
    #root
    #lock = false
    #numerated
    #dots
    #infinite
    #direction = 1
    #totalSlides
    #initialSlide
    #slideProgress = 0
    #controls
    #shouldWaitAnimation
    #spaceBetween
    #slidesPerPage
    #intervalId
    #intervalTiming

    // private constants
    #WITHOUT_ANIMATION_CLASSNAME = "slider__inner_without-animation"
    #ACTIVE_DOT_CLASSNAME = 'controls__dot_active'

    // private getters / setters
    get #scale() {
        return -100 / (this.#totalSlides * (this.#infinite ? 2 : 1))
    }
    get #slider() {
        return this.#root.querySelector('.slider__inner');
    }
    get #slides() {
        return [...this.#slider.children]
    }

    #_currentSlide
    get #currentSlide() {
        return this.#_currentSlide;
    }
    set #currentSlide(nextSlide) {
        const previousSlide = this.#currentSlide ?? 0;
        this.#lock = this.#shouldWaitAnimation;
        this.#direction = nextSlide - previousSlide > 0 ? 1 : -1

        if(this.#infinite) {
            this.#_currentSlide = this.#handleInfiniteSlides(nextSlide)
        } else {
            this.#_currentSlide = nextSlide;

            if (this.#controls) {
                const isInRange = this.#checkRange(this.#direction);
                const control = this.#direction > 0 ? this.#controls.next : this.#controls.prev;

                isInRange ? control.enable() : control.disable();

                const oppositeControl = this.#direction > 0 ? this.#controls.prev : this.#controls.next;
                if (isInRange) {
                    oppositeControl.enable();
                }
            }
        }

        if(this.#numerated) {
            this.#root.querySelector('.controls__from').textContent = this.#currentSlide;
        }

        if(this.#dots) {
            this.#getDot(previousSlide).classList.remove(this.#ACTIVE_DOT_CLASSNAME);
            this.#getDot(this.#currentSlide).classList.add(this.#ACTIVE_DOT_CLASSNAME);
        }
    }

    // private methods
    // TODO replace getDot to the Control class (SOLID?????) ??????
    #getDot(index = 0) {
        return this.#root.querySelector(`.controls__dot:nth-of-type(${index + 1})`)
    }
    #handleInfiniteSlides(nextSlide) {
        if (nextSlide > this.#totalSlides) {
            this.#replaceSlides(1)
            return 1;
        } else if (!nextSlide) {
            this.#replaceSlides(-1)
            return this.#totalSlides;
        } else {
            return nextSlide;
        }
    }
    #replaceSlides(to) {
        this.#lock = this.#shouldWaitAnimation;
        const replaceSlides = () => {
            this.setTranslate((to > 0 ? 1 : this.#totalSlides) + this.#getAdaptiveAdjustGap(), true, false)
            this.#slider.removeEventListener("transitionend", replaceSlides)
        }
        this.#slider.addEventListener("transitionend", replaceSlides)
    }

    #checkRange(to) {
        if(this.#infinite) {
            return true
        }
        const next = this.#currentSlide + to;
        return to > 0 ? next < this.#totalSlides : next >= 0;
    }
    #resetAutoplay() {
        if(this.#intervalId) {
            clearInterval(this.#intervalId);
            this.autoplay(this.#intervalTiming)
        }
    }
    #fillSlidesRanges() {
        const half = Math.round(this.#slides.length / 2)
        const clonedSlides = this.#slides.map(slide => slide.cloneNode(true));
        const startEdge = clonedSlides.slice(0, half)
        const endEdge = clonedSlides.slice(half);

        this.#slider.append(...startEdge);
        this.#slider.prepend(...endEdge);
    }
    #registerControls() {
        this.#controls = {
            prev: new Control({
                to: -1,
                parent: this.#root,
            }),
            next: new Control({
                to: 1,
                parent: this.#root,
            })
        };

        Object.values(this.#controls).forEach((control) => {
            control.handleClick(() => {
                if(!this.#lock) {
                    this.slide(control.to)
                }
            })
        })
    }
    #initIndicators() {
        if(this.#numerated && this.#dots) {
            throw new Error("Нужно выбрать только один тип слайдера")
        }
        if(this.#totalSlides && this.#numerated) {
            this.#root.querySelector('.controls__to').textContent = `/ ${this.#totalSlides}`;
        }
        if(this.#totalSlides && this.#dots) {
            for(let index = 0; index < this.#totalSlides; index++) {
                const dot = document.createElement("div");
                dot.classList.add("controls__dot")
                if(index === (this.#initialSlide ?? 0)) {
                    dot.classList.add("controls__dot_active")
                }
                this.#root.querySelector('.controls__pagination_dots').appendChild(dot);
            }
        }
    }
    #getSlidesPerPagePropertyValue() {
        return getComputedStyle(this.#root).getPropertyValue('--slides-per-page').trim()
    }
    #getAdaptiveAdjustGap() {
        const slidesPerPage = this.#slidesPerPage ?? this.#getSlidesPerPagePropertyValue();
        this.#slidesPerPage = slidesPerPage;
        return this.#initialSlide - slidesPerPage;
    }
    #adjustSliderOnResize() {
        window.addEventListener('resize', () => {
            const slidesPerPagePropertyValue = this.#getSlidesPerPagePropertyValue()
            if(this.#slidesPerPage && this.#slidesPerPage !== slidesPerPagePropertyValue) {
                this.setTranslate(this.#slidesPerPage - slidesPerPagePropertyValue, false, false);
                this.#slidesPerPage = slidesPerPagePropertyValue
            }
            window.scrollTo({ left: 0 });
        })
    }

    // public methods
    autoplay(interval = 5000) {
        this.#intervalTiming = interval;
        this.#intervalId = setInterval(() => {
            this.slide(this.#direction) // направление autoplay зависит от последнего клика на кнопку: назад или вперед
        }, interval)
    }
    slide(to) {
        this.#currentSlide = this.#currentSlide + to;
        this.setTranslate(to);
    }
    setTranslate(to, isIn, withAnimation = true) {
        this.#resetAutoplay()
        if(!withAnimation) {
            this.#lock = this.#shouldWaitAnimation;
            this.#slider.classList.add(this.#WITHOUT_ANIMATION_CLASSNAME);
            setTimeout(() => {
                this.#slider.classList.remove(this.#WITHOUT_ANIMATION_CLASSNAME)
                this.#lock = false
            }, 100)
        }
        this.#slideProgress = (isIn ? 0 : this.#slideProgress) + to * this.#scale;

        let translateValue = `${this.#slideProgress}%`;
        if (this.#spaceBetween) {
            translateValue = `calc(${translateValue} + ${this.#spaceBetween * (this.#slideProgress / 100)}px)`;
        }

        this.#slider.setAttribute(
            'style',
            `transform: translateX(${translateValue})`
        );
    }
    register({
        autoplay,
        infinite,
        interval,
        initialSlide = 0,
        totalSlides,
        dots,
        numerated = !dots,
        shouldWaitAnimation = infinite,
        spaceBetween = 0,
    }) {
        this.#spaceBetween = spaceBetween;
        this.#shouldWaitAnimation = infinite ? true : shouldWaitAnimation;
        this.#totalSlides = totalSlides;
        this.#numerated = numerated;
        this.#dots = dots;
        this.#initIndicators()

        this.#infinite = infinite ?? false;
        if(infinite) {
            this.#fillSlidesRanges()
        }

        this.#initialSlide = initialSlide;
        this.#currentSlide = initialSlide;
        initialSlide && this.setTranslate(initialSlide + this.#getAdaptiveAdjustGap(), true, false);
        this.#adjustSliderOnResize()

        this.#registerControls()

        if(autoplay) {
            this.autoplay(interval);
        }

        if(shouldWaitAnimation) {
            this.#lock = false
            this.#slider.addEventListener("transitionend", () => {
                this.#lock = false;
            })
        }
    }

    // constructor
    constructor(selector) {
       this.#root = document.querySelector(selector);
    }
}