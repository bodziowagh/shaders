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
    },
    mainLight: {
        animate: true,
        orbitRadius: 10,
        rotationSlowdownRatio: 3
    }
};

let renderer, camera, scene, controls, mainLight;
let box, octahedron, torus, uniforms;

function init() {
	function initWebGL() {
		renderer = new THREE.WebGLRenderer({ antialias: CONFIG.rendererProps });
		camera = new THREE.PerspectiveCamera(SCENE.FRUSTUM,
											 SCENE.WIDTH / SCENE.HEIGHT,
											 SCENE.NEAR,
											 SCENE.FAR);
		scene = new THREE.Scene();

		camera.position.set(-9, 8, 16);
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

    function initObjects() {
        const sphereGeometry = new THREE.SphereGeometry(3, 15, 15);
        const octahedronGeometry = new THREE.OctahedronGeometry(3);
        const torusGeometry = new THREE.TorusGeometry(2, 1, 16, 100 );

        uniforms = {
            spectator: {
                type: "v3",
                value: camera.position
            },
            mainLight: {
                type: "v3",
                value: mainLight.position
            },
            time: {
                type: "f",
                value: 0.0
            },
            applyDiffuse: {
                type: "b",
                value: true
            },
            applySpecular: {
                type: "b",
                value: true
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

        octahedron.position.set(-8, 0, 0);
        torus.position.set(8, 0, 0);

        scene.add(box);
        scene.add(octahedron);
        scene.add(torus);
    }

    function initLights() {
	    mainLight = new THREE.Light(0xffffff, 1.0);
	    mainLight.position.set(
            CONFIG.mainLight.orbitRadius * Math.cos(0),
            CONFIG.mainLight.orbitRadius * Math.sin(0),
            0.0
        );
    }

	initWebGL();
    initLights();
    initObjects();
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    controls.update();

    uniforms.time.value += 0.1;

    if (CONFIG.mainLight.animate) {
        mainLight.position.x = CONFIG.mainLight.orbitRadius * Math.cos(
            uniforms.time.value / CONFIG.mainLight.rotationSlowdownRatio
        );
        mainLight.position.z = CONFIG.mainLight.orbitRadius * Math.sin(
            uniforms.time.value / CONFIG.mainLight.rotationSlowdownRatio
        );
    }

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
