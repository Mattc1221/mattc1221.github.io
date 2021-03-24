/*jshint esversion: 6 */
// @ts-check

/**
 * CS559 3D World Framework Code
 *
 * Simple, automatic UI from a  GrWorld 
 *
 * @module WorldUI 
 * */

// we need to have the BaseClass definition
import { GrObject } from "./GrObject.js";
// we need to import the module to get its typedefs for the type checker
import * as InputHelpers from "../CS559/inputHelpers.js";
import { GrWorld } from "./GrWorld.js";
import * as T from "../CS559-Three/build/three.module.js";
import { panel } from "./AutoUI.js";

export class WorldUI {
    /**
     * Create a UI panel for a GrWorld - this mimics the AutoUI
     * for GrObject.
     * 
     * Note: this just creates controls for the world parameters. 
     * It does not create UIs for the objects in the world
     *
     * This does place the panel into the DOM (onto the web page)
     * using `insertElement` in the CS559 helper library. The place
     * it is placed is controlled the `where` parameter. If you don't
     * pass a place, it puts it in a "Panel Panel" at the end of the DOM 
     * (see AutoUI)
     *
     * @param {GrWorld} world
     * @param {number} [width=300]
     * @param {InputHelpers.WhereSpec} [where] - where to place the panel in the DOM (at the end of the page by default)
     */
    constructor(world, width = 300, where = undefined) {
        let self = this;
        this.world = world;

        /* if no where is provided, put it at the end of the panel panel - assuming there is one */
        if (!where) {
            where = panel();
        }


        this.div = InputHelpers.makeBoxDiv({ width: width }, where);
        InputHelpers.makeHead("World Controls", this.div, { tight: true });
        let _world = this.world;

        // run control
        this.runbutton = InputHelpers.makeCheckbox("Run", this.div);
        world.runbutton = this.runbutton;
        world.runbutton.checked = true;
        this.runslider = new InputHelpers.LabelSlider("speed", {
            width: 250,
            min: 0.1,
            max: 3,
            step: 0.1,
            initial: 1,
            where: this.div
        });
        world.speedcontrol = this.runslider.range;

        // create "view solo" checkbox.
        this.selectionChkList = InputHelpers.makeFlexDiv(this.div);
        /**@type HTMLInputElement */
        this.chkSolo = InputHelpers.makeCheckbox(
            "chkSolo",
            this.selectionChkList,
            "View Solo Object"
        );
        this.chkSolo.onclick = function () {
            // avoid this as it is ambiguous when reading the code and lacks type info
            if (self.chkSolo.checked) {
                // we need to have some active object - so update it!
                _world.setActiveObject(self.selectLook.value);
                _world.showSoloObject();
            } else {
                _world.showWorld();
            }
        };
        this.selectViewMode = InputHelpers.makeSelect(
            ["Orbit Camera", "Fly Camera", "Follow Object", "Drive Object"],
            this.div
        );
        this.selectViewMode.onchange = function () {
            // if we're driving or following make sure we have something to ride/follow
            // note that we need to do this before setting the mode
            if (
                self.selectViewMode.value == "Drive Object" ||
                self.selectViewMode.value  == "Follow Object"
            ) {
                _world.setActiveObject(self.selectRideable.value);
            }
            // avoid this as it is ambiguous when reading the code and lacks type info
            _world.setViewMode(self.selectViewMode.value);
        };
        this.selectViewMode.onchange(null);

        InputHelpers.makeBreak(this.div);

        // create object selector for rideable
        InputHelpers.makeSpan("Drive:", this.div);
        let rideable = world.objects.filter(obj => obj.rideable);
        this.selectRideable = InputHelpers.makeSelect(
            rideable.map(ob => ob.name),
            this.div
        );
        this.selectRideable.onchange = function () {
            // avoid this as it is ambiguous when reading the code and lacks type info
            _world.setActiveObject(self.selectRideable.value);
            _world.setViewMode("Drive Object");
            self.selectViewMode.value = "Drive Object";
        };

        // create a selector for isolate
        InputHelpers.makeBreak(this.div);
        InputHelpers.makeSpan("LookAt:", this.div);
        this.selectLook = InputHelpers.makeSelect(
            world.objects.map(ob => ob.name),
            this.div
        );
        this.selectLook.onchange = function () {
            // if we were driving, stop!
            if (
                world.view_mode == "Drive Object" ||
                world.view_mode == "Follow Object"
            ) {
                _world.setViewMode("Orbit Camera");
                self.selectViewMode.value = "Orbit Camera";
            }

            let name = self.selectLook.value;
            _world.setActiveObject(name);
            let obj = _world.objects.find(ob => ob.name === name);
            let camparams = obj.lookFromLookAt();
            world.camera.position.set(camparams[0], camparams[1], camparams[2]);
            let lookAt = new T.Vector3(camparams[3], camparams[4], camparams[5]);
            world.camera.lookAt(lookAt);
            world.orbit_controls.target = new T.Vector3(
                camparams[3],
                camparams[4],
                camparams[5]
            );
        };
    }
}
