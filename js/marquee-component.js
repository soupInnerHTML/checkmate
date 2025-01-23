export class MarqueeComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/marquee.css';

        shadow.appendChild(link);

        shadow.innerHTML += `
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
    }
}