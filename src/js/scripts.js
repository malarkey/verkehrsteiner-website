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

window.Verkehrsteiner = window.Verkehrsteiner || {};
window.Verkehrsteiner.createAnimationToggle = createAnimationToggle;
})();
