import * as THREE from 'three'
import { AlphaFormat, Matrix, PositionalAudio, Vector2, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const ALTURA = Math.sqrt(0.75)
// console.log(ALTURA) 

const camera_pers = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const aspectu = window.innerWidth/window.innerHeight

const camera_ort = new THREE.OrthographicCamera(-1*aspectu,1*aspectu,1,-1, 1, 1000 )

const camera = camera_pers

camera.position.z = 1
camera.position.y = 2
camera.position.x = 1   
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)


// AÑADIR ESFERA

const geometry_sphere_1 = new THREE.SphereGeometry(0.05,8,4,0,Math.PI*2,0,Math.PI)
const material_sphere_1 = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
})
const sphere_1 = new THREE.Mesh(geometry_sphere_1, material_sphere_1)
// sphere_1.position.y=0.5

sphere_1.position.x=0.5
sphere_1.position.z=0.5

scene.add(sphere_1)
sphere_1.add(new THREE.AxesHelper(1))

//MATRIZ DE HEXÁGONOS-->

function genMatrix(ob:THREE.Mesh) {
   let x = ob.position.x
   let z = ob.position.z-ALTURA/2

   let rx = x%0.75
   let rz = z%ALTURA

   let u = x/0.75
   let v = z/ALTURA

   let fu = Math.floor(u)
   let fv = Math.floor(v)

   if(fu%2==1){
        v=(z/ALTURA)-0.5
    }
   let ru = u
   let rv = v

   let fru = Math.floor(ru)
   let frv = Math.round(rv)

   let p =  ALTURA*2

//    if(fu%2==1){
//         u=(x/0.75)+0.25
//    }

    // if((fu%2==1)&&(rz<(-p*rx+(ALTURA/2)))){
    //     console.log("ABE")
    //     fru-=1
    //     frv+=1
    // }

    // if((fu%2==1)&&(rz>(p*rx+(ALTURA/2)))){
    //     console.log("ehg") 
    // }

    //  if((fu%2==0)&&(rz<ALTURA/2)){
    //     console.log("ARRIBA")
    // } 

    //  if((fu%2==0)&&((rz>(p*rx)&&(rz<(-p*rx+ALTURA))))){
    //     console.log("TRIANGULO") 
    //     fru-=1
    // }
    
   let pos = [fru,frv]
   return pos
}


//PLANOS

const geometry_plane_0 = new THREE.CircleGeometry(0.5,6,0,Math.PI*2)
geometry_plane_0.rotateX(Math.PI/2)
const material_plane_0 = new THREE.MeshBasicMaterial({
    color: 0x33aa33,
    wireframe: true,
})

const material_plane = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
})
const plane_0 = new THREE.Mesh(geometry_plane_0, material_plane)
plane_0.position.y=0
plane_0.position.x=0.5 
plane_0.position.z=ALTURA/2
scene.add(plane_0)
// plane_0.add(new THREE.AxesHelper(1))

//OTROS PLANOS AUXILIARES
const plane_1 = new THREE.Mesh(geometry_plane_0, material_plane_0)
scene.add(plane_1)

const plane_2 = new THREE.Mesh(geometry_plane_0, material_plane_0)
scene.add(plane_2)

const plane_3 = new THREE.Mesh(geometry_plane_0, material_plane_0)
scene.add(plane_3)

const plane_4 = new THREE.Mesh(geometry_plane_0, material_plane_0)
scene.add(plane_4)

const plane_5 = new THREE.Mesh(geometry_plane_0, material_plane_0)
scene.add(plane_5)

const plane_6 = new THREE.Mesh(geometry_plane_0, material_plane_0)
scene.add(plane_6)


function planosCercanos (){

    // let aux = (sphere_1.position.z/ALTURA-Math.floor(sphere_1.position.z/ALTURA))+0.5  
    // console.log(aux)
    // // console.log(plane_0.position.z)

    // let aux2 = 3/4

    // let positionXFloor = Math.floor(sphere_1.position.x);
    // let positionZFloor = Math.floor(sphere_1.position.z/ALTURA);
    
    // let positionXRound = Math.round(sphere_1.position.x/aux2);
    // let positionZRound = Math.round(sphere_1.position.z/ALTURA);

    // plane_0.position.x = positionXRound*aux2
    // plane_0.position.z = positionZFloor*ALTURA+ALTURA/2-(positionXRound%2*ALTURA/2)


    plane_1.position.x = plane_0.position.x
    plane_1.position.z = plane_0.position.z-ALTURA
    
    plane_2.position.x = plane_0.position.x
    plane_2.position.z = plane_0.position.z+ALTURA
    
    plane_3.position.x = plane_0.position.x+0.75
    plane_3.position.z = plane_0.position.z-ALTURA/2
    
    plane_4.position.x = plane_0.position.x-0.75
    plane_4.position.z = plane_0.position.z-ALTURA/2
    
    plane_5.position.x = plane_0.position.x+0.75    
    plane_5.position.z = plane_0.position.z+ALTURA/2
    
    plane_6.position.x = plane_0.position.x-0.75
    plane_6.position.z = plane_0.position.z+ALTURA/2
}




//---------------------------------------------------
// RENDERIZADO Y ANIMACIÓN
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


// KEYMAP

const keyMap: { [id: string]: boolean } = {}
const onDocumentKey = (e: KeyboardEvent) => {
    keyMap[e.code] = e.type === 'keydown'
}

document.addEventListener('keydown', onDocumentKey, false)
document.addEventListener('keyup', onDocumentKey, false)

//ANIMATE
function animate() {
    requestAnimationFrame(animate)

    if (keyMap['KeyW']) {
        sphere_1.position.z -= 0.01 
        camera.position.z -= 0.01
        console.log(genMatrix(sphere_1))
    }
    if (keyMap['KeyS']) {
        sphere_1.position.z += 0.01 
        camera.position.z += 0.01
        console.log(genMatrix(sphere_1))
        
    }
    if (keyMap['KeyA']) {
        sphere_1.position.x -= 0.01   
        camera.position.x -= 0.01    
        console.log(genMatrix(sphere_1))
    }
    if (keyMap['KeyD']) {
        sphere_1.position.x += 0.01
        camera.position.x += 0.01
        console.log(genMatrix(sphere_1))
    }
    if (keyMap['Space']) {
        console.log(genMatrix(sphere_1))
    }
    planosCercanos()
    // sphere_1.rotation.y += 0.01
    // sphere_1.rotation.x += 0.01

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()