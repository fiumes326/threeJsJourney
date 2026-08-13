import * as THREE from 'three'

const canvas = document.querySelector('canvas.webgl')
//scene holds all our three objects
const scene = new THREE.Scene()

//Mesh is made up of geometry and a material

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 0xff0000})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Cameria is made up of field of view and aspect ratio
//aspect ration is usually width / height
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
scene.add(camera)

//Renderer renders output for us using a camera and a scene

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
