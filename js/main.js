import * as THREE from '../build/three.module.js';
import {Vector3} from '../build/three.module.js';
import {OrbitControls} from "../build/OrbitControls.js";
import {getVectors, isCorrectlyPieced, renderCube, rotateWall, snapRotation} from "./cube.js";
import {GLTFLoader} from "../build/GLTFLoader.js";
import {showPopup, showResults} from "./popup.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const light = new THREE.AmbientLight(0xFFFFFF);
scene.add(light);

const light2 = new THREE.SpotLight(0xFFFFFF, 3);
light2.position.set(25, 50, 50);
light2.target.position.set(0, 0, 0);
scene.add(light2);

camera.position.z = 10;
camera.position.x = 10;
camera.position.y = 10;

const container2 = document.getElementById("arrows");
const renderer2 = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer2.setSize(200, 200);
container2.appendChild(renderer2.domElement);
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(50, 200 / 200, 1, 1000);
camera2.up = camera.up;

const light3 = new THREE.AmbientLight(0xFFFFFF);
scene2.add(light3);

const loader = new GLTFLoader();
loader.load('./models/marker.glb', function (gltf) {
    gltf.scene.scale.multiplyScalar(60)
    gltf.scene.position.x = 0; // once rescaled, position the model where needed
    gltf.scene.position.z = 0;
    scene2.add(gltf.scene);
});


let disableControls = false;

let beginX, beginY;
let lastMove;

let animationDirection = 'F';
let animationClockwise = true;
let currentStep = 0;
const animationSteps = 45;
let animationLock = false;
let currentVectors =

    renderCube(scene)
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

function onClick(event) {
    event.preventDefault();

    if (disableControls) {
        return;
    }
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    beginX = mouse.x;
    beginY = mouse.y;
    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObjects(scene.children, true);
    if (intersections.length > 0) {
        controls.enabled = false;
        currentVectors = getVectors(intersections[0]).map(vector => {
            vector.vector = new Vector3(vector.vector.project(camera).x - new Vector3().project(camera).x, vector.vector.project(camera).y - new Vector3().project(camera).y, 0)
            return vector;
        })
    }
}

function mouseUp(event) {
    event.preventDefault();
    controls.enabled = true;
    lastMove = 0;
}

let inGame = false;


function playAnimation() {
    if (currentStep < animationSteps && animationLock) {
        rotateWall(animationDirection, Math.PI / 2 / animationSteps, animationClockwise);
        currentStep++;
    } else if (animationLock && currentStep === animationSteps) {
        snapRotation(animationDirection, animationClockwise);
        isCorrectlyPieced();
        if (inGame && isCorrectlyPieced()) {
            inGame = false;
            document.getElementById("info").innerText = `Done! Took: ${(gameTimer / 1000).toFixed(2)} s`;
            clearTimeout(gameTimeout);
            showPopup(gameTimer);
            showResults();
        }
        currentStep = 0;
        animationLock = false;
    }
}


document.onpointerdown = onClick;
document.onpointerup = mouseUp;
document.onpointermove = (event) => {
    event.preventDefault();
    if (!controls.enabled && currentVectors.length !== 0) {

        const currentX = (event.clientX / window.innerWidth) * 2 - 1;
        const currentY = -(event.clientY / window.innerHeight) * 2 + 1;
        const controlVector = new Vector3(currentX - beginX - new Vector3().project(camera).x, currentY - beginY - new Vector3().project(camera).y, 0);
        controlVector.multiplyScalar(-1);
        let maxObject;
        let smallestAngle = Math.PI;
        if (controlVector.length() > 0.15 && !animationLock) {
            currentVectors.forEach(vector => {
                const angle = vector.vector.angleTo(controlVector);
                if (angle < smallestAngle) {
                    smallestAngle = angle;
                    maxObject = vector;
                }
            })

            animationDirection = maxObject.direction;
            animationClockwise = maxObject.clockwise;
            animationLock = true;
        }

    }
}

let move = 0;
const maxMoves = 2;
let isMixing = false;
let startTimeout;
let gameTimeout;
let secondsLeft;
let gameTimer = 0;

function gameTimerFunction() {
    gameTimer += 10;
    document.getElementById("info").textContent = `Time: ${(gameTimer / 1000).toFixed(2)} s`;
    gameTimeout = setTimeout(gameTimerFunction, 10);
}

function start() {
    if (secondsLeft >= 1) {
        document.getElementById("info").textContent = `Starting in ${secondsLeft}`;
        startTimeout = setTimeout(start, 1000);
    } else if (secondsLeft === 0) {
        document.getElementById("info").textContent = `Go!`;
        startTimeout = setTimeout(start, 1000);
        disableControls = false;
    } else if (secondsLeft === -1) {
        gameTimeout = setTimeout(gameTimerFunction, 10);
        gameTimer = 0;
    }
    secondsLeft--;
}

function mixUp() {
    if (isMixing) {
        const options = ['U', 'D', 'L', 'R', 'F', 'B'];
        const option = options[Math.floor(Math.random() * options.length)];
        const clockwiseOptions = [true, false];
        const clockwise = clockwiseOptions[Math.floor(Math.random() * clockwiseOptions.length)];
        if (move < maxMoves && !animationLock) {
            animationClockwise = clockwise;
            animationDirection = option;
            animationLock = true;
            move++;
        } else if (move === maxMoves) {
            isMixing = false;
            inGame = true;
            document.getElementById("info").textContent = "Mixed!";
            secondsLeft = 3;
            startTimeout = setTimeout(start, 1000);
        }
    }
}

export function startMix() {
    isMixing = true;
    disableControls = true;
    document.getElementById("startButton").style.display = 'none';
    document.getElementById("info").textContent = "Mixing cube";
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    playAnimation();
    mixUp();

    camera2.position.copy(camera.position);
    camera2.position.sub(controls.target); // added by @libe
    camera2.position.setLength(300);

    camera2.lookAt(scene2.position);

    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);

}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

document.getElementById("startButton").onclick = startMix;
document.getElementById("info").textContent = "Welcome to rubik's cube game";


animate();
showResults();
