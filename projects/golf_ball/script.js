import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextureLoader } from 'three';
import { TIFFLoader } from 'three/examples/jsm/loaders/TIFFLoader.js';
import { VolumeNodeMaterial } from 'three/webgpu';
const myCanvas = document.getElementById("myCanvas")

const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const golfBall = new THREE.Group()
const golfBallModel = new THREE.Group()
let golfBallRadius = null
// My loaders
const gltfLoader = new GLTFLoader()
const textureLoader = new TextureLoader()
const tiffLoader = new TIFFLoader()

// Golf ball GLTF
gltfLoader.load('./static/scene.gltf', (gltf) => {
    const model = gltf.scene
    const boundingBox = new THREE.Box3().setFromObject(model)
    const center = boundingBox.getCenter(new THREE.Vector3())
    const size = boundingBox.getSize(new THREE.Vector3())
    golfBallRadius = size.y / 2
    model.position.y -= center.y
    golfBallModel.add(model)
    golfBall.add(golfBallModel)
    golfBall.position.set(2, 2, 0)
    scene.add(golfBall)

})

// Grass textures
const grassBaseColor = textureLoader.load("./static/textures/Poliigon_GrassPatchyGround_4585_BaseColor.png")
const grassRoughness = textureLoader.load("./static/textures/Poliigon_GrassPatchyGround_4585_Roughness.png")
const grassMetalness = textureLoader.load("./static/textures/Poliigon_GrassPatchyGround_4585_Metallic.png")
const grassNormal = textureLoader.load("./static/textures/Poliigon_GrassPatchyGround_4585_Normal.png")
const grassDisplacememt = tiffLoader.load("./static/textures/Poliigon_GrassPatchyGround_4585_Displacement.tiff")
grassBaseColor.colorSpace = THREE.SRGBColorSpace

// Grass Mesh
const grassGeometry = new THREE.PlaneGeometry(3, 3, 256, 256)
const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassBaseColor,
    roughnessMap: grassRoughness,
    metalnessMap: grassMetalness,
    normalMap: grassNormal,
    displacementMap: grassDisplacememt,
    displacementBias: -.5
})
const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial)
grassMesh.rotation.x = -Math.PI / 2
grassMesh.rotation.z = Math.PI / 4
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

const directionalLight = new THREE.DirectionalLight(0xffffff, 7) 
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
const fallDuration = 3
const compression1Duration = .6
const bounce1Duration = 3 
let xConstant = .1
let rotationConstant = .02
// My falling function
const falling=(xStart, xEnd, yStart, yEnd, time, duration) => {
    const progress = Math.min(time / duration, 1)

    return {
        x: THREE.MathUtils.lerp(xStart, xEnd, progress),
        y: THREE.MathUtils.lerp(yStart, yEnd, progress)
    }
}

//my bouncing function
const bouncing = (xStart, xEnd, height, time, duration) => {
    const progress = Math.min(time / duration, 1)
    return {
        x: THREE.MathUtils.lerp(xStart, xEnd, progress),
        y:  (Math.sin(Math.PI * (time/duration)) * height) + golfBallRadius
    }
}
// my ball compression function
const ballCompressing = (duration, time) => {
    const progress = Math.min(time / duration, 1)
    return {
        yScale: 1 - .1 * Math.sin(Math.PI * progress)
    }
}
const tick = () => {

    requestAnimationFrame(tick);
    const time = clock.getElapsedTime();
   
    if (golfBallRadius !== null) {
        if (time < fallDuration) {
            const position = falling(2, 1, 2, golfBallRadius, time, fallDuration)
            golfBall.position.x = position.x
            golfBall.position.y = position.y
            golfBallModel.rotation.z -= Math.PI * rotationConstant
        }
        if (time >= fallDuration && time <= fallDuration + compression1Duration) {
            rotationConstant = .01
            const compressionTime = time - fallDuration
            const data = ballCompressing(compression1Duration, compressionTime)
            golfBall.scale.y = data.yScale
        }
        if (time >= fallDuration + compression1Duration && time < fallDuration + bounce1Duration + compression1Duration){
            const bounceTime = time - fallDuration - compression1Duration
            const position = bouncing(1, -.5, .75, bounceTime, bounce1Duration)
            golfBall.position.x = position.x
            golfBall.position.y = position.y
            golfBallModel.rotation.z -= Math.PI * rotationConstant
        }
    }

    renderer.render(scene, camera);
}
tick()