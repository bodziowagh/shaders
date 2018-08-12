const SCENE = {
	FRUSTUM: 75,
	WIDTH: window.innerWidth,
	HEIGHT: window.innerHeight,
	NEAR: 0.01,
	FAR: 100
};

const CONFIG = {
    camera: {
        autoRotate: false
    },
    rendererProps: {
        antialias: true
    }
};

let renderer, camera, scene, controls;
let box, octahedron, torus, uniforms;

function init() {
	function initWebGL() {
		renderer = new THREE.WebGLRenderer({ antialias: CONFIG.rendererProps });
		camera = new THREE.PerspectiveCamera(SCENE.FRUSTUM,
											 SCENE.WIDTH / SCENE.HEIGHT,
											 SCENE.NEAR,
											 SCENE.FAR);
		scene = new THREE.Scene();

		camera.position.set(16, 10, 16);
		camera.lookAt(new THREE.Vector3(0, 0, 0));

        controls = new THREE.OrbitControls(camera);
        controls.autoRotate = CONFIG.camera.autoRotate;
        controls.addEventListener("change", render);

		scene.add(camera);

		renderer.setSize(SCENE.WIDTH, SCENE.HEIGHT);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;

		document.body.appendChild(renderer.domElement);
	}

	function initIndicator() {
		const geometryY = new THREE.Geometry();
        const materialY = new THREE.LineBasicMaterial( { color: 0xff0000 } );
        const verticesY = [
			new THREE.Vector3(0, 1, 0),
			new THREE.Vector3(0, 0, 0)
		];
        geometryY.vertices = verticesY;

        const geometryX = new THREE.Geometry();
        const materialX = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
        const verticesX = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0)
        ];
        geometryX.vertices = verticesX;

        const geometryZ = new THREE.Geometry();
        const materialZ = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const verticesZ = [
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0)
        ];
        geometryZ.vertices = verticesZ;

        scene.add(new THREE.Line(geometryY, materialY));
        scene.add(new THREE.Line(geometryX, materialX));
        scene.add(new THREE.Line(geometryZ, materialZ));
	}

    function initBox() {
        const sphereGeometry = new THREE.SphereGeometry(3, 10, 10);
        const octahedronGeometry = new THREE.OctahedronGeometry(3);
        const torusGeometry = new THREE.TorusGeometry(2, 1, 16, 100 );

        uniforms = {
            spectator: {
                value: camera.position
            }
        };

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms        : uniforms,
            vertexShader    : document.getElementById("vertexShader").textContent,
            fragmentShader  : document.getElementById("fragmentShader").textContent,
        });

        box = new THREE.Mesh(sphereGeometry, shaderMaterial);
        octahedron = new THREE.Mesh(octahedronGeometry, shaderMaterial);
        torus = new THREE.Mesh(torusGeometry, shaderMaterial);

        octahedron.position.set(0, 8, 0);
        torus.position.set(0, -8, 0);

        scene.add(box);
        scene.add(octahedron);
        scene.add(torus);
    }

	function initLight() {
		const dirLight = new THREE.PointLight( 0xffffff, 1, 50 );
		const ambLight = new THREE.AmbientLight( 0xffffff, 0.05 );

        dirLight.position.set(5, 10, 5);

        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 25;

		scene.add(dirLight);
		scene.add(ambLight);
	}

	initWebGL();
	initLight();

	initIndicator();
    initBox();
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    controls.update();

	requestAnimationFrame(animate);
	render();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
render();
animate();

window.addEventListener("resize", onWindowResize);
