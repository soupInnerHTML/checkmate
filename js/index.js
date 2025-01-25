import { registerAnchors } from "./anchors.js";
import { Slider } from "./slider.js";
import { MarqueeComponent } from "./marquee-component.js";
import { AnimationObserver } from './animate.js';

registerAnchors();

customElements.define("custom-marquee", MarqueeComponent);

const animationObserver = new AnimationObserver({animatedElementClassName: "animated"})
animationObserver.observe()

const membersSlider = new Slider("#members-slider");
membersSlider.register({
  autoplay: true,
  infinite: true,
  initialSlide: 3,
  totalSlides: 6,
  interval: 4000,
  numerated: true,
});

const roadmapSlider = new Slider("#roadmap-slider");
roadmapSlider.register({
  dots: true,
  totalSlides: 5,
  spaceBetween: 20,
  mobileOnly: true,
});
