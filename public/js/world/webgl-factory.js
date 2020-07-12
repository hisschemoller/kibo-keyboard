import { 
  BoxGeometry, 
  BufferGeometry, 
  CylinderGeometry, 
  Geometry, 
  Mesh, 
  MeshLambertMaterial, 
  SphereGeometry 
} from '../lib/three.module.js';

/**
 * Create a 3D mesh on basis of the configuration data.
 * @param {String} bodyId ID for the physics body and name for the 3D mesh.
 * @param {Object} bodyConfig Configuration for this body from the state.
 * @returns {Object} 3D mesh.
 */
export function createMesh(bodyId, bodyConfig) {
  const { fixtures, x, y, z = 0, } = bodyConfig;

  const bufferGeometry = createGeometry(fixtures);
  const material = new MeshLambertMaterial({ color: 0x333333 });
  const mesh = new Mesh(bufferGeometry, material);
  mesh.position.set(x, y, z);
  mesh.name = bodyId;
  return mesh;
}

/**
 * 
 *
 * @param {Array} fixturesConfig
 * @returns {Object} bufferGeometry
 */
export function createGeometry(fixturesConfig = []) {
  const singleGeometry = new Geometry();

  fixturesConfig.forEach(fixture => {
    const { type = 'box', w = 1, h = 1, d = 1, cx = 0, cy = 0, angle = 0, r = 1 } = fixture;
    let geometry;

    switch (type) {
      case 'sphere':
        geometry = new SphereGeometry(r, 32, 32);
        break;
      
      case 'circle':
        geometry = new CylinderGeometry(r, r, d, 32);
        geometry.rotateX(Math.PI * 0.5)
        break;

      case 'box':
      default:
        geometry = new BoxGeometry(w, h, d);
    }

    geometry.rotateZ(angle);
    geometry.translate(cx, cy, 0);
    const mesh = new Mesh(geometry);
    mesh.updateMatrix();
    singleGeometry.merge(mesh.geometry, mesh.matrix);
  });

  const bufferGeometry = new BufferGeometry();
  bufferGeometry.fromGeometry(singleGeometry);
  return bufferGeometry;
}
