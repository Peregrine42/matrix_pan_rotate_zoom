export default function waitForDOM() {
    return new Promise(resolve => waitForDOMAsCallback(resolve))
}

function waitForDOMAsCallback(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', () => {
            if (document.readyState != 'loading')
                fn();
        });
    }
}
