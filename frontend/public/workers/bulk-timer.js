/**
 * Web Worker for accurate timing in bulk generation.
 * Browsers throttle setTimeout/setInterval in background tabs to ~1s or more.
 * Web Workers run in a separate thread and are not subject to the same strict throttling,
 * helping keep our queue processing loop alive and accurate.
 */

let timer = null;

self.onmessage = (e) => {
    const { action, interval } = e.data;

    if (action === 'start') {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            self.postMessage({ type: 'tick' });
        }, interval || 1000);
    }

    if (action === 'stop') {
        if (timer) clearInterval(timer);
        timer = null;
    }
};
