import * as THREE from "three";
import * as TrackballControls from "three-trackballcontrols";


// World class: hold essential components of 3D world
export default class World {
    constructor(elementId, size, antialias=true, color="#ffffff") {
        // Initialize the World
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.lights = [];
        this.renderer = new THREE.WebGLRenderer({ antialias: antialias });
        this.renderer.setPixelRatio(window.devicePixelRatio); // fix resolution
        this.renderer.setSize(size.width, size.height);
        this.renderer.setClearColor(new THREE.Color(color));
        document.getElementById(elementId).appendChild(this.renderer.domElement);

        // Disable scroll on WebGL element (for zooming)
        ["touchmove", "mousemove", "wheel", "wheel.zoom"].forEach(eventName => {
            document.getElementById(elementId).addEventListener(eventName, e => e.preventDefault(), { passive: false });
        });
    }

    // Add camera to the world
    addCamera = (position, up, target, aspect, fov=45, near=0.1, far=1000) => {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(...position);
        camera.up.set(...up);
        camera.lookAt(target);

        this.camera = camera;
        this.scene.add(this.camera);
    }

    // Add ambient light to the world
    addAmbientLight = (color="#ffffff") => {
        const ambientLight = new THREE.AmbientLight(color);
        this.lights.push(ambientLight);
        this.scene.add(ambientLight);
    }

    // Add spot light to the world
    addSpotLight = (position, color="#ffffff") => {
        const spotLight = new THREE.SpotLight(color);
        spotLight.position.set(...position);
        this.lights.push(spotLight);
        this.scene.add(spotLight);
    }

    // Render the world using its renderer, scene, and camera
    render = () => {
        this.renderer.render(this.scene, this.camera);
    }

    // Update the world's controls
    updateControls = () => {
        this.controls.update(this.clock.getDelta());
    }

    // Clip the world
    clip = (normal, distance) => {
        const plane = new THREE.Plane(new THREE.Vector3(...normal), distance);
        this.renderer.clippingPlanes.push(plane);
    }

    // Add axis to the world
    addAxis = axisSize => {
        this.axis = new THREE.AxesHelper(axisSize);
        this.scene.add(this.axis);
    }

    // Add Grid to the world
    addGrid = (size, divisions) => {
        this.gridHelper = new THREE.GridHelper(size, divisions);
        this.gridHelper.rotation.x = Math.PI / 2; // draw on x-y plane
        this.scene.add(this.gridHelper);
    }

    // Add trackball controls to the world
    addTrackball = (rotateSpeed=1.0, zoomSpeed=1.0, panSpeed=1.0, staticMoving=true) => {
        // assumes that camera is already added to the world
        const trackballControls = new TrackballControls(this.camera);
        trackballControls.rotateSpeed = rotateSpeed;
        trackballControls.zoomSpeed = zoomSpeed;
        trackballControls.panSpeed = panSpeed;
        trackballControls.staticMoving = staticMoving;

        this.controls = trackballControls;
    }

    // Add rectangle mesh to the world
    addRect = (v1, v2, v3, v4, material) => {
        const planeGeometry = new THREE.Geometry();
        // add vertices
        [v1, v2, v3, v4].forEach(v => planeGeometry.vertices.push(v));
        // add faces
        planeGeometry.faces.push(new THREE.Face3(0, 1, 2));
        planeGeometry.faces.push(new THREE.Face3(2, 3, 0));
        planeGeometry.computeFaceNormals();

        // mesh
        const plane = new THREE.Mesh( planeGeometry, material );
        this.scene.add(plane);
    }

    // Add Rect with basic material
    addBasicRect = (v1, v2, v3, v4, color) => {
        // material
        const basicMaterial = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            wireframe: false
        });
        // mesh
        this.addRect(v1, v2, v3, v4, basicMaterial);
    }

    // Add Rect with normal material
    addNormalRect = (v1, v2, v3, v4) => {
        // material
        const normalMaterial = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
        })
        // mesh
        this.addRect(v1, v2, v3, v4, normalMaterial);
    }

    // Add box
    addBox = (size, position, color) => {
        const boxGeometry = new THREE.BoxGeometry(...size);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: color, wireframe: false });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(...position);
        this.scene.add(box);
    }

    // Add points
    addPoints = (name, size, shape, texture, pointSize=1.5) => {
        const planeGeometry = new THREE.PlaneGeometry(
            size.width, size.height, // width, height
            shape[0], shape[1] // # of Segments
        );
        const planeMaterial = new THREE.PointsMaterial({
            size: pointSize,
            sizeAttenuation: true,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            map: texture
        });
        const plane = new THREE.Points(planeGeometry, planeMaterial);
        plane.sortParticles = true;
        plane.name = name;
        this.scene.add(plane);
    }

    // Update point height
    updatePointHeight = (name, heightArray) => {
        const mesh = this.scene.getObjectByName(name);
        console.assert(
            mesh.geometry.vertices.length == heightArray.length,
            "updatePointHeight: Different length..."
        );

        // Update
        mesh.geometry.vertices.forEach((v, i) => {
            v.setZ(heightArray[i]);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.computeFaceNormals();
    }

    // Add wireframe
    addWireframe = (name, size, shape, color=0x2260ff) => {
        // Geometry
        const wireframeGeometry = new THREE.PlaneGeometry(
            size.width, size.height, // width, height
            shape[0], shape[1] // Segments
        );
         // Material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        // Mesh
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wireframe.name = name;
        this.scene.add(wireframe);
    }

    // Remove all objects
    removeAll = () => {
        while(this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }
    }
}
