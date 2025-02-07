import Line from "../classes/Line.js";
import { modules } from "../main.js";
import { valueToLogPosition } from "../helpers/math.js";

// used by buildModule function to locate new modules on the screen
let tempx = 50;
let tempy = 100;

/* add button "open file..." that allows user to add file into the select */
export function addOpenFileButtonTo(selectDiv) {
    const input = document.createElement("input");
    const button = document.createElement("button");
    const fileButton = document.createElement("option");

    input.style = "display: none;";
    input.type = "file";

    button.innerText = "Open file...";

    fileButton.id = "file button";
    fileButton.appendChild(button);
    fileButton.appendChild(input);
    // module.content.options.select.fileButton.input
    fileButton.input = input;

    // module.content.options.select.fileButton
    selectDiv.appendChild(fileButton);
    selectDiv.fileButton = fileButton;
}
/* show message popup on the element for timeInSec seconds */
export function displayAlertOnElement(message, element, timeInSec) {
    const time = timeInSec === undefined ? 1000 : parseFloat(timeInSec) * 1000;
    let span;

    if (element === undefined) return;

    const previousAlert = element.getElementsByClassName("alertText")[0];

    // don't replicate the same alert
    if (previousAlert && previousAlert.innerHTML === message) {
        span = previousAlert;
        span.style.visibility = "visible";
        span.style.opacity = "1";
    } else {
        span = document.createElement("span");

        span.className = "alertText";
        span.innerHTML = message;

        element.classList.add("alert");
        element.appendChild(span);
    }

    setTimeout(() => {
        span.style.visibility = "hidden";
        span.style.opacity = "0";
    }, time);
}
/* build HTML structure for module */
export function buildModule(module) {
    const head = document.createElement("div");
    const close = document.createElement("button");
    const title = document.createElement("span");
    const content = document.createElement("div");
    const options = document.createElement("div");
    const buttons = document.createElement("div");
    const leftSide = document.createElement("div");
    const frontSide = document.createElement("div");
    const moduleDiv = document.createElement("div");
    const modulesDiv = document.getElementById("modules");
    const controllers = document.createElement("div");
    const titleWrapper = document.createElement("div");
    const moduleNumber = parseInt(module.id.slice(7, module.id.length));
    const leftAndFrontSide = document.createElement("div");

    module.div = moduleDiv;
    module.div.id = module.id;
    module.div.self = module; // just for logging

    moduleDiv.className = "module";
    moduleDiv.style.left = `${tempx}px`;
    moduleDiv.style.top = `${tempy}px`;

    if (tempx > modulesDiv.offsetWidth - 450) {
        tempy += 300;
        tempx = 50 + moduleNumber;
    } else tempx += 300;
    if (tempy > window.innerHeight - 300) tempy = 100 + moduleNumber;

    // module.head.titleWrapper.title
    title.className = "title";
    title.appendChild(document.createTextNode(module.name));
    title.name = module.name;

    // module.head.titleWrapper
    titleWrapper.className = "title-wrapper";
    titleWrapper.appendChild(title);

    // module.head.close
    close.classList.add("close");
    close.classList.add("button");

    // buttons' wrapper
    buttons.className = "buttons-wrapper";
    buttons.appendChild(close);

    // moudule.head
    head.className = "head";
    head.appendChild(titleWrapper);
    head.appendChild(buttons);
    head.close = close;
    head.buttonsWrapper = buttons;
    head.titleWrapper = titleWrapper;

    // module.content.options
    options.className = "options";

    if (module.arrayForSelect) {
        const select = document.createElement("select");

        module.arrayForSelect.forEach((object) => {
            const option = document.createElement("option");
            option.appendChild(document.createTextNode(object));
            select.add(option);
        });

        options.appendChild(select);
        options.select = select;
    }

    if (module.hasLooper) {
        const label = document.createElement("label");
        const looper = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        // To associate label with an input element, you need to give the input an id attribute.
        label.htmlFor = `${module.id}-content-options-looper`;
        label.appendChild(document.createTextNode("Loop"));

        looper.className = "looper";
        looper.id = `${module.id}-content-options-looper`;
        looper.appendChild(checkbox);
        looper.appendChild(label);

        looper.checkbox = checkbox;
        looper.label = label;

        moduleDiv.classList.add("has-looper");
        options.appendChild(looper);

        options.looper = looper;
    }

    if (module.hasNormalizer) {
        const label = document.createElement("label");
        const normalizer = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        label.htmlFor = `${module.id}-content-options-looper`;
        label.appendChild(document.createTextNode("Norm"));

        normalizer.className = "normalizer";
        normalizer.id = `${module.id}-content-options-normalizer`;
        normalizer.appendChild(checkbox);
        normalizer.appendChild(label);

        normalizer.checkbox = checkbox;
        normalizer.label = label;

        moduleDiv.classList.add("has-normalizer");
        options.appendChild(normalizer);

        options.normalizer = normalizer;
    }

    if (module.hasLooper || module.hasNormalizer || module.arrayForSelect) {
        content.appendChild(options);
        content.options = options;
    }

    // module.content.controllers
    controllers.className = "controllers";

    // module.content
    content.className = "content";
    content.appendChild(controllers);
    content.controllers = controllers;

    if (module.hasInput) {
        // module.input
        const socket = document.createElement("div");
        const img = document.createElement("img");

        // keep info about parent and type in image and it's wrapper for movingCable function
        img.src = "./img/input.svg";
        img.inputName = "input";
        img.parentModuleID = module.id;

        socket.className = "socket-wrapper";
        socket.inputName = "input";
        socket.parentModuleID = module.id;
        socket.appendChild(img);

        leftSide.appendChild(socket);

        moduleDiv.input = img;
    }
    leftSide.className = "left-side";
    frontSide.className = "front-side";
    leftAndFrontSide.className = "left-and-front-side";

    frontSide.appendChild(head);
    frontSide.appendChild(content);

    leftAndFrontSide.appendChild(leftSide);
    leftAndFrontSide.appendChild(frontSide);


    moduleDiv.setAttribute("audioNodeType", module.name);
    moduleDiv.appendChild(leftAndFrontSide);
  

    module.head = head;
    module.content = content;
   
    // add the node into the soundfield
    modulesDiv.appendChild(moduleDiv);
}
/* build HTML structure for slider */
export function buildModuleSlider(module, property, initialValue, min, max, stepUnits, units, scaleLog, propertyInfo) {
    const unit = document.createElement("span");
    const info = document.createElement("div");
    const value = document.createElement("span");
    const label = document.createElement("div");
    const slider = document.createElement("input");
    const sliderDiv = document.createElement("div");
    const valueUnit = document.createElement("div");
    const labelSpan = document.createElement("span");
    const audioParam = document.createElement("div");
    const sliderWraper = document.createElement("div");
    const parameterImg = document.createElement("img");
    const parameterType = property.split(" ").join("");
    const propertyNoUnderscores = property.split("_").join(""); // used by equalizer


    labelSpan.appendChild(document.createTextNode(propertyNoUnderscores));
    labelSpan.className = "label-span";

    // module.content.controllers.$parameterType.info.label
    // or module.controllers[$parameterType].info.label
    label.className = "label";
    label.appendChild(labelSpan);
    label.span = labelSpan;

    // module.content.controllers.$parameterType.info.valueUnit.value
    // or module.controllers[$parameterType].info.valueUnit.value
    // or module.controllers[$parameterType].value
    const valueDiv = document.createElement("div")

    valueDiv.className = "valueWrapper"
    const plus = document.createElement("span")
    plus.innerHTML = "+";

    value.className = "value";
    value.appendChild(document.createTextNode(initialValue));

    valueDiv.appendChild(plus)
    valueDiv.appendChild(value)

    // module.content.controllers.$parameterType.info.units
    // or module.controllers[$parameterType].info.units
    unit.className = "value";
    unit.appendChild(document.createTextNode(units));

    valueUnit.className = "value-unit";
    valueUnit.appendChild(valueDiv);
    units && valueUnit.appendChild(unit); // sometimes there is no unit
    valueUnit.plus = plus;
    valueUnit.value = value;
    valueUnit.unit = unit;

    // module.content.controllers.$parameterType.info
    // or module.controllers[$parameterType].info
    info.className = "slider-info";
    info.appendChild(valueUnit);
    info.valueUnit = valueUnit;
    info.label = label;

    // module.content.controllers.$parameterType.slider
    // or module.controllers[$parameterType].slider
    slider.type = "range";
    slider.scaleLog = scaleLog;
    slider.min = min;
    slider.max = max;
    slider.step = stepUnits;
    // set inital value to the correct position before user starts to play
    slider.value = scaleLog ? valueToLogPosition(initialValue, min, max) : parseFloat(initialValue);


    sliderWraper.className = "input-wrapper";
    sliderWraper.appendChild(slider);

    // module.content.controllers.$parameterType or module.controllers[$parameterType]
    sliderDiv.className = "slider";
    sliderDiv.appendChild(info);
    sliderDiv.appendChild(sliderWraper);
    sliderDiv.appendChild(label);
    sliderDiv.info = info;
    sliderDiv.slider = slider;
    sliderDiv.wrapper = sliderWraper;

    // if sliders div have not been created yet do it
    if (!module.content.controllers.sliders) {
        const sliders = document.createElement("div");
        sliders.className = "sliders";

        module.content.controllers.appendChild(sliders);
        module.content.controllers.sliders = sliders;
    }

    module.content.controllers.sliders.appendChild(sliderDiv);
    module.content.controllers[parameterType] = sliderDiv;
    module.content.controllers[parameterType].value = value;
    module.content.controllers[parameterType].unit = unit;
    module.content.controllers[parameterType].plus = plus;

    // module.footer.$parameterType.img
    // keep info about parent and type in image and it's wrapper for movingCable function
    parameterImg.src = "./img/parameter_input.svg";
    parameterImg.inputName = parameterType;
    parameterImg.parentModuleID = module.id;

    // module.footer.$parameterType
    audioParam.inputName = parameterType;
    audioParam.parentModuleID = module.id;
    audioParam.className = "parameter-wrapper";
    audioParam.appendChild(parameterImg);
    audioParam.img = parameterImg;

}
/* build HTML (and SVG) structure for cable */
export function buildCable(cable) {
    const svg = document.getElementById("svgCanvas");
    const xPosition = parseFloat(modules[cable.sourceID].modulePosition.right);
    const yPosition = parseFloat(modules[cable.sourceID].modulePosition.top) + 10;
    const shapeUnfoldAnimation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    const shapeFoldAnimation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    const jackRotateAnimation = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");

    cable.jack.setAttribute("href", "./img/jack.svg");
    cable.jack.setAttribute("height", "9");
    cable.jack.setAttribute("id", `${cable.sourceID}-jack`);

    // move original shape to the position on the right top of module
    cable.points.forEach((point, i) => {
        point.moveBy(xPosition, yPosition);
        if (i > 0) {
            // newLine keeps the array with pointers linked to Points which is cool!
            // by updating the line we update the points in the points array too
            const newLine = new Line(cable.points[i - 1], cable.points[i], Math.log(point.x), 0.8);
            cable.lines.push(newLine);
        }
    });

    // translate points to actual svg shape (polyline)
    // pointsToString is Cable class function
    cable.shape.setAttribute("stroke", "#040404");
    cable.shape.setAttribute("fill", "none");
    cable.shape.setAttribute("opacity", "0.9");
    cable.shape.setAttribute("stroke-width", "2");
    cable.shape.setAttribute("points", cable.pointsToString);
    cable.shape.setAttribute("stroke-dasharray", "60");

    svg.appendChild(cable.shape);
    svg.appendChild(cable.jack);

    // unfold cable from starting point
    shapeUnfoldAnimation.setAttribute("attributeName", "stroke-dashoffset");
    shapeUnfoldAnimation.setAttribute("from", "60");
    shapeUnfoldAnimation.setAttribute("to", "0");
    shapeUnfoldAnimation.setAttribute("dur", "1s");
    shapeUnfoldAnimation.setAttribute("fill", "freeze");

    cable.shape.unfoldAnimation = shapeUnfoldAnimation;

    // "from" and "to" attribute will be added when cable is actually folding
    shapeFoldAnimation.setAttribute("attributeName", "points");
    shapeFoldAnimation.setAttribute("dur", "0.5s");
    shapeFoldAnimation.setAttribute("fill", "freeze");

    cable.shape.foldAnimation = shapeFoldAnimation;

    // rotate jack from starting point so it looks like it's attached to the cable (jack.width/2 = 4.5)
    jackRotateAnimation.setAttribute("path", `m ${0.378 + xPosition + 4.5} ${1.056 + yPosition} c 13.622 3.944 18.622 34.944 17.622 52.944`);
    jackRotateAnimation.setAttribute("begin", "0s");
    jackRotateAnimation.setAttribute("dur", "1s");
    jackRotateAnimation.setAttribute("rotate", "auto");
    jackRotateAnimation.setAttribute("fill", "freeze");

    cable.jack.rotateAnimation = jackRotateAnimation;
}
