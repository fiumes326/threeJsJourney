import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const myCanvas = document.getElementById("myCanvas")

const scene = new THREE.Scene()
let golfball = null
const gltfLoader = new GLTFLoader()

gltfLoader.load('./static/scene.gltf', (gltf) => {
    golfball = gltf.scene
    scene.add(golfball)

    camera.lookAt(golfball.position)
})



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

const tick = () => {

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()