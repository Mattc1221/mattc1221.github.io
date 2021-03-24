/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Scene } from "../libs/CS559-Three/build/three.module.js";

function degreesToRadians(deg) {
    return (deg * Math.PI) / 180;
  }

let dumptruckObCtr = 0;

// A simple excavator
/**
 * @typedef DumpTruckProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrDumpTruck extends GrObject {
  /**
   * @param {DumpTruckProperties} params
   */
  constructor(params = {}) {
    let dumptruck = new T.Group();
    let whole_object = new T.Group();
    let smokeGroup = new T.Group();
    let dump = new T.Group();
    let wheels = [];
    const SCALE = 0.3;

    // CREATE SETTINGS
    let edgeSettings = {
      steps: 2,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2
    };
    let dumpSettings = {
      steps: 2,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2
    };
    let dumpSettings2 = {
      steps: 2,
      depth: 8,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2
    };
    let truckSettings = {
      steps: 2,
      depth: 7,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    // CREATE MATERIALS
    let dump_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let truck_mat = new T.MeshStandardMaterial({
      color: "red",
      metalness: 0.5,
      roughness: 0.7
    });

    // CREATING THE EDGE OF THE DUMP
    let edge_curve = new T.Shape();
    edge_curve.moveTo(-10, 6);
    edge_curve.lineTo(-10, 1);
    edge_curve.lineTo(-9, 1);
    edge_curve.lineTo(-9, 5);
    edge_curve.lineTo(-2.5, 5);
    edge_curve.lineTo(-1, 7);
    edge_curve.lineTo(3, 7);
    edge_curve.lineTo(3, 8);
    edge_curve.lineTo(-2, 8);
    edge_curve.lineTo(-3.5, 6);

    let edge_geom = new T.ExtrudeGeometry(edge_curve, edgeSettings);
    let edge1 = new T.Mesh(edge_geom, dump_mat);
    let edge2 = new T.Mesh(edge_geom, dump_mat);
    edge1.position.z -= 4 * SCALE;
    edge2.position.z += 4 * SCALE;
    edge1.scale.set(SCALE, SCALE, SCALE);
    edge2.scale.set(SCALE, SCALE, SCALE);
    dump.add(edge1, edge2);

    // CREATING THE SIDES OF THE DUMP
    let side_curve = new T.Shape();
    side_curve.moveTo(-9, 5);
    side_curve.lineTo(-9, 2);
    side_curve.lineTo(-7.5, 0);
    side_curve.lineTo(-6, 2);
    side_curve.lineTo(-3.5, 2);
    side_curve.lineTo(-2, 0);
    side_curve.lineTo(0, 0);
    side_curve.lineTo(2, 7);
    side_curve.lineTo(-1, 7);
    side_curve.lineTo(-2.5, 5);

    let side_geom = new T.ExtrudeGeometry(side_curve, dumpSettings);
    let side1 = new T.Mesh(side_geom, dump_mat);
    let side2 = new T.Mesh(side_geom, dump_mat);
    side1.position.z -= 4 * SCALE;
    side2.position.z += 4 * SCALE;
    side1.scale.set(SCALE, SCALE, SCALE);
    side2.scale.set(SCALE, SCALE, SCALE);
    dump.add(side1, side2);

    // CREATING THE Bottom/front OF THE DUMP
    let bottom_curve = new T.Shape();
    bottom_curve.moveTo(-9, 2);
    bottom_curve.lineTo(-7.5, 0);
    bottom_curve.lineTo(-6, 2);
    bottom_curve.lineTo(-3.5, 2);
    bottom_curve.lineTo(-2, 0);
    bottom_curve.lineTo(0, 0);
    bottom_curve.lineTo(2, 7);
    bottom_curve.lineTo(3, 7);
    bottom_curve.lineTo(3, 8);
    bottom_curve.lineTo(2, 8);
    bottom_curve.lineTo(-0.5, 0.5);
    bottom_curve.lineTo(-1.5, 0.5);
    bottom_curve.lineTo(-3, 2.5);
    bottom_curve.lineTo(-6.5, 2.5);
    bottom_curve.lineTo(-7.5, 1);
    bottom_curve.lineTo(-9, 2.5);
    bottom_curve.lineTo(-10, 2.5);
    bottom_curve.lineTo(-10, 1);
    bottom_curve.lineTo(-9, 1);

    let bottom_geom = new T.ExtrudeGeometry(bottom_curve, dumpSettings2);
    let bottomDump= new T.Mesh(bottom_geom, dump_mat);
    bottomDump.position.z -= 4 * SCALE;
    bottomDump.scale.set(SCALE, SCALE, SCALE);
    dump.add(bottomDump);

    // CREATING THE SIDES OF THE TRUCK
    let truck_curve = new T.Shape();
    truck_curve.moveTo(2.5, 6.5);
    truck_curve.lineTo(5.5, 6.5);
    truck_curve.lineTo(7, 4);
    truck_curve.lineTo(9, 4);
    truck_curve.lineTo(10, 2);
    truck_curve.lineTo(10, 0);
    truck_curve.lineTo(7.5, 0);
    truck_curve.lineTo(6, 2);
    truck_curve.lineTo(3.5, 2);
    truck_curve.lineTo(2, 0);
    truck_curve.lineTo(0.5, 0);

    let truck_geom = new T.ExtrudeGeometry(truck_curve, dumpSettings2);
    let truck = new T.Mesh(truck_geom, truck_mat);
    truck.position.z -= 4 * SCALE;
    truck.scale.set(SCALE, SCALE, SCALE);
    dumptruck.add(truck, dump);

    // CREATING WHEELS
    let wheelMat = new T.MeshStandardMaterial( { color: "black" } );
    const wheelGeom = new T.TorusGeometry( 1.5, 0.6, 16, 100 );
    const capGeom = new T.CylinderGeometry(1.5, 1.5, 1);
    for(var i = 0; i < 4; i++){
        const tire = new T.Mesh( wheelGeom, wheelMat );
        const cap = new T.Mesh(capGeom, truck_mat);
        cap.rotateX(Math.PI/2);
        tire.scale.set(SCALE, SCALE, SCALE);
        cap.scale.set(SCALE, SCALE, SCALE);
        let wheel = new T.Group();
        wheel.add(tire, cap);
        wheels.push(wheel);
        dumptruck.add(wheel);
    }
    // set their positions
    wheels[0].position.set(-4.75 * SCALE, -0.2 * SCALE, -4 * SCALE);
    wheels[1].position.set(-4.75 * SCALE, -0.2 * SCALE, 4 * SCALE);
    wheels[2].position.set(4.75 * SCALE, -0.2 * SCALE, -4 * SCALE);
    wheels[3].position.set(4.75 * SCALE, -0.2 * SCALE, 4 * SCALE);

    // CREATE PIPE
    let pipeGeom = new T.CylinderGeometry(0.5, 0.5, 2);
    let pipeMat = new T.MeshStandardMaterial({color: "#333333"});
    let pipe = new T.Mesh(pipeGeom, pipeMat);
    pipe.position.set(4.5 * SCALE, 7.5 * SCALE, 2 * SCALE);
    pipe.scale.set(SCALE, SCALE, SCALE);
    dumptruck.add(pipe);

    // CREATE SMOKE
    let smokeGeom = new T.SphereGeometry(0.3, 10, 10);
    let smokeMat = new T.MeshStandardMaterial({color: "grey"});
    let smokes = [];
    for( var i = 0; i < 5; i++ ){
        let smoke = new T.Mesh(smokeGeom, smokeMat);
        smoke.position.set(pipe.position.x, pipe.position.y + (i * SCALE * 0.8), pipe.position.z);
        smoke.scale.set(SCALE, SCALE, SCALE);
        smokeGroup.add(smoke);
        smokes.push(smoke);
    }

    whole_object.add(dumptruck, smokeGroup);
    whole_object.translateX(-10 * SCALE);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // The parameters for sliders are also defined here.
    super(`dumptruck-${dumptruckObCtr++}`, whole_object, [
      ["x", 0, 10, 0],
      ["z", 0, 10, 0],
      ["theta", 0, 360, 312],
      ["dump", 0, 36, 0],
      ["turn", -30, 30, 0],
    ]);
    // As with the crane, we save the "excavator" group as the "whole object" of the GrExcavator class.
    // We also save the groups of each object that may be manipulated by the UI.
    this.whole_ob = whole_object;
    this.dumptruck = dumptruck;
    this.dump = dump;
    this.SCALE = SCALE;
    this.wheels = wheels;
    this.smokes = smokes;
    this.pipe = pipe;
    this.theta = 312;

    // put the object in its place
    let scale = params.size ? Number(params.size) : 1;
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 2  * SCALE * scale;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    dumptruck.scale.set(scale, scale, scale);
  }

  update(paramValues) {
    this.dumptruck.position.x = paramValues[0];
    this.dumptruck.position.z = paramValues[1];
    this.dumptruck.rotation.y = degreesToRadians(paramValues[2]);
    this.dump.translateX(-this.SCALE * 10);
    this.dump.rotation.z = degreesToRadians(paramValues[3]);
    this.dump.translateX(this.SCALE * 10);
    this.wheels[2].rotation.y = degreesToRadians(paramValues[4]);
    this.wheels[3].rotation.y = degreesToRadians(paramValues[4]);
    this.theta = -degreesToRadians(paramValues[2]);
  }

  stepWorld(step, timeOfDay) {
    for( var i = 0; i < this.smokes.length; i++){
        if( this.smokes[i].position.y > this.pipe.position.y * 2){
            this.smokes[i].position.set(
                this.dumptruck.position.x + ((4.5 * this.SCALE * Math.cos(this.theta)) - (2 * this.SCALE * Math.sin(this.theta))), 
                this.pipe.position.y + (i * this.SCALE * 0.8), 
                this.dumptruck.position.z + ((4.5 * this.SCALE * Math.sin(this.theta)) + (2 * this.SCALE * Math.cos(this.theta))));
        }
        this.smokes[i].position.y += 0.05 + Math.random()*0.02;
    }
  }
}


let piledriverObCtr = 0;

// A simple excavator
/**
 * @typedef PileDriverProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrPileDriver extends GrObject {
  /**
   * @param {PileDriverProperties} params
   */
  constructor(params = {}) {
    let whole_obj = new T.Group();
    let driveGroup = new T.Group();
    let spinGroup = new T.Group();
    let rotGroup = new T.Group();
    const SCALE = 0.3;

    // SETTINGS
    let wheelSettings = {
        steps: 2,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelSegments: 2
    };
    let widthSettings = {
        steps: 4,
        depth: 8.8,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelSegments: 2
    };
    let skinnySettings = {
        steps: 4,
        depth: 3,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelSegments: 2
    };
    let thinSettings = {
        steps: 2,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    // MATERIALS
    let blackMat = new T.MeshStandardMaterial({color: "#333333"});
    let orangeMat = new T.MeshStandardMaterial({color: "#D06715"});
    let yellowMat = new T.MeshStandardMaterial({color: "#D8D338"});

    // CREATE WHEELS
    let wheel_curve = new T.Shape();
    wheel_curve.moveTo(-6, 1.5);
    wheel_curve.lineTo(-6, 3);
    wheel_curve.lineTo(-5.5, 4);
    wheel_curve.lineTo(-4, 4.5);
    wheel_curve.lineTo(4, 4.5);
    wheel_curve.lineTo(5.5, 4);
    wheel_curve.lineTo(6, 3);
    wheel_curve.lineTo(6, 1.5);
    wheel_curve.lineTo(5.5, 0.5);
    wheel_curve.lineTo(4, 0);
    wheel_curve.lineTo(-4, 0);
    wheel_curve.lineTo(-5.5, 0.5);

    let wheelGeom = new T.ExtrudeGeometry(wheel_curve, wheelSettings);
    let wheel1 = new T.Mesh(wheelGeom, blackMat);
    let wheel2 = new T.Mesh(wheelGeom, blackMat);
    wheel1.translateZ(4.5);
    wheel2.translateZ(-4.5);
    let wheels = new T.Group();
    wheels.add(wheel1, wheel2);

    // CREATE CONNECTOR
    let connector_curve = new T.Shape();
    connector_curve.moveTo(-4, 1.5);
    connector_curve.lineTo(-4, 3.5);
    connector_curve.lineTo(4, 3.5);
    connector_curve.lineTo(4, 1.5);

    let connectorGeom = new T.ExtrudeGeometry(connector_curve, widthSettings);
    let connector = new T.Mesh(connectorGeom, orangeMat);
    connector.translateZ(0.8);
    connector.translateX(-4.4);
    connector.rotateOnAxis(new T.Vector3(0, 1, 0), Math.PI/2);

    // CREATE BODY
    let bodyCurve = new T.Shape();
    bodyCurve.moveTo(-8, 9.5);
    bodyCurve.lineTo(0.5, 9.5);
    bodyCurve.lineTo(0.5, 7.5);
    bodyCurve.lineTo(3, 7.5);
    bodyCurve.lineTo(3, 5.5);
    bodyCurve.lineTo(-8, 5.5);

    let bodyGeom = new T.ExtrudeGeometry(bodyCurve, widthSettings);
    let body = new T.Mesh(bodyGeom, orangeMat);
    body.translateZ(-3.85);

    // CREATE BODYTOP
    let bodyTopCurve = new T.Shape();
    bodyTopCurve.moveTo(-6.5, 10.5);
    bodyTopCurve.lineTo(-2, 10.5);
    bodyTopCurve.lineTo(-2, 9.5);
    bodyTopCurve.lineTo(-6.5, 9.5);

    let bodyTopGeom = new T.ExtrudeGeometry(bodyTopCurve, skinnySettings);
    let bodyTop = new T.Mesh(bodyTopGeom, orangeMat);
    bodyTop.translateZ(-1);

    // CREATE ARM
    let armCurve = new T.Shape();
    armCurve.moveTo(0.5, 9.5);
    armCurve.lineTo(0.5, 7.5);
    armCurve.lineTo(5, 12);
    armCurve.lineTo(8.5, 12);
    armCurve.lineTo(10, 11.5);
    armCurve.lineTo(10, 15);
    armCurve.lineTo(5, 15);

    let armGeom = new T.ExtrudeGeometry(armCurve, skinnySettings);
    let arm = new T.Mesh(armGeom, orangeMat);
    arm.translateZ(-1);

    // CREATE TURNPOINT
    let turnpointGeom = new T.CylinderGeometry(3, 3, 3);
    let turnpoint = new T.Mesh(turnpointGeom, orangeMat);
    turnpoint.position.set(0, 5, 0.5);

    // CREATE HOLDER
    let holderGeom = new T.CylinderGeometry(2, 2, 7);
    let holder = new T.Mesh(holderGeom, blackMat);
    holder.position.set(11, 13.5, 0.5);

    // CREATE DRIVER
    let driverGeom = new T.BoxGeometry(2, 16, 2);
    let driver = new T.Mesh(driverGeom, orangeMat);
    driver.position.set(11, 12.5, 0.5);

    // CREATE SUPPORT
    let supportGeom = new T.CylinderGeometry(2, 2, 1);
    let support = new T.Mesh(supportGeom, yellowMat);
    support.position.set(11, 4.5, 0.5);
    
    // CREATE SUPPORT WEDGES
    let wedgeCurve = new T.Shape();
    wedgeCurve.moveTo(0,0);
    wedgeCurve.lineTo(1,0);
    wedgeCurve.lineTo(0, 1);
    let wedgeGeom = new T.ExtrudeGeometry(wedgeCurve, thinSettings);
    let wedges = new T.Group();
    for(var i = 0; i < 10; i++){
        let wedge = new T.Mesh(wedgeGeom, yellowMat);
        wedge.rotateOnAxis(new T.Vector3(0, 1, 0), 2*Math.PI/10 * i);
        wedge.translateX(2);
        wedges.add(wedge);
    }
    wedges.position.set(11, 3, 0.5);

    // CREATE HAMMER
    let hammerGeom = new T.CylinderGeometry(3.5, 3.5, 3);
    let hammer = new T.Mesh(hammerGeom, yellowMat);
    hammer.position.set(11, 1.5, 0.5);

    // FORM GROUPS

    driveGroup.add(hammer, wedges, driver, support)
    spinGroup.add(driveGroup, holder, arm, body, bodyTop,);
    rotGroup.add(arm, driveGroup, holder);

    whole_obj.add(spinGroup, rotGroup, connector, turnpoint, wheels);

    super(`Pile Driver-${piledriverObCtr++}`, whole_obj, [
      ["x", -5, 5, 5],
      ["z", -5, 5, 5],
      ["theta", 0, 360, 0],
      ["spin", 0, 360, 0],
      ["drive", 0, 3, 0],
      ["arm rotation", 0, 20, 0],
    ]);
    // As with the crane, we save the "excavator" group as the "whole object" of the GrExcavator class.
    // We also save the groups of each object that may be manipulated by the UI.
    this.whole_ob = whole_obj;
    this.drive = driveGroup;
    this.spin = spinGroup;
    this.arm = rotGroup;
    this.SCALE = SCALE;

    // put the object in its place
    let scale = params.size ? Number(params.size) : 1;
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    whole_obj.scale.set(scale * SCALE, scale * SCALE, scale * SCALE);
  }

  update(paramValues) {
    this.whole_ob.position.x = paramValues[0];
    this.whole_ob.position.z = paramValues[1];
    this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
    this.drive.position.y = paramValues[4];
    this.spin.translateX(-this.SCALE * 2);
    this.spin.rotation.y = degreesToRadians(paramValues[3]);
    this.spin.translateX(this.SCALE * 2);
    this.arm.translateY(this.SCALE * 20);
    this.arm.rotation.z = degreesToRadians(paramValues[5])
    this.arm.translateY(-this.SCALE * 20);
    this.arm.rotation.y = degreesToRadians(paramValues[3]);
  }

  stepWorld(step, timeOfDay) {
  }
}
