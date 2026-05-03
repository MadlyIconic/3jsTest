global.requestIdleCallback = (callback) => setTimeout(callback, 0);
global.cancelIdleCallback = (id) => clearTimeout(id);
