import Module from "../classes/Module.js";
import Parameter from "../classes/Parameter.js";
import { audioContext } from "../main.js";
import { displayAlertOnElement } from "../helpers/builders.js";

export default function crossfade(event, initalRatio) {
    const ratio = parseFloat(initalRatio || 50);
    const ratioInfo = "Crossfade ratio between track one and two. 0 is full first, 100 is full second";

    const module = new Module("Crossfade", true, false, false, undefined);

    module.audioNode = {
        inputNode: new DelayNode(audioContext), // just fake one for the sake of connectToModule()
        firstInputNode: new GainNode(audioContext),
        secondInputNode: new GainNode(audioContext),
        outputNode: new GainNode(audioContext),
        firstModule: undefined, // keeping ref to the module as they might still not be active (audioNode undefined)
        secondModule: undefined,
        firstTaken: false, // checking if first input is connected
        secondTaken: false, // checking if second input is connected
        ratio: new Parameter(ratio, (value) => {
            if (module.inputCount === 2) {
                // taken from: https://www.html5rocks.com/en/tutorials/webaudio/intro/#toc-xfade
                const x = parseInt(value) / parseInt(100);
                // Use an equal-power crossfading curve:
                const gain1 = Math.cos((1.0 - x) * 0.5 * Math.PI);
                const gain2 = Math.cos(x * 0.5 * Math.PI);

                console.log(gain1);
                console.log(gain2);

                module.audioNode.firstInputNode.gain.value = gain1;
                module.audioNode.secondInputNode.gain.value = gain2;
            } else if (module.inputCount < 2) {
                // displayAlertOnElement("Add another incoming sound. Two are needed", module.head, 3);
            }
        }),
        connect(destination) {
            if (destination.inputNode) this.outputNode.connect(destination.inputNode);
            else this.outputNode.connect(destination);
        },
        disconnect() {
            this.outputNode.disconnect();
        },
    };

    // this will be executed before onInputActivated (always). Order here matters
    module.onInputConnected = (source) => {
        // overwrite first with second and assign new to the second
        if (module.audioNode.firstTaken === true && module.audioNode.secondTaken === true) {
            console.log("OBA ZAJETE");
            module.audioNode.firstModule = module.audioNode.secondModule;
            module.audioNode.secondModule = source;
        }
        // if second is free then assign there
        if (module.audioNode.firstTaken === true && module.audioNode.secondTaken === false) {
            // when source is activated it might be that it will try to add first again
            if (source !== module.audioNode.firstModule) {
                console.log("PIERWSZY ZAJETY");
                console.log(module.audioNode.firstModule);
                module.audioNode.secondModule = source;
                module.audioNode.secondTaken = true;
                console.log(module.audioNode.secondModule);
            }
        }
        // if first is free then assign there
        if (module.audioNode.firstTaken === false) {
            console.log("PIERWSZY WOLNY");
            module.audioNode.firstModule = source;
            module.audioNode.firstTaken = true;
        }
    };

    module.onInputActivated = (source) => {
        console.log("input activated event with source", source);
        if (source === module.audioNode.firstModule || module.audioNode.firstModule === undefined) {
            source.audioNode.connect(module.audioNode.firstInputNode);
        }
        if (source === module.audioNode.secondModule || module.audioNode.secondModule === undefined) {
            source.audioNode.connect(module.audioNode.secondInputNode);
        }
    };

    module.createSlider("ratio", ratio, 0, 100, 1, "", false, ratioInfo);

    module.audioNode.firstInputNode.connect(module.audioNode.outputNode);
    module.audioNode.secondInputNode.connect(module.audioNode.outputNode);

    // add inital cable when structure is fully build - getBoundingClientRect related
    module.addInitalCable();

    return module;
}
