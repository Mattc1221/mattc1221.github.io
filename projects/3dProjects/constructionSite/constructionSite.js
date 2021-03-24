/*jshint esversion: 6 */
// @ts-check

// get things we need
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";
import { GrDumpTruck, GrPileDriver } from "./construction.js";

let cDiv = document.getElementById("construction");
let world = new GrWorld({ groundplanesize: 10, where: cDiv });

let dumptruck = new GrDumpTruck({ x: -5, z: -5 });
world.add(dumptruck);
let d_ui = new AutoUI(dumptruck, 300, cDiv);

let piledriver = new GrPileDriver({ x: 5, z: 5 });
world.add(piledriver);
let p_ui = new AutoUI(piledriver, 300, cDiv);

// let crane = new GrCrane({ x: -5, z: 5 });
// world.add(crane);
// let c_ui = new AutoUI(crane, 300, cDiv);

// let excavator = new GrExcavator({ x: -2, z: 2 });
// world.add(excavator);
// let e_ui = new AutoUI(excavator, 300, cDiv);
// e_ui.set("x", 6);
// e_ui.set("z", 3);
// e_ui.set("theta", 36);


world.go();
