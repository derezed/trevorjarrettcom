import scrollama from "scrollama";

export default class Animations {
    constructor() {
        this.desktopNavigation = document.querySelector('.DesktopNav');
        this.mobileNavigation = document.querySelector('.MobileNav');

        this.scroller = scrollama();

        this.scroller.setup({
            step: ".step",
            debug: true,
            offset: 0.7,
            container: document.querySelector('body')
        }).onStepEnter((response) => {
            this.handleStepEnter(response);
        }).onStepExit((response) => {
            this.handleStepExit(response);
        });

        window.addEventListener("resize", this.scroller.resize);
    }
    
    handleNavigationStateChange(state) {
        // 0 = single button/off
        // 1 = floating bubbles/on
        if (state === 0) {
            this.desktopNavigation.classList.add('fadeOut');
            this.desktopNavigation.classList.remove('fadeIn');
            this.mobileNavigation.classList.remove('hidden');
            
            setTimeout(() => {
                this.mobileNavigation.classList.add('fadeIn');
            }, 250);
        } else {
            this.mobileNavigation.classList.remove('fadeIn');
            this.mobileNavigation.classList.add('fadeOut');

            this.desktopNavigation.classList.add('fadeIn');
            this.desktopNavigation.classList.remove('fadeOut');

            setTimeout(() => {
                this.mobileNavigation.classList.add('hidden');
            }, 250)
        }
    }

    handleStepEnter(response) {
        if (response?.element?.dataset?.step === 'CartoonTJ' && response?.direction === 'down') {
            this.handleNavigationStateChange(0);
        }
    }

    handleStepExit(response) {
        if (response?.element?.dataset?.step === 'CartoonTJ' && response?.direction === 'up') {
            this.handleNavigationStateChange(1);
        }
    }
};
