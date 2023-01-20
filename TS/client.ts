import * as THREE from 'three'
import { AlphaFormat, Color, DoubleSide, Matrix, Plane, PositionalAudio, Sphere, Vector2, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

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
scene.background = new Color(0x333333)

const light = new THREE.AmbientLight(new Color(0xffffff),10)
light.position.set(2.5, 7.5, 15)
scene.add(light)

const aspectu = window.innerWidth/window.innerHeight

const camera_ort = new THREE.OrthographicCamera(-1*aspectu,1*aspectu,1,-1, 1, 1000 )

const camera = camera_pers

camera.position.z = 4
camera.position.y = 3
camera.position.x = 4   

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

var controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


// AÑADIR ESFERA

const geometry_sphere_1 = new THREE.SphereGeometry(0.05,8,4,0,Math.PI*2,0,Math.PI)
const material_sphere_1 = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
})
const sphere_1 = new THREE.Mesh(geometry_sphere_1, material_sphere_1)
sphere_1.position.y=0.05
sphere_1.position.x=2
sphere_1.position.z=2

camera.lookAt(new Vector3(sphere_1.position.x,sphere_1.position.y,sphere_1.position.z))

scene.add(sphere_1)
sphere_1.add(new THREE.AxesHelper(1))

//PLANOS

const geometry_plane_0 = new THREE.CircleGeometry(0.5,6,0,Math.PI*2)
geometry_plane_0.rotateX(Math.PI/2)
const material_plane_0 = new THREE.MeshBasicMaterial({
    color: 0x33aa33,
    wireframe: true,
})

const geometry_primer_plane_0 = new THREE.PlaneGeometry(6*0.75,6*ALTURA,12,12)
geometry_primer_plane_0.rotateX(Math.PI/2)
const material_primer_plane_0 = new THREE.MeshBasicMaterial({
    color: 0x330044,
    wireframe: true,
    side:DoubleSide
})
const primer_plane_0 = new THREE.Mesh(geometry_primer_plane_0,material_primer_plane_0)
primer_plane_0.position.x = 3*0.75
primer_plane_0.position.z = 3*ALTURA
primer_plane_0.position.y = -0.01

scene.add(primer_plane_0)

const material_plane = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
})
const plane_0 = new THREE.Mesh(geometry_plane_0, material_plane)

let spx = centerHex(sphere_1.position.x,sphere_1.position.z)[0]
let spy = 0
let spz = centerHex(sphere_1.position.x,sphere_1.position.z)[1]
plane_0.position.y=0.05
plane_0.position.x=spx
plane_0.position.z=spz
// plane_0.position.x=0.5
// plane_0.position.z=ALTURA/2 
scene.add(plane_0)
// plane_0.add(new THREE.AxesHelper(1))


// CENTER HEX IN AXIAL
function centerHex(i:number,j:number){
    let c = axToHex(i,j)
    let a = c[0]
    let b = c[1]

    let o = (a*3/4)+0.5
    let p = (b*ALTURA)+ALTURA/2

    if (c[0]%2!=0){
        p+=ALTURA/2
    }
    let m = [o,p]
    // console.log(m+" - "+a+","+b)
    return m
}


//MATRIZ DE HEXÁGONOS-->


// AX TO HEX
function axToHex(a:number,b:number){
    let x = a
    let z = b
 
    let u = x/0.75
    
 
    let fu = Math.floor(u)
    if(fu%2!=0){
         z-=(ALTURA/2)
     }
 
     let v = z/ALTURA
     let fv = Math.floor(v)
 
    let rx = x%0.75
    let rz = z%ALTURA
 
    let p =  ALTURA*2

    let auxfu = fu
    let auxfv = fv
    
    if((fu%2!=0)&&(fu>=0)&&(fv>=0)&&(rz<ALTURA/2)&&(rz<((-p*rx)+(ALTURA/2)))){
        material_sphere_1.color=new Color(0x00ff00)
        fu-=1
        let pos = [fu,fv,0]
        // console.log("fu: -->"+fu+" - "+"fv: -->"+fv) 
       return pos
    }    
    if((fu%2!=0)&&(fu>=0)&&(fv>=0)&&(rz>ALTURA/2)&&(rz>((p*rx)+(ALTURA/2)))){
        material_sphere_1.color=new Color(0x00ffff)
        fu-=1
        fv+=1
        let pos = [fu,fv,1]
        // console.log("fu: -->"+fu+" - "+"fv: -->"+fv) 
       return pos
    }  
    
    if((fu%2==0)&&(fu>=0)&&(fv>=0)&&(rz<ALTURA/2)&&(rz<((-p*rx)+(ALTURA/2)))){
        material_sphere_1.color=new Color(0xff0000)
        fu-=1
        fv-=1
        let pos = [fu,fv,2]
        // console.log("fu: -->"+fu+" - "+"fv: -->"+fv) 
       return pos
    }
    
    if((fu%2==0)&&(fu>=0)&&(fv>=0)&&(rz>ALTURA/2)&&(rz>((p*rx)+(ALTURA/2)))){
        material_sphere_1.color=new Color(0xffff00)
        fu-=1
        let pos = [fu,fv,3]
        // console.log("fu: -->"+fu+" - "+"fv: -->"+fv) 
       return pos
    }
    //    console.log("fu: -->"+fu+" - "+"fv: -->"+fv) 
    
 let pos = [fu,fv,rz,((p*rx)+(ALTURA/2)),((-p*rx)+(ALTURA/2))]
    return pos
}


// TEST HEXAGONAL
function genMatrix(ob:THREE.Mesh) {
   let x = ob.position.x
   let z = ob.position.z

   let u = x/0.75
   

   let fu = Math.floor(u)
   if(fu%2!=0){
        z-=(ALTURA/2)
    }

    let v = z/ALTURA
    let fv = Math.floor(v)

   let rx = x%0.75
   let rz = z%ALTURA

   let p =  ALTURA*2
   material_sphere_1.color=new Color(0xffffff)

  
   if((fu%2!=0)&&(fu>=0)&&(fv>=0)&&(rz<ALTURA/2)&&(rz<((-p*rx)+(ALTURA/2)))){
    material_sphere_1.color=new Color(0x00ff00)
    let pos = [fu,fv,0]
   return pos
   }    
   if((fu%2!=0)&&(fu>=0)&&(fv>=0)&&(rz>ALTURA/2)&&(rz>((p*rx)+(ALTURA/2)))){
    material_sphere_1.color=new Color(0x00ffff)
    let pos = [fu,fv,1]
   return pos
   }  

   if((fu%2==0)&&(fu>=0)&&(fv>=0)&&(rz<ALTURA/2)&&(rz<((-p*rx)+(ALTURA/2)))){
    material_sphere_1.color=new Color(0xff0000)
    let pos = [fu,fv,2]
   return pos
   }

   if((fu%2==0)&&(fu>=0)&&(fv>=0)&&(rz>ALTURA/2)&&(rz>((p*rx)+(ALTURA/2)))){
    material_sphere_1.color=new Color(0xffff00)
    let pos = [fu,fv,3]
   return pos
   }  
//    console.log("fu: -->"+fu+" - "+"fv: -->"+fv)
   
let pos = [fu,fv,rz,((p*rx)+(ALTURA/2)),((-p*rx)+(ALTURA/2))]
return pos
}




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
    let yax = 0.1
    plane_1.position.x = plane_0.position.x
    plane_1.position.z = plane_0.position.z-ALTURA
    plane_1.position.y = yax
    
    plane_2.position.x = plane_0.position.x
    plane_2.position.z = plane_0.position.z+ALTURA
    plane_2.position.y = yax
    
    plane_3.position.x = plane_0.position.x+0.75
    plane_3.position.z = plane_0.position.z+ALTURA/2
    plane_3.position.y = yax    
    
    plane_4.position.x = plane_0.position.x+0.75
    plane_4.position.z = plane_0.position.z-ALTURA/2
    plane_4.position.y = yax
    
    plane_5.position.x = plane_0.position.x-0.75
    plane_5.position.z = plane_0.position.z+ALTURA/2
    plane_5.position.y = yax
    
    plane_6.position.x = plane_0.position.x-0.75
    plane_6.position.z = plane_0.position.z-ALTURA/2
    plane_6.position.y = yax
    
}


//LOADER OBJ

// const material_cat_1 = new THREE.MeshNormalMaterial({
// })

// const mtlLoader = new MTLLoader()
// mtlLoader.load(
//     'models/robot_cat_sketchfab.mtl',
//     (materials) => {
//         materials.preload()
//         console.log(materials)
//         const objLoader = new OBJLoader()
//         objLoader.setMaterials(materials)
// objLoader.load(
//     'models/robot_cat_sketchfab.obj',
//     (cat_1) => {
//         let matr = new THREE.Matrix4()
//         cat_1.applyMatrix4(matr.makeScale(0.01,0.01,0.01))
//         cat_1.position.x=sphere_1.position.x
//         cat_1.position.y=sphere_1.position.y
//         cat_1.position.z=sphere_1.position.z
//         scene.add(cat_1)
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log(error)
//     }
// )
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log('An error happened')
//     }
// )





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
        genMatrix(sphere_1)
    }
    if (keyMap['KeyS']) {
        sphere_1.position.z += 0.01 
        camera.position.z += 0.01
        genMatrix(sphere_1)
    }
    if (keyMap['KeyA']) {
        sphere_1.position.x -= 0.01   
        camera.position.x -= 0.01   
        genMatrix(sphere_1) 
    }
    if (keyMap['KeyD']) {
        sphere_1.position.x += 0.01
        camera.position.x += 0.01
        genMatrix(sphere_1)
    }
    if (keyMap['Space']) {
        console.log(genMatrix(sphere_1))
    }
    planosCercanos()
    // sphere_1.rotation.y += 0.01
    // sphere_1.rotation.x += 0.01
    plane_0.position.x=centerHex(sphere_1.position.x,sphere_1.position.z)[0]
    plane_0.position.z=centerHex(sphere_1.position.x,sphere_1.position.z)[1]

    
    controls.target = new Vector3(sphere_1.position.x,sphere_1.position.y,sphere_1.position.z)
    controls.update()
    render()
}
function render() {
    renderer.render(scene, camera)
}
animate()