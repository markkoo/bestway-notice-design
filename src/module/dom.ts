export function scrollToTop() {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
    }
}

export function animation(duration: number, action: (progress: number, isLast: boolean) => void) {
    let start: number | null = null;
    const animation = (timeStamp: number) => {
        if (!start) start = timeStamp;
        let runtime = timeStamp - start;
        let progress = runtime / duration;
        if (progress >= 1) {
            action(progress, true);
        }
        else {
            action(progress, false);
            window.requestAnimationFrame(animation);
        }
    }
    window.requestAnimationFrame(animation);
}

export function slideDown(element: HTMLElement) {
    element.style.display = 'block';
    const height = element.clientHeight;
    element.style.height = '0';
    animation(300, (progress, isLast) => {
        if (isLast) {
            element.style.height = height + 'px';
        }
        else {
            element.style.height = (height * progress) + 'px';
        }
    });
}

export function slideUp(element: HTMLElement) {
    const height = element.clientHeight;
    animation(300, (progress, isLast) => {
        if (isLast) {
            element.style.removeProperty('height');
            element.style.removeProperty('display');
        }
        else {
            element.style.height = (height - (height * progress)) + 'px';
        }
    });
}

export function slideToggle(element: HTMLElement){
    let isOpen = window.getComputedStyle(element).display == 'block';
    if (isOpen) {
        slideUp(element);
    }
    else {
        slideDown(element);
    }
}







