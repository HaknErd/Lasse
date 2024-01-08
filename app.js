import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

const RenderBox = document.getElementById("KanyeIn3d");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  RenderBox.offsetWidth / RenderBox.offsetHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Set alpha to true
const loader = new OBJLoader();

renderer.setSize(RenderBox.offsetWidth, RenderBox.offsetHeight);
renderer.setClearColor(0x000000, 0); // Set clear color with alpha value of 0
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const RendererElement = renderer.domElement;
RenderBox.appendChild(RendererElement);

camera.position.z = 1;

const mtlLoader = new MTLLoader();
let KanyeModel;

mtlLoader.load("model/model.mtl", function (materials) {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);

  objLoader.load("model/model.obj", function (object) {
    object.castShadow = true;
    object.receiveShadow = true;

    scene.add(object);
    KanyeModel = object;
    animate();
  });
});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const light = new THREE.PointLight(0x6b0091, 1, 100, 5);
light.position.set(0, 1, 1);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 2, 100, 0.5, 0.5);
light2.position.set(0, 0, 1);
console.log(light2.position);
console.log(camera.position);
scene.add(light2);
let counter = 1;
var spin = false;
let color = [0, 0, 0];

const SpinSpeed = 0.03;
const animate = function () {
  requestAnimationFrame(animate);

  if (!VideoPaused) {
    counter += 0.01;
    color[0] = Math.sin(counter) * 127 + 128;
    color[1] = Math.sin(counter + 2) * 127 + 128;
    color[2] = Math.sin(counter + 4) * 127 + 128;
    light2.color.setRGB(color[0] / 255, color[1] / 255, color[2] / 255);
    Video.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
  }
  if (spin) {
    KanyeModel.rotation.y += SpinSpeed;
    if (KanyeModel.rotation.y > Math.PI * 2) {
      KanyeModel.rotation.y = 0;
    }
  } else {
    if (KanyeModel.rotation.y > 0) {
      KanyeModel.rotation.y -= SpinSpeed;
    }
  }
  camera.lookAt(KanyeModel.position);
  renderer.render(scene, camera);
};

const DisplayPodium = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 1),
  new THREE.MeshPhongMaterial({ color: 0x575757 })
);
DisplayPodium.position.y = -0.9;
DisplayPodium.receiveShadow = true;
DisplayPodium.castShadow = true;

scene.add(DisplayPodium);

function resize() {
  renderer.setSize(RenderBox.offsetWidth, RenderBox.offsetHeight);
  camera.aspect = RenderBox.offsetWidth / RenderBox.offsetHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", function () {
  resize();
});

window.addEventListener("mousemove", function (event) {
  camera.position.x = -(event.clientX - window.innerWidth / 2) / 4000;
  camera.position.y = -(event.clientY - window.innerHeight / 2) / 8000;
  camera.lookAt(scene.position);
  light2.position.x = camera.position.x;
  light2.position.y = camera.position.y + 0.5;
});
const Videos = {
  "goodmorning": "./videos/goodmorning.mp4",
  "Flashing Lights": "./videos/flashinglights.mp4",
  "Stronger": "./videos/stronger.mp4",
  "Runaway": "./videos/runaway.mp4",
  "N**** in Paris": "./videos/paris.mp4",
};
const Video = document.getElementById("Video");
var PlayHiddenVideo = true;
RenderBox.addEventListener("mouseover", function (event) {
  spin = true;
  resize();
});
RenderBox.addEventListener("mouseout", function (event) {
  spin = false;
});
let VideoPaused = true;
function RandomizeVideo() {
  //randomize video
  Video.pause();
  const keys = Object.keys(Videos);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  Video.src = Videos[randomKey];
  Video.currentTime = 0;
  //check if mouse is over the box
  if (!VideoPaused) {
    Video.play();
  } else {
    Video.pause();
  }
}
function PlayPause() {
  if (Video.paused) {
    Video.play();
  } else {
    Video.pause();
  }
}
document.addEventListener("keydown", function (event) {
  if (event.key == "V") {
    PlayHiddenVideo = false;
  } else if (event.key == "r") {
    RandomizeVideo();
  } else if (event.key == " ") {
    event.preventDefault();
    PlayPause();
  } else if (event.key == "ArrowRight") {
    Video.currentTime += 5;
  } else if (event.key == "ArrowLeft") {
    Video.currentTime -= 5;
    if (Video.currentTime < 0) {
      Video.currentTime = 0;
    }
  } else if (event.key == "Backspace") {
    Video.currentTime = 0;
  } else if (event.key == "q") {
    if (RendererElement.style.opacity == 1) {
      RendererElement.style.opacity = 0;
    } else {
      RendererElement.style.opacity = 1;
    }
  }
});
RenderBox.addEventListener("click", function (event) {
  PlayPause();
  if (VideoPaused) {
    camera.position.z = 1.1;
  } else {
    camera.position.z = 0.9;
  }
});

Video.onplay = function () {
  Video.style.display = "block";
  VideoPaused = false;
};
Video.onpause = function () {
  VideoPaused = true;
  light2.color = new THREE.Color(0xffffff);
  Video.style.backgroundColor = `#262626`;
};

Video.onended = function () {
  RandomizeVideo();
  Video.play();
};
