// Abstract functions, helpers, taht can be used both in engine.js and renderer.js

const removeEl = el => el.remove();

const isCol = (first, second) =>
    !(first.y > second.y - second.h ||
        first.y - first.h < second.y ||
        first.x + first.w < second.x ||
        first.x > second.x + second.w);