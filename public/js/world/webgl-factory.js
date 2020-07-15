import { createCircleOutline, createShape } from './webgl-helper.js';

/**
 * Create a 3D mesh on basis of the configuration data.
 * @param {String} bodyId ID for the physics body and name for the 3D mesh.
 * @param {Object} bodyConfig Configuration for this body from the state.
 * @returns {Object} 3D mesh.
 */
export function createMesh(bodyId, bodyConfig) {
  const { fixtures, x, y, z = 0, } = bodyConfig;
  const { type = 'box', r = 1, w = 1, h = 1 } = fixtures[0];
  let mesh;

  switch (type) {
    case 'circle':
      mesh = createCircleOutline(r);
      break;
    
    case 'box':
      mesh = createShape([
        { x: w * -0.5, y: h * -0.5 },
        { x: w *  0.5, y: h * -0.5 },
        { x: w *  0.5, y: h *  0.5 },
        { x: w * -0.5, y: h *  0.5 },
      ]);
      break;

    default:
      // all other shapes
  }
  
  mesh.position.set(x, y, z);
  mesh.name = bodyId;
  return mesh;
}
