import { 
  CircleBufferGeometry,
  CircleGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  Vector2,
  VertexColors,
} from '../lib/three/build/three.module.js';
import { Line2 } from '../lib/three/examples/jsm/lines/Line2.js';
import { LineMaterial } from '../lib/three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from '../lib/three/examples/jsm/lines/LineGeometry.js';

const defaultSegments = 64;
const defaultLineWidth = 2;
const defaultLineColor = 0x000000;

/** 
 * Cache of circle outlines, so they can be cloned once created.
 * They are identified by a string made out of the radius and color.
 */
const circleCache = {};

/**
 * The line material for all shapes.
 */
const lineMaterial = new LineMaterial({
  color: new Color(defaultLineColor),
  linewidth: defaultLineWidth,
  vertexColors: VertexColors,
  dashed: false,
  resolution: new Vector2(window.innerWidth, window.innerHeight),
});

/**
 * Recalculate material so the line thickness remains the same for vertical 
 * and horizontal lines.
 */
export function setLineMaterialResolution() {
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
}

/** 
 * Create a line along a path of coordinates.
 * @param {Array} points An array of Vector2 points.
 * @param {Number} points.x
 * @param {Number} points.y
 * @param {Number} color Color of the line.
 * @returns {Object} Line2 three.js object.
 */
export function createShape(points = [], color = defaultLineColor) {
  const geometry = new LineGeometry();
  const line2 = new Line2(geometry, lineMaterial);
  line2.name = 'shape';
  redrawShape(line2, points, color);
  return line2;
}

/** 
 * Draw a line along a path of coordinates on an existing Line2.
 * @param {Object} line2 Line2 mesh line.
 * @param {Array} points An array of point objects.
 * @param {Number} points.x
 * @param {Number} points.y
 * @param {Number} color Color of the line.
 * @returns {Object} Line2 three.js object.
 */
export function redrawShape(line2, points = [], color = defaultLineColor) {
  if (points.length) {
    const col = new Color(color);
    const positions = points.reduce((acc, p) => [ ...acc, p.x, p.y, 0 ], []);
    const colors = points.reduce((acc, p) => [ ...acc, col.r, col.g, col.b ], []);
    line2.geometry.dispose();
    line2.geometry = new LineGeometry();
    line2.geometry.setPositions(positions);
    line2.geometry.setColors(colors);
    line2.computeLineDistances();
    line2.scale.set(1, 1, 1);
    line2.userData.points = points;
  }

  return line2;
}

/** 
 * Draw a circle outline.
 * @param {Number} radius Circle radius.
 * @param {Number} color Circle color.
 * @return {Object} Line2 3D object.
 */
export function createCircleOutline(radius, color = defaultLineColor) {

  // check if the circle already exists in cache
  const cacheId = `c${radius}_${color}`;
  if (circleCache[cacheId]) {
    const clone = circleCache[cacheId].clone();
    clone.userData = { ...circleCache[cacheId].userData };
    return clone;
  }
  
  // create a circle, just for it's vertice points
  const circle = new CircleGeometry(radius, defaultSegments);
  const vertices = circle.vertices;

  // remove first point which is the center of the circle
  vertices.shift();

  // copy the first to the end so the cirle is closed
  vertices.push(vertices[0].clone());

  // create the geometry and line
  const geometry = new LineGeometry();
  const line2 = new Line2(geometry, lineMaterial);
  line2.name = 'circle_outline';
  redrawShape(line2, vertices, color);

  // add the circle to the cache
  circleCache[cacheId] = line2;

  return line2;
}
