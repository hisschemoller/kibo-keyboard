import { getWorld } from './physics.js';

const { 
  Box, 
  Circle, 
  GearJoint, 
  MotorJoint, 
  MouseJoint, 
  PrismaticJoint, 
  RevoluteJoint, 
  WeldJoint, 
  Vec2, 
} = planck;

/**
 * Create a physics body.
 * @param {String} bodyId ID of the new physics body.
 * @param {Object} config Bodies and fixtures configuration.
 * @param {Object} data 
 * @returns {Object} Physics body.
 */
export function createPhysicsBody(bodyId, bodyConfig, data = {}) {
  const world = getWorld();
  const {
    angle = 0,
    fixedRotation = false,
    fixtures = [],
    type = 'dynamic',
    x = 0,
    y = 0,
  } = bodyConfig;
  const {
    performerId = null,
  } = data;

  const bodyDefinition = {
    // angularDamping: 0.9,
    // linearDamping: 0.1,
    position: Vec2(x, y),
    angle,
    type,
    fixedRotation,
  };

  const body = world.createBody(bodyDefinition);
  world.bodies.allIds.push(bodyId);
  world.bodies.byId[bodyId] = body;

  fixtures.forEach(fixture => {
    const fixtureDefinition = createFixtureDefinition(fixture);
    body.createFixture(fixtureDefinition);
  });

  body.setUserData({ angle, bodyId, performerId, x, y, });
  return body;
}

/**
 * Create a physics joint.
 *
 * @param {String} jointId  ID for the new joint.
 * @param {Object} config  Joint configuration.
 * @param {Object} bodies Object with references to all the performer's bodies.
 */
export function createPhysicsJoint(jointId = 'NO_ID', jointConfig, data = {}) {
  const {
    nameA,
    nameB,
    type,
    x = 0, 
    y = 0,
  } = jointConfig;
  const {
    performerId = null,
  } = data;

  const world = getWorld();
  const bodyA = world.bodies.byId[nameA];
  const bodyB = world.bodies.byId[nameB];
  const anchor = Vec2(x, y);
  let jointDefinition = {};
  let joint;
  switch (type) {
    case 'revolute': {
        const { 
          enableLimit = false, 
          enableMotor = false, 
          lowerAngle, 
          maxMotorForce, 
          maxMotorTorque, 
          motorSpeed, 
          upperAngle, 
        } = jointConfig;

        const jointDefinition = { enableMotor, motorSpeed, maxMotorForce, maxMotorTorque, };

        // angle limit
        if (enableLimit) {
          jointDefinition.enableLimit = true;
          if (!isNaN(lowerAngle)) {
            jointDefinition.lowerAngle = lowerAngle;
          }
          if (!isNaN(upperAngle)) {
            jointDefinition.upperAngle = upperAngle;
          }
        }

        joint = RevoluteJoint(jointDefinition, bodyA, bodyB, anchor);
      }
      break;
    case 'gear': {
        const { jointIdA, jointIdB, ratio } = jointConfig;
        const jointA = world.joints.byId[jointIdA];
        const jointB = world.joints.byId[jointIdB];
        joint = GearJoint({}, bodyA, bodyB, jointA, jointB, ratio);
      }
      break;
    case 'motor': {
        const { maxForce, maxTorque, } = jointConfig;
        const jointDefinition = {maxForce, maxTorque, };
        joint = MotorJoint(jointDefinition, bodyA, bodyB);
      }
      break;
    case 'mouse': {
        const { maxForce, } = jointConfig;
        joint = MouseJoint({ maxForce, }, bodyA, bodyB, anchor);
      }
      break;
    case 'prismatic': {
        const { axisX, axisY, enableLimit, lowerTranslation, upperTranslation, } = jointConfig;
        const axis = Vec2(axisX, axisY);
        if (enableLimit) {
          jointDefinition = { enableLimit, lowerTranslation, upperTranslation, };
        }
        joint = PrismaticJoint(jointDefinition, bodyA, bodyB, anchor, axis);
      }
      break;
    case 'weld':
      const { dampingRatio = 0, frequencyHz = 0, } = jointConfig;
      joint = WeldJoint({ dampingRatio, frequencyHz }, bodyA, bodyB, anchor);
      break;
  }
  
  world.createJoint(joint);
  world.joints.allIds.push(jointId);
  world.joints.byId[jointId] = joint;

  joint.setUserData({ performerId, });

  return joint;
}

/**
 * Destroy a body.
 * @param {String} bodyId 
 * @returns {Boolean} True id body with the ID existed.
 */
export function destroyPhysicsBody(bodyId) {
  const world = getWorld();
  const bodyIndex = world.bodies.allIds.indexOf(bodyId);
  if (bodyIndex > -1) {
    const body = world.bodies.byId[bodyId];
    world.destroyBody(body);
    world.bodies.allIds.splice(bodyIndex, 1);
    delete world.bodies.byId[bodyId];
    return true;
  }
  return false;
}

/**
 * Destroy a joint.
 * @param {String} jointId 
 * @returns {Boolean} True if joint with the ID existed.
 */
export function destroyPhysicsJoint(jointId) {
  const world = getWorld();
  const jointIndex = world.joints.allIds.indexOf(jointId);
  if (jointIndex > -1) {
    const joint = world.joints.byId[jointId];
    world.destroyJoint(joint);
    world.joints.allIds.splice(jointIndex, 1);
    delete world.joints.byId[jointId];
    return true;
  }
  return false;
}


/**
 * Create a fixture definition object.
 *
 * @export
 * @param {Object} fixtureConfig Configuration for the fixture.
 * @returns {Object} Fixture definition.
 */
function createFixtureDefinition(fixtureConfig) {
  const { 
    type = 'box',
    w = 1,
    h = 1,
    r = 1,
    cx = 0,
    cy = 0,
    angle = 0,
    density = 1,
    friction = 0.3,
    restitution = 0.6,
    filterCategoryBits = 0x0001,
    filterMaskBits = 0x0001,
    isSensor = false,
    userData = {}
  } = fixtureConfig;

  let shape;

  switch (type) {
    case 'circle':
    case 'sphere':
      shape = Circle(r);
      break;
    
    case 'box':
    default:
      // A box is first translated to the center vector, 
      // and then rotated around it's center
      shape = Box(w / 2, h / 2, Vec2(cx, cy), angle);
      break;
  }

  const fixtureDefinition = { shape, density, friction, restitution, filterCategoryBits, filterMaskBits, isSensor, userData, };

  return fixtureDefinition;
}
