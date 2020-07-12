import { dispatch, getActions, STATE_CHANGE, } from '../store/store.js';
import addWindowResizeCallback from '../view/windowresize.js';
import { 
  AmbientLight,
  DirectionalLight,
  Group,
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
} from '../lib/three.module.js';

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
  // document.addEventListener('keydown', onKeyUpDown);
  // document.addEventListener('keyup', onKeyUpDown);
  // renderer.domElement.addEventListener('touchstart', onMouseDown);
  // renderer.domElement.addEventListener('mousedown', onMouseDown);
  // renderer.domElement.addEventListener('touchmove', onMouseMove);
  // renderer.domElement.addEventListener('mousemove', onMouseMove);
  // renderer.domElement.addEventListener('touchend', onMouseUp);
  // renderer.domElement.addEventListener('mouseup', onMouseUp);
  addWindowResizeCallback(onWindowResize);
}

/**
 * Store reference to mesh in each physics body for efficient draw loop.
 * @param {Object} world Physics world.
 */
export function connectPhysicsAnd3D(world) {
  
}

/**
 * App's state has changed.
 * @param {Object} e CustomEvent from Store when state has been updated.
 */
function onStateChange(e) {
  const { state, action, actions, } = e.detail;
  switch (action.type) {
  }
}

/**
 * Window resize event handler.
 */
function onWindowResize() {
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

  // orbitControls.saveState();
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
  onWindowResize();
}

/**
 * Create the 3D scene, lights, cameras.
 */
function setupWebGLWorld() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xeeeeee);
  
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

  // const ambientLight = new AmbientLight(0xffffff);
  // scene.add(ambientLight);

  // const directionalLight = new DirectionalLight(0xffffff, 0.5);
  // directionalLight.position.set(-0.5, 0.5, -1.5).normalize();
  // scene.add(directionalLight);
  
  plane = new Plane();
  plane.name = 'plane';
  plane.setFromNormalAndCoplanarPoint(
    camera.getWorldDirection(plane.normal),
    new Vector3(0,0,0));

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