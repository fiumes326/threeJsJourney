import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const myCanvas = document.getElementById("myCanvas")

const scene = new THREE.Scene()
let golfball = null
const gltfLoader = new GLTFLoader()

gltfLoader.load('./static/scene.gltf', (gltf) => {
    golfball = gltf.scene
    scene.add(golfball)

    camera.lookAt(golfball.position)
})

const grassGeometry = new THREE.ConeGeometry(0.015, 0.2, 3);
grassGeometry.translate(0, 0.1, 0)
const grassMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2e8b57, 
  side: THREE.DoubleSide,
  roughness: .6,
  metalness: .1
});
const grassCount = 6000
const grassMesh = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassCount)
grassMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(grassCount * 3), 3);
const baseColor = new THREE.Color(0x2e8b57);
scene.add(grassMesh)


const grassData = []
const dummy = new THREE.Object3D()

for (let i = 0; i < grassCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.sin(angle) * (Math.random() * 1 )
    const z = Math.cos(angle) * (Math.random() * 1 )
    const baseRotationY = Math.random() * Math.PI * 2;

    grassData.push({
        x: x,
        z: z,
        rotY: baseRotationY,
        speed: 1.5 + Math.random() * 1.5,      
        phase: Math.random() * Math.PI * 2,    
        swayDir: Math.random() * Math.PI * 2   
    });


    dummy.position.set(x, 0, z);
    dummy.rotation.set(0, baseRotationY, 0);
    dummy.updateMatrix();
    grassMesh.setMatrixAt(i, dummy.matrix);

    const bladeColor = baseColor.clone();
    bladeColor.g += (Math.random() - 0.5) * 0.15; 
    bladeColor.r += Math.random() * 0.05;         
    
    grassMesh.setColorAt(i, bladeColor);
}


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, .1, 100)
camera.position.z=2
camera.position.y=1

const controls = new OrbitControls( camera, myCanvas );

const directionalLight = new THREE.DirectionalLight(0xffffff, 3) 
directionalLight.position.set(5, 5, 5) 
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff,.5)
scene.add(ambientLight)

const renderer = new THREE.WebGLRenderer({
    canvas: myCanvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock();

const tick = () => {

    requestAnimationFrame(tick);

    const time = clock.getElapsedTime();

    for (let i = 0; i < grassCount; i++) {
        const data = grassData[i];

        const sway = Math.sin(time * data.speed + data.phase) * 0.15; 

        dummy.position.set(data.x, 0, data.z);
        
    
        dummy.rotation.set(
        Math.cos(data.swayDir) * sway, 
        data.rotY, 
        Math.sin(data.swayDir) * sway
        );

        dummy.updateMatrix();
        grassMesh.setMatrixAt(i, dummy.matrix);
    }

    grassMesh.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
}
tick()