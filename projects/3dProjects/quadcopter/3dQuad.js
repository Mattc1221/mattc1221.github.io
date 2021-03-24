/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";


let renderer = new T.WebGLRenderer();
renderer.setSize(600, 400);
document.body.appendChild(renderer.domElement);

let scene = new T.Scene();
let camera = new T.PerspectiveCamera(
    40,
    renderer.domElement.width / renderer.domElement.height,
    1,
    1000
);

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 5;
camera.lookAt(0, 0, 0);

// since we're animating, add OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new T.AmbientLight("white", 0.2));

// two lights - both a little off white to give some contrast
let dirLight1 = new T.DirectionalLight(0xf0e0d0, 1);
dirLight1.position.set(1, 1, 0);
scene.add(dirLight1);

let dirLight2 = new T.DirectionalLight(0xd0e0f0, 1);
dirLight2.position.set(-1, 1, -0.2);
scene.add(dirLight2);

// make a ground plane
let groundBox = new T.BoxGeometry(10, 0.55, 10);
let groundMesh = new T.Mesh(
    groundBox,
    new T.MeshStandardMaterial({ color: 0x88b888, roughness: 0.9 })
);
// put the top of the box at the ground level (0)
groundMesh.position.y = -1;
scene.add(groundMesh);

let rain = [];

// ====== QUADCOPTER ======
// materials
let bladeMat = new T.MeshPhysicalMaterial({ color: "black" });
let blades = [];
const RADIUS = 0.3
function createCopter() {
    // body
    let bodyGeom = new T.SphereGeometry(RADIUS, 10, 10);
    let bodyMat = new T.MeshPhysicalMaterial({ color: "white" });
    let copterGroup = new T.Group();
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            let bodyMesh = new T.Mesh(bodyGeom, bodyMat);
            let varianceX = (Math.random() < 0.5 ? Math.random() : -Math.random()) * RADIUS;
            let varianceY = (Math.random() < 0.5 ? Math.random() : -Math.random()) * RADIUS;
            bodyMesh.position.x = (i + varianceX - 1) * RADIUS;
            bodyMesh.position.z = (j + varianceY - 1) * RADIUS;
            copterGroup.add(bodyMesh);
        }
    }
    // arms
    let armGeom = new T.BoxGeometry(2, 0.05, 0.05);
    let upperArmGeom = new T.BoxGeometry(0.05, 0.3, 0.05);
    let bladGeom = new T.BoxGeometry(0.4, 0.02, 0.02);
    let armMat = new T.MeshPhysicalMaterial({ color: "grey", wireframe: true });
    for (var i = 0; i < 4; i++) {
        let theta = (Math.PI * (i + 1)) / 2 + Math.PI / 4;
        let armMesh = new T.Mesh(armGeom, armMat);
        let armMesh2 = new T.Mesh(upperArmGeom, armMat);
        let bladeMesh = new T.Mesh(bladGeom, bladeMat);
        armMesh.rotateOnAxis(new T.Vector3(0, 1, 0), theta);
        armMesh2.rotateOnAxis(new T.Vector3(0, 1, 0), theta);
        bladeMesh.rotateOnAxis(new T.Vector3(0, 1, 0), theta);
        armMesh2.translateX(1);
        bladeMesh.translateX(1);
        armMesh2.position.y = 0.1;
        bladeMesh.position.y = 0.25;
        copterGroup.add(bladeMesh);
        copterGroup.add(armMesh2);
        copterGroup.add(armMesh);
        blades.push(bladeMesh);
    }


    copterGroup.position.y = 1;
    copterGroup.rotateOnAxis(new T.Vector3(0, 1, 0), -Math.PI / 4);
    return copterGroup;
}
let copterGroup = createCopter();
let copterGroup2 = createCopter();
scene.add(copterGroup);
scene.add(copterGroup2);

// ====== SUN ======
let sunGroup = new T.Group();
let sunGeom = new T.SphereGeometry(0.5, 20, 20);
let sunMat = new T.MeshPhysicalMaterial({ color: "yellow" });
let sunMesh = new T.Mesh(sunGeom, sunMat);
let flareGeom = new T.ConeGeometry(0.2, 0.5);
let flareMat = new T.MeshPhysicalMaterial({ color: "orange" });
for (var i = 0; i < 20; i++) {
    let flareMesh = new T.Mesh(flareGeom, flareMat);
    flareMesh.rotateOnAxis(new T.Vector3(0, 0, 1), Math.PI * 2 * (i / 20));
    flareMesh.translateX(0.4);
    sunGroup.add(flareMesh);
}
let eyeGeom = new T.SphereGeometry(0.1, 10, 10);
let eye1 = new T.Mesh(eyeGeom, bladeMat);
let eye2 = new T.Mesh(eyeGeom, bladeMat);
let eyes = new T.Group();
eye1.translateX(-.2);
eye2.translateX(.2);
eyes.add(eye1);
eyes.add(eye2);
eyes.translateZ(.4);


sunGroup.position.y = 3;
sunGroup.add(sunMesh);
sunGroup.add(eyes);
scene.add(sunGroup);

let prevTheta;
// animation loop
function animateLoop(timestamp) {
    let theta = timestamp / 1000;
    let x = 3 * Math.cos(theta);
    let z = 3 * Math.sin(theta);
    copterGroup.position.x = x;
    copterGroup.position.z = z;
    copterGroup2.position.x = -(x * 0.8 + 1);
    copterGroup2.position.z = -(z * 0.8 + 1);

    let rotation = theta - (prevTheta ? prevTheta : 0);

    blades.forEach(function (b) {
        b.rotateOnAxis(new T.Vector3(0, 1, 0), rotation * 100);
    })
    copterGroup.rotateOnAxis(new T.Vector3(0, 1, 0), -rotation);
    copterGroup2.rotateOnAxis(new T.Vector3(0, 1, 0), -rotation);
    copterGroup.position.y = Math.cos(theta * 2) + 1;
    sunGroup.lookAt(copterGroup.position.x, copterGroup.position.y, copterGroup.position.z);
    genRain(copterGroup.position.x, copterGroup.position.y, copterGroup.position.z);
    updateRain();


    prevTheta = theta;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animateLoop);
}
window.requestAnimationFrame(animateLoop);


let rainGeom = new T.CylinderGeometry(0.01, 0.01, 0.1);
let rainMat = new T.MeshPhysicalMaterial({ color: "blue" });
function genRain(x, y, z) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            let rainMesh = new T.Mesh(rainGeom, rainMat);
            let varianceX = (Math.random() < 0.5 ? Math.random() : -Math.random()) * RADIUS;
            let varianceY = (Math.random() < 0.5 ? Math.random() : -Math.random()) * RADIUS;
            rainMesh.position.x = (i + varianceX - 1) * RADIUS + x;
            rainMesh.position.z = (j + varianceY - 1) * RADIUS + z;
            rainMesh.position.y = y;
            rain.push({ mesh: rainMesh, y: y, speed: Math.random() * 0.15 + 0.1 });
            scene.add(rainMesh);
        }
    }
}

function updateRain() {
    rain.filter((r) => r.y < -1).forEach(function (r) {
        scene.remove(r.Mesh);
    })
    rain = rain.filter((r) => r.y > -1);
    rain.forEach(function (r) {
        r.mesh.position.y -= r.speed;
        r.y -= r.speed;
    })
}