import * as THREE from 'three'

// Canvas
//where the 3D scene will be rendered. It is an HTML element that acts as a drawing surface for the WebGL context.
const canvas = document.querySelector('canvas.webgl')

// Scene
//scene is a container that holds all the objects, lights, and cameras in your 3D world. It is where you place your 3D objects and define the environment for rendering.
const scene = new THREE.Scene()

/**
 * Object
 */
// mesh is made up of a geometry (shape) and a material (appearance)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
// camera is made from a field of view (FOV), an aspect ratio
// aspect ration is usually width / height of the canvas
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
//renderer needs a scene and camera
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)