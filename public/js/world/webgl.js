import { dispatch, getActions, STATE_CHANGE, } from '../store/store.js';
import addWindowResizeCallback from '../view/windowresize.js';
import { connect3DAndPhysics, } from './physics.js';
import { createMesh } from './webgl-factory.js';
import { setLineMaterialResolution } from './webgl-helper.js';
import { 
  AmbientLight,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  // OrbitControls,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer 
} from '../lib/three/build/three.module.js';

let camera,
  canvasRect,
  intersection,
  isBackgroundDrag = false,
  mouseCoordinates,
  mousePoint,
  mousePointPrevious,
  orbitControls,
  plane,
  raycaster,
  renderer,
  rootEl,
  scene;
  
/**
 * Add event listeners.
 */
function addEventListeners() {
  document.addEventListener(STATE_CHANGE, onStateChange);
  addWindowResizeCallback(onWindowResize);
}

/**
 * Store reference to mesh in each physics body for efficient draw loop.
 * @param {Object} world Physics world.
 */
export function connectPhysicsAnd3D(world) {
  world.bodies.allIds.forEach(bodyId => {
    const body = world.bodies.byId[bodyId];
    if (scene.meshes.allIds.indexOf(bodyId) !== -1) {
      body.setUserData({ ...body.getUserData(), mesh: scene.getObjectByName(bodyId), });
    }
  });
}

/**
 * Create all performers that don't exist yet
 */
function createMeshes(state) {
  const { bodies, } = state;
  bodies.allIds.forEach(bodyId => {
    if (!scene.getObjectByName(bodyId) && bodies.byId[bodyId].fixtures) {
      const mesh = createMesh(bodyId, bodies.byId[bodyId]);
      scene.add(mesh);
      scene.meshes.allIds.push(bodyId);
      scene.meshes.byId[bodyId] = mesh;
    }
  });

  // store reference to mesh in each physics body for an efficient draw loop
  connect3DAndPhysics(scene);
}

/**
 * Delete all performers not fornd in the state anymore
 */
function deleteMeshes(state) {
  let i = scene.meshes.allIds.length;
  while (--i >= 0) {
    const bodyId = scene.meshes.allIds[i];
    if (state.bodies.allIds.indexOf(bodyId) === -1) {
      const mesh = scene.getObjectByName(bodyId);
      scene.remove(mesh);
      scene.meshes.allIds.splice(i, 1);
      delete scene.meshes.byId[bodyId];
    }
  }
}

/**
 * App's state has changed.
 * @param {Object} e CustomEvent from Store when state has been updated.
 */
function onStateChange(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {

    case actions.DELETE_BODIES:
      deleteMeshes(state);
      break;

    case actions.PLAY_NOTE:
      createMeshes(state);
      break;

    case actions.POPULATE:
      deleteMeshes(state);
      createMeshes(state);
      break;
  }
}

/**
 * Window resize event handler.
 * @param {Boolean} isFirstRun True if function is called as part of app setup.
 */
function onWindowResize(isFirstRun = false) {
  canvasRect = renderer.domElement.getBoundingClientRect();
  renderer.setSize(window.innerWidth, window.innerHeight - canvasRect.top);
  camera.aspect = window.innerWidth / (window.innerHeight - canvasRect.top);
  camera.updateProjectionMatrix();
  canvasRect = renderer.domElement.getBoundingClientRect();

  // move camera further back when viewport height increases so objects stay the same size 
  let scale = 0.01; // 0.15;
  let fieldOfView = camera.fov * (Math.PI / 180); // convert fov to radians
  let targetZ = canvasRect.height / (2 * Math.tan(fieldOfView / 2));

  camera.position.set(camera.position.x, camera.position.y, targetZ * scale);

  // line material needs to update to render correctly
  setLineMaterialResolution();

  // orbitControls.saveState();

  // new viewport size in 3D units at a given distance from the camera.
  // @see https://stackoverflow.com/questions/13350875/three-js-width-of-view/13351534#13351534
  const dist = camera.position.z;
  const vFOV = MathUtils.degToRad(camera.fov); // convert vertical fov to radians
  const visibleHeight = 2 * Math.tan( vFOV / 2 ) * dist;
  const visibleWidth = visibleHeight * camera.aspect;
  dispatch(getActions().resize(visibleWidth, visibleHeight));

  if (!isFirstRun) {
    dispatch(getActions().populate());
  }
}

/**
 * Render the 3D scene.
 */
export function renderScene() {
  renderer.render(scene, camera);
}

/**
 * General setup of the module.
 */
export function setup() {
  rootEl = document.querySelector('#canvas-container');

  setupWebGLWorld();
  addEventListeners();
  onWindowResize(true);
}

/**
 * Create the 3D scene, lights, cameras.
 */
function setupWebGLWorld() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  
  rootEl.appendChild(renderer.domElement);

  raycaster = new Raycaster();

  intersection = new Vector3();

  mouseCoordinates = new Vector2();
  mousePoint = new Vector2();

  scene = new Scene();
  scene.meshes = {
    allIds: [],
    byId: {},
  }

  camera = new PerspectiveCamera(45, 1, 1, 500);
  camera.name = 'camera';
  scene.add(camera);

  const ambientLight = new AmbientLight(0xffffff);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(-0.5, 0.5, -1.5).normalize();
  scene.add(directionalLight);
  
  plane = new Plane();
  plane.name = 'plane';
  plane.setFromNormalAndCoplanarPoint(
    camera.getWorldDirection(plane.normal),
    new Vector3(0, 0, 0));

  // mapping cable lines
  // const mappingCables = new Group();
  // mappingCables.name = 'mappingCables';
  // scene.add(mappingCables);

  // orbitControls = new OrbitControls(camera, renderer.domElement);
  // orbitControls.update();
  // orbitControls.saveState();
  // orbitControls.enabled = false;

  // const control = new TransformControls(camera, renderer.domElement);
}