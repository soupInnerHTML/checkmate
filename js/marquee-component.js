export class MarqueeComponent extends HTMLElement {
  #shadowRoot
  #calculateMarqueeWidthOnResize() {
    window.addEventListener("resize", this.#calculateMarqueeWidth)
  }
  #calculateMarqueeWidth = () => {
    window.addEventListener('load', () => {
      const marqueeTextWrappers = this.#shadowRoot.querySelectorAll('.marquee__text-wrapper');
      const totalTextWidth = [...marqueeTextWrappers].reduce((accumulator, current) => {
        return accumulator += current.offsetWidth
      }, 50) /* 50 - чтоб резко не исчез */
      document.documentElement.style.setProperty('--marquee-width', `${totalTextWidth}px`);
    });
  }
  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/marquee.css";

    this.#shadowRoot.appendChild(link);

    this.#shadowRoot.innerHTML += `
      <section class="marquee">
          <div class="marquee__motion">
              <div class="marquee__text-wrapper">
                  <p class="marquee__text">Дело помощи утопающим — дело рук самих утопающих!</p>
              </div>
              <div class="marquee__text-wrapper">
                  <p class="marquee__text">Шахматы двигают вперед не только культуру, но и экономику!</p>
              </div>
              <div class="marquee__text-wrapper">
                  <p class="marquee__text">Лед тронулся, господа присяжные заседатели!</p>
              </div>
          </div>
      </section>
    `;

    this.#calculateMarqueeWidth()
    this.#calculateMarqueeWidthOnResize()
  }
}
