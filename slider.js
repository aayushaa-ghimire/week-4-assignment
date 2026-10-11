class ImageSlider {
    constructor(rootElement) {
        if (!rootElement) return;

        this.track = rootElement.querySelector("#sliderTrack");
        this.slides = Array.from(this.track.children);
        this.prevBtn = rootElement.querySelector("#prevBtn");
        this.nextBtn = rootElement.querySelector("#nextBtn");
        this.dotsContainer = rootElement.querySelector("#sliderDots");

        this.slideCount = this.slides.length;
        this.position = 1; // track position, counting the clone at the start
        this.isAnimating = false;

        this.init();
    }

    // Logical slide index (0 to slideCount - 1), ignoring the clones.
    get currentIndex() {
        return (this.position - 1 + this.slideCount) % this.slideCount;
    }

    init() {
        this.createClones();
        this.createIndicatorDots();
        this.bindEventListeners();
        this.jumpTo(this.position);
        this.updateDots();
    }

    // Track layout: [clone of last] [slide 1 ... slide N] [clone of first]
    createClones() {
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slideCount - 1].cloneNode(true);

        [firstClone, lastClone].forEach((clone) => {
            clone.setAttribute("aria-hidden", "true");
            clone.classList.add("clone");
        });

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.slides[0]);
    }

    createIndicatorDots() {
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            dot.setAttribute("type", "button");
            dot.setAttribute("aria-label", `Jump to slide ${i + 1}`);

            dot.addEventListener("click", () => this.goToSlide(i));

            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(this.dotsContainer.children);
    }

    bindEventListeners() {
        this.nextBtn.addEventListener("click", () => this.next());
        this.prevBtn.addEventListener("click", () => this.prev());

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") this.next();
            else if (e.key === "ArrowLeft") this.prev();
        });

        // When a slide animation ends on a clone, jump back to the real slide.
        this.track.addEventListener("transitionend", (e) => {
            if (e.target !== this.track || e.propertyName !== "transform") return;
            this.normalizePosition();
            this.isAnimating = false;
        });
    }

    next() {
        this.moveTo(this.position + 1);
    }

    prev() {
        this.moveTo(this.position - 1);
    }

    goToSlide(index) {
        this.moveTo(index + 1);
    }

    moveTo(position) {
        if (this.isAnimating || position === this.position) return;

        this.position = position;
        this.updateDots();

        if (this.prefersReducedMotion()) {
            this.jumpTo(position);
            this.normalizePosition();
            return;
        }

        this.isAnimating = true;
        this.track.style.transform = `translateX(-${position * 100}%)`;
    }

    // Move instantly with no animation.
    jumpTo(position) {
        this.position = position;
        this.track.style.transition = "none";
        this.track.style.transform = `translateX(-${position * 100}%)`;
        void this.track.offsetWidth; // flush styles so the jump is not animated
        this.track.style.transition = "";
    }

    // Slide off either end onto a clone, then swap silently to the real slide.
    normalizePosition() {
        if (this.position === this.slideCount + 1) this.jumpTo(1);
        else if (this.position === 0) this.jumpTo(this.slideCount);
    }

    prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            const isActive = index === this.currentIndex;
            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-selected", String(isActive));
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sliderContainer = document.querySelector(".slider-container");
    new ImageSlider(sliderContainer);
});