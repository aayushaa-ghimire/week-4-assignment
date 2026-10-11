class ImageSlider {
    constructor(rootElement) {
        if (!rootElement) return;

        this.track = rootElement.querySelector("#sliderTrack");
        this.slides = Array.from(this.track.children);
        this.prevBtn = rootElement.querySelector("#prevBtn");
        this.nextBtn = rootElement.querySelector("#nextBtn");
        this.dotsContainer = rootElement.querySelector("#sliderDots");

        this.currentIndex = 0;
        this.slideCount = this.slides.length;

        this.init();
    }

    init() {
        this.createIndicatorDots();
        this.bindEventListeners();
        this.updateSliderState();
    }

    createIndicatorDots() {
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            dot.setAttribute("type", "button");
            dot.setAttribute("aria-label", `Jump to slide ${i + 1}`);
            
            if (i === 0) dot.classList.add("active");

            dot.addEventListener("click", () => {
                this.currentIndex = i;
                this.updateSliderState();
            });

            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(this.dotsContainer.children);
    }

    bindEventListeners() {
        this.nextBtn.addEventListener("click", () => {
            this.currentIndex = (this.currentIndex + 1) % this.slideCount;
            this.updateSliderState();
        });

        this.prevBtn.addEventListener("click", () => {
            this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
            this.updateSliderState();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                this.currentIndex = (this.currentIndex + 1) % this.slideCount;
                this.updateSliderState();
            } else if (e.key === "ArrowLeft") {
                this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
                this.updateSliderState();
            }
        });
    }

    updateSliderState() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add("active");
                dot.setAttribute("aria-selected", "true");
            } else {
                dot.classList.remove("active");
                dot.setAttribute("aria-selected", "false");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sliderContainer = document.querySelector(".slider-container");
    new ImageSlider(sliderContainer);
});