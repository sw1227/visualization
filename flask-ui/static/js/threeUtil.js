// Manages the essential components of 3D world
var World = function(elementId, size, antialias=true, color="#ffffff") {

    // Initialize the World
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.lights = [];
    this.renderer = new THREE.WebGLRenderer({antialias: antialias});
    this.renderer.setSize(size.width, size.height);
    this.renderer.setClearColor(new THREE.Color(color));
    document.getElementById(elementId).appendChild(this.renderer.domElement);

    // Add camera to the world
    this.addCamera = function(position, up, target, aspect, fov=45, near=0.1, far=1000) {
        var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(...position);
        camera.up.set(...up);
        camera.lookAt(target);

        this.camera = camera;
        this.scene.add(this.camera);
    }

    // Add ambient light to the world
    this.addAmbientLight = function(color="#ffffff") {
        var ambientLight = new THREE.AmbientLight(color);
        this.lights.push(ambientLight);
        this.scene.add(ambientLight);
    }

    // Add spot light to the world
    this.addSpotLight = function(position, color="#ffffff") {
        var spotLight = new THREE.SpotLight(color);
        spotLight.position.set(...position);
        this.lights.push(spotLight);
        this.scene.add(spotLight);
    }

    // Render the world using its renderer, scene, and camera
    this.render = function() {
        this.renderer.render(this.scene, this.camera);
    }

    // Update the world's controls
    this.updateControls = function() {
        this.controls.update(this.clock.getDelta());
    }

    // Clip the world
    this.clip = function(normal, distance) {
        var plane = new THREE.Plane(new THREE.Vector3(...normal), distance);
        this.renderer.clippingPlanes.push(plane);
    }

    // Add axis to the world
    this.addAxis = function(axisSize) {
        this.axis = new THREE.AxesHelper(axisSize);
        this.scene.add(this.axis);
    }

    // Add Grid to the world
    this.addGrid = function(size, divisions) {
        this.gridHelper = new THREE.GridHelper(size, divisions);
        this.gridHelper.rotation.x = Math.PI / 2; // draw on x-y plane
        this.scene.add(this.gridHelper);
    }

    // Add trackball controls to the world
    this.addTrackball = function(rotateSpeed=1.0, zoomSpeed=1.0, panSpeed=1.0, staticMoving=true) {
        // assumes that camera is already added to the world
        var trackballControls = new THREE.TrackballControls(this.camera);
        trackballControls.rotateSpeed = rotateSpeed;
        trackballControls.zoomSpeed = zoomSpeed;
        trackballControls.panSpeed = panSpeed;
        trackballControls.staticMoving = staticMoving;

        this.controls = trackballControls;
    }

    // Add rectangle mesh to the world
    this.addRect = function(v1, v2, v3, v4, color) {
        var planeGeometry = new THREE.Geometry();
        // add vertices
        [v1, v2, v3, v4].forEach(v => planeGeometry.vertices.push(v));
        // add faces
        planeGeometry.faces.push(new THREE.Face3(0, 1, 2));
        planeGeometry.faces.push(new THREE.Face3(2, 3, 0));
        planeGeometry.computeFaceNormals();

        // material
        var planeMaterial = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            wireframe: false
        });
        // mesh
        var plane = new THREE.Mesh( planeGeometry, planeMaterial );
        this.scene.add(plane);
    }

    // Add box
    this.addBox = function(size, position, color) {
        var boxGeometry = new THREE.BoxGeometry(...size);
        var boxMaterial = new THREE.MeshLambertMaterial({ color: color, wireframe: false });
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(...position);
        this.scene.add(box);
    }
}


// Create a performance monitor in the given element
function createStats(statsId, mode=0) {
    var stats = new Stats();

    stats.setMode(mode); // mode - 0:fps, 1:ms
    document.getElementById(statsId).appendChild(stats.domElement);

    return stats;
}
