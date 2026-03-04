(() => {
function createAnimationToggle(options = {}) {
const button = options.button || null;
const labels = {
on: options.labelOn || "Animations ON",
off: options.labelOff || "Animations OFF"
};
const disabledLabelDefault = options.disabledLabel || "Animations unavailable";
const onStart = typeof options.onStart === "function" ? options.onStart : null;
const onStop = typeof options.onStop === "function" ? options.onStop : null;

let isRunning = options.initiallyRunning !== false;
let isDisabled = false;

const setStaticLabel = (label) => {
if (!button) {
return;
}

button.title = label;
button.setAttribute("aria-label", label);
button.setAttribute("aria-pressed", "false");
};

const setRunningUi = () => {
if (!button) {
return;
}

const iconOn = button.querySelector(".js-anim-icon-on");
const iconOff = button.querySelector(".js-anim-icon-off");
const textNode = button.querySelector(".js-anim-text");
const label = isRunning ? labels.on : labels.off;

button.title = label;
button.setAttribute("aria-label", label);
button.setAttribute("aria-pressed", isRunning ? "true" : "false");

if (textNode) {
textNode.textContent = label;
}

if (iconOn) {
iconOn.hidden = !isRunning;
}

if (iconOff) {
iconOff.hidden = isRunning;
}
};

const start = () => {
if (isDisabled || isRunning) {
return;
}

isRunning = true;
setRunningUi();

if (onStart) {
onStart();
}
};

const stop = () => {
if (isDisabled || !isRunning) {
return;
}

isRunning = false;
setRunningUi();

if (onStop) {
onStop();
}
};

const toggle = () => {
if (isRunning) {
stop();
} else {
start();
}
};

const disable = (label = disabledLabelDefault) => {
isDisabled = true;
isRunning = false;

if (!button) {
return;
}

button.disabled = true;
setStaticLabel(label);

const iconOn = button.querySelector(".js-anim-icon-on");
const iconOff = button.querySelector(".js-anim-icon-off");
const textNode = button.querySelector(".js-anim-text");

if (iconOn) {
iconOn.hidden = true;
}

if (iconOff) {
iconOff.hidden = false;
}

if (textNode) {
textNode.textContent = label;
}
};

const enable = () => {
if (!button) {
return;
}

isDisabled = false;
button.disabled = false;
setRunningUi();
};

if (button) {
setRunningUi();
button.addEventListener("click", (event) => {
event.preventDefault();
toggle();
});
}

if (options.autoStart !== false && isRunning && onStart) {
onStart();
}

return {
disable,
enable,
isDisabled: () => isDisabled,
isRunning: () => isRunning,
start,
stop,
toggle
};
}

function initServiceGraphicAnimations() {
const serviceFigures = Array.from(document.querySelectorAll(".service-graphic svg"));

if (!serviceFigures.length) {
return;
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const groupSelectors = [".img-lines-green", ".img-lines-orange", ".img-lines-yellow", ".img-lines-blue"];
const groupStagger = 1650;
const minItemDelay = 120;
const maxItemDelay = 420;
const fadeDuration = 2100;
const cyclePause = 2700;
const maxIterations = 3;

const shuffle = (items) => {
const copy = [...items];

for (let index = copy.length - 1; index > 0; index -= 1) {
const randomIndex = Math.floor(Math.random() * (index + 1));
[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
}

return copy;
};

const createServiceGraphicAnimation = (svg) => {
const groups = groupSelectors
.map((selector) => svg.querySelector(selector))
.filter(Boolean)
.map((group, groupIndex) => ({
groupIndex,
items: Array.from(group.children).filter((item) => item instanceof SVGElement)
}));

if (!groups.length) {
return null;
}

const timeoutIds = new Set();
let running = false;
let completedCycles = 0;

const setStaticState = () => {
groups.forEach(({ items }) => {
items.forEach((item) => {
item.style.opacity = "1";
item.style.transition = "";
});
});
};

const clearTimers = () => {
timeoutIds.forEach((timeoutId) => {
window.clearTimeout(timeoutId);
});
timeoutIds.clear();
};

const queueTimeout = (callback, delay) => {
const timeoutId = window.setTimeout(() => {
timeoutIds.delete(timeoutId);
callback();
}, delay);

timeoutIds.add(timeoutId);
return timeoutId;
};

const runCycle = () => {
if (!running || completedCycles >= maxIterations) {
return;
}

completedCycles += 1;

let maxDelay = 0;

groups.forEach(({ items }) => {
items.forEach((item) => {
item.style.transition = "opacity 0ms linear";
item.style.opacity = "0";
});
});

window.requestAnimationFrame(() => {
if (!running) {
return;
}

groups.forEach(({ items, groupIndex }) => {
const orderedItems = shuffle(items);
let itemDelay = groupIndex * groupStagger;

orderedItems.forEach((item) => {
const revealDelay = itemDelay;
maxDelay = Math.max(maxDelay, revealDelay);

queueTimeout(() => {
if (!running) {
return;
}

item.style.transition = "opacity " + fadeDuration + "ms ease";
item.style.opacity = "1";
}, revealDelay);

itemDelay += Math.round(minItemDelay + (Math.random() * (maxItemDelay - minItemDelay)));
});
});

if (completedCycles < maxIterations) {
queueTimeout(() => {
runCycle();
}, maxDelay + fadeDuration + cyclePause);
} else {
queueTimeout(() => {
running = false;
setStaticState();
}, maxDelay + fadeDuration);
}
});
};

return {
start() {
if (running || prefersReducedMotion.matches) {
return;
}

clearTimers();
completedCycles = 0;
running = true;
runCycle();
},
stop() {
running = false;
completedCycles = 0;
clearTimers();
setStaticState();
},
reset() {
running = false;
completedCycles = 0;
clearTimers();
setStaticState();
}
};
};

const animations = serviceFigures
.map((svg) => createServiceGraphicAnimation(svg))
.filter(Boolean);

if (!animations.length) {
return;
}

const startAll = () => {
animations.forEach((animation) => {
animation.start();
});
};

const stopAll = () => {
animations.forEach((animation) => {
animation.stop();
});
};

if (!prefersReducedMotion.matches) {
startAll();
} else {
stopAll();
}

if (typeof prefersReducedMotion.addEventListener === "function") {
prefersReducedMotion.addEventListener("change", (event) => {
if (event.matches) {
stopAll();
} else {
startAll();
}
});
}
}

const onReady = (callback) => {
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", callback, { once: true });
return;
}

callback();
};

onReady(() => {
initServiceGraphicAnimations();
});

window.Verkehrsteiner = window.Verkehrsteiner || {};
window.Verkehrsteiner.createAnimationToggle = createAnimationToggle;
})();
