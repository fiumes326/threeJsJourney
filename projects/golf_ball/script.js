import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextureLoader } from 'three';
import { TiffLoader } from 'three/examples/jsm/loaders/TIFFLoader.js';
const myCanvas = document.getElementById("myCanvas")

const scene = new THREE.Scene()
let golfball = null
// My loaders
const gltfLoader = new GLTFLoader()
const textureLoader = TextureLoader()
const tiffLoader = TiffLoader()

// Golf ball GLTF
gltfLoader.load('./static/scene.gltf', (gltf) => {
    golfball = gltf.scene
    scene.add(golfball)

    camera.lookAt(golfball.position)
})

// Grass textures
const grassBaseColor = textureLoader("./static/textures/Poliigon_GrassPatchyGround_4585_BaseColor.png")
const grassRoughness = textureLoader("./static/textures/Poliigon_GrassPatchyGround_4585_Roughness.png")
const grassMetalness = textureLoader("./static/textures/Poliigon_GrassPatchyGround_4585_Metallic.png")
const grassNormal = textureLoader("./static/textures/Poliigon_GrassPatchyGround_4585_Normal.png")
const grassDisaplacememt = tiffLoader("./static/textures/Poliigon_GrassPatchyGround_4585_Displacement.tiff")
grassBaseColor.colorSpace = THREE.SRGBColorSpace

// Grass Mesh
const grassGeometry = new THREE.PlaneGeometry(3, 3)
const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassBaseColor,
    roughnessMap: grassRoughness,
    metalnessMap: grassMetalness,
    normalMap: grassNormal,
    displacementMap: grassDisaplacememt
})
const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial)
scene.add(grassMesh)

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
    renderer.render(scene, camera);
}
tick()