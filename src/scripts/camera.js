import * as THREE from 'three';

// -- Constants --
const DEG2RAD = Math.PI / 180.0;
const RIGHT_MOUSE_BUTTON = 2;

// Camera constraints
const CAMERA_SIZE = 20;
const MIN_CAMERA_RADIUS = 5;
const MAX_CAMERA_RADIUS = 30;
const MIN_CAMERA_ELEVATION = 15;
const MAX_CAMERA_ELEVATION = 75;

// Camera sensitivity
const AZIMUTH_SENSITIVITY = 0.3;
const ELEVATION_SENSITIVITY = 0.3;
const ZOOM_SENSITIVITY = 0.001;
const PAN_SENSITIVITY = -0.05;

const Y_AXIS = new THREE.Vector3(0, 1, 0);

export class CameraManager {
  constructor() {
    const aspect = window.ui.gameWindow.clientWidth / window.ui.gameWindow.clientHeight;

    this.camera = new THREE.OrthographicCamera(
      (CAMERA_SIZE * aspect) / -2,
      (CAMERA_SIZE * aspect) / 2,
      CAMERA_SIZE / 2,
      CAMERA_SIZE / -2, 1, 1000);
    this.camera.layers.enable(1);
    
    this.cameraOrigin = new THREE.Vector3(16, 0, 16);
    this.cameraRadius = 15.0;
    this.cameraAzimuth = 225;
    this.cameraElevation = 30;

    this.updateCameraPosition();

    window.ui.gameWindow.addEventListener('wheel', this.onMouseScroll.bind(this), false);
    window.ui.gameWindow.addEventListener('mousedown', this.onMouseMove.bind(this), false);
    window.ui.gameWindow.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  /**
    * Applies any changes to camera position/orientation
    */
  updateCameraPosition() {
    const phi = this.cameraAzimuth * DEG2RAD;
    const theta = this.cameraElevation * DEG2RAD;
    
    this.camera.position.x = this.cameraRadius * Math.sin(phi) * Math.cos(theta);
    this.camera.position.y = this.cameraRadius * Math.sin(theta);
    this.camera.position.z = this.cameraRadius * Math.cos(phi) * Math.cos(theta);
    
    this.camera.position.add(this.cameraOrigin);
    
    this.camera.zoom = 20 / this.cameraRadius;
    
    this.camera.lookAt(this.cameraOrigin);
    
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
  }

  /**
   * Event handler for `mousemove` event
   * @param {MouseEvent} event Mouse event arguments
   */
  onMouseMove(event) {
    if (event.buttons & RIGHT_MOUSE_BUTTON && !event.ctrlKey) {
      this.cameraAzimuth = (this.cameraAzimuth - (event.movementX * AZIMUTH_SENSITIVITY)) % 360;
      this.cameraElevation += event.movementY * ELEVATION_SENSITIVITY;
      this.cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, this.cameraElevation));
      this.updateCameraPosition();
    }

    if (event.buttons & RIGHT_MOUSE_BUTTON && event.ctrlKey) {
      const forward = new THREE.Vector3(
        Math.sin(this.cameraAzimuth * DEG2RAD),
        0,
        Math.cos(this.cameraAzimuth * DEG2RAD)
      );
      const right = new THREE.Vector3(
        Math.cos(this.cameraAzimuth * DEG2RAD),
        0,
        -Math.sin(this.cameraAzimuth * DEG2RAD)
      );
      
      this.cameraOrigin.add(forward.multiplyScalar(-event.movementY * PAN_SENSITIVITY));
      this.cameraOrigin.add(right.multiplyScalar(-event.movementX * PAN_SENSITIVITY));
      this.updateCameraPosition();
    }
  }

  /**
   * Event handler for `wheel` event
   * @param {MouseEvent} event Mouse event arguments
   */
  onMouseScroll(event) {
    this.cameraRadius *= 1 - (event.deltaY * ZOOM_SENSITIVITY);
    this.cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, this.cameraRadius));
    this.updateCameraPosition();
  }

  resize() {
    const aspect = window.ui.gameWindow.clientWidth / window.ui.gameWindow.clientHeight;
    this.camera.left = (CAMERA_SIZE * aspect) / -2;
    this.camera.right = (CAMERA_SIZE * aspect) / 2;
    this.camera.updateProjectionMatrix();
  }
}