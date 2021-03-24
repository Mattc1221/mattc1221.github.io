/*jshint esversion: 6 */
// @ts-check

/**
 *
 * CS559 3D World Framework Code
 *
 * Simple Example Objects - they don't do much, but for convenience they
 * provide wrappers around THREE objects
 *
 * @module SimpleObjects
 */

// we need to have the BaseClass definition
import { GrObject } from "./GrObject.js";
import * as T from "../CS559-Three/build/three.module.js";

let simpleObjectCounter = 0;

/**
 * we pass a set of properties to a cube to allow for flexible parameters
 *
 * @typedef CubeProperties
 * @type {object}
 * @property {THREE.Material} [material]
 * @property {string | number} [color]
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 * @property {number} [widthSegments=8] - only for Sphere
 * @property {number} [heightSegments=6] - only for Sphere
 */

/**
 * A simple GrObject: A cube - allows for setting various parameters as parameters
 */
export class GrCube extends GrObject {
  /**
   * @param {CubeProperties} params
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = undefined) {
    let material;
    if (params.material) {
      material = params.material;
    } else if (params.color) {
      material = new T.MeshStandardMaterial({ color: params.color });
    } else {
      material = new T.MeshStandardMaterial({ color: "#FF8888" });
    }
    let hs = params.heightSegments || 1;
    let ws = params.widthSegments || 1;
    let geom = new T.BoxGeometry(params.size, params.size, params.size, ws, hs);
    let mesh = new T.Mesh(geom, material);
    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this

    super(`Cube-${simpleObjectCounter++}`, mesh, paramInfo);

    // put the object in its place
    mesh.position.x = params.x ? Number(params.x) : 0;
    mesh.position.y = params.y ? Number(params.y) : 0;
    mesh.position.z = params.z ? Number(params.z) : 0;
  }
}

/**
 * A simple object: A sphere (not it uses the CubeParams, since they apply as well)
 */
export class GrSphere extends GrObject {
  /**
   * @param {CubeProperties} params
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params, paramInfo) {
    let material;
    if (params.material) {
      material = params.material;
    } else if (params.color) {
      material = new T.MeshStandardMaterial({ color: params.color });
    } else {
      material = new T.MeshStandardMaterial({ color: "#FF8888" });
    }
    let geom = new T.SphereBufferGeometry(
      params.size ? params.size / 2.0 : 1.0,
      params.widthSegments ? params.widthSegments : 8,
      params.heightSegments ? params.heightSegments : 6
    );

    let mesh = new T.Mesh(geom, material);
    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this

    super(`Sphere-${simpleObjectCounter++}`, mesh, paramInfo);

    // put the object in its place
    mesh.position.x = params.x ? Number(params.x) : 0;
    mesh.position.y = params.y ? Number(params.y) : 0;
    mesh.position.z = params.z ? Number(params.z) : 0;
  }
}

/**
 * A simple object: a rectangle/square (flat) - useful for making signs
 */
export class GrSquareSign extends GrObject {
  /**
   *
   * @param {Object} [params]
   * @param {string | number} [params.color]
   * @param {THREE.Texture} [params.map]
   * @param {THREE.Material} [params.material]
   * @param {number} [params.x]
   * @param {number} [params.y]
   * @param {number} [params.z]
   * @param {number} [params.size]
   * @param {Array<string|Array>} [paramInfo ]
   */
  constructor(params = {}, paramInfo = []) {
    // make a square out of triangles
    let geom = new T.Geometry();
    let size = params.size || 0.5;
    geom.vertices.push(new T.Vector3(-size, -size, 0));
    let uv0 = new T.Vector2(0, 0);
    geom.vertices.push(new T.Vector3(size, -size, 0));
    let uv1 = new T.Vector2(1, 0);
    geom.vertices.push(new T.Vector3(-size, size, 0));
    let uv2 = new T.Vector2(0, 1);
    geom.vertices.push(new T.Vector3(size, size, 0));
    let uv3 = new T.Vector2(1, 1);
    geom.faces.push(new T.Face3(0, 1, 2));
    geom.faces.push(new T.Face3(1, 3, 2));
    geom.computeFaceNormals();
    geom.faceVertexUvs = [
      [
        [uv0, uv1, uv2],
        [uv1, uv3, uv2]
      ]
    ];
    let material;
    if (params.material) {
      material = params.material;
    } else {
      let matprops = { side: T.DoubleSide };
      matprops.color = params.color ? params.color : 0xffffff;
      if (params.map) matprops.map = params.map;
      material = new T.MeshStandardMaterial(matprops);
      console.log(matprops);
    }
    let mesh = new T.Mesh(geom, material);
    super(`SquareSign-${simpleObjectCounter++}`, mesh, paramInfo);
    // put the object in its place
    mesh.position.x = params.x ? Number(params.x) : 0;
    mesh.position.y = params.y ? Number(params.y) : 0;
    mesh.position.z = params.z ? Number(params.z) : 0;
  }
}

/**
 * A "simple" object (TorusKnot) - this is built into THREE, so the code here is simple,
 * but the object itself has non-simple appearance
 */
export class GrTorusKnot extends GrObject {
  /**
   * @param {Object} [params]
   * @param {string | number} [params.color]
   * @param {THREE.Material} [params.material]
   * @param {number} [params.x]
   * @param {number} [params.y]
   * @param {number} [params.z]
   * @param {number} [params.size]
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = []) {
    let material;
    if (params.material) {
      material = params.material;
    } else if (params.color) {
      material = new T.MeshStandardMaterial({ color: params.color });
    } else {
      material = new T.MeshStandardMaterial({ color: "#FF8888" });
    }
    let geom = new T.TorusKnotBufferGeometry();
    let mesh = new T.Mesh(geom, material);
    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this

    super(`TorusKnot-${simpleObjectCounter++}`, mesh, paramInfo);

    // put the object in its place
    mesh.position.x = params.x ? Number(params.x) : 0;
    mesh.position.y = params.y ? Number(params.y) : 0;
    mesh.position.z = params.z ? Number(params.z) : 0;

    // set size by scaling
    let size = params.size || 1.0;
    mesh.scale.set(size, size, size);
  }
}

/**
 * A "simple" object - a group
 * Remember that the framework doesn't actually handle hierarchy - you add THREE Object3D to the group
 */
export class GrGroup extends GrObject {
  /**
   * @param {Object} [params]
   * @param {number} [params.x]
   * @param {number} [params.y]
   * @param {number} [params.z]
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = []) {
    let group = new T.Group();

    super(`Group-${simpleObjectCounter++}`, group, paramInfo);

    // put the object in its place
    group.position.x = params.x ? Number(params.x) : 0;
    group.position.y = params.y ? Number(params.y) : 0;
    group.position.z = params.z ? Number(params.z) : 0;
  }
  /**
   * Add an Object3D to the group (not a GrObject!)
   *
   * @param {T.Object3D} obj
   */
  add(obj) {
    this.objects[0].add(obj);
  }
}

export class GrCylinder extends GrObject {
    /**
     * 
     * @param {*} params 
     * @param {Array<string|Array>} [paramInfo]
     */
    constructor(params, paramInfo) {
        let material;
        if (params.material) {
            material = params.material;
        } else if (params.color) {
            material = new T.MeshStandardMaterial( {color:params.color} );
        } else {
            material = new T.MeshStandardMaterial( {color: "#FF8888"});
        }
        let rad = params.radius ? params.radius : 1;
        let rtop = ("top" in params) ? params.top : rad;
        let rbottom = ("bottom" in params) ? params.bottom : rad;
        let height = params.height ? params.height : 1.0;
        let geom = new T.CylinderBufferGeometry(rtop, rbottom, height,
            params.widthSegments ? params.widthSegments : 8,
            params.heightSegments ? params.heightSegments : 6
        );
        
        let mesh = new T.Mesh(geom, material);
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this

        super(`Sphere-${simpleObjectCounter++}`,mesh,paramInfo);

        // put the object in its place
        mesh.position.x = params.x ? Number(params.x) : 0;
        mesh.position.y = params.y ? Number(params.y) : 0;
        mesh.position.z = params.z ? Number(params.z) : 0;
    }
}

