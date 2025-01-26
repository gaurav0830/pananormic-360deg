import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const PanoramaViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountElement = mountRef.current;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountElement.appendChild(renderer.domElement);

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert sphere

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/360deg-image.jpg");
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Set camera position
    camera.position.set(0, 0, 0.1);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = -1.0; // Reverse rotation direction
    controls.enableDamping = true; // Smooth damping
    controls.dampingFactor = 0.05; // Damping intensity
    controls.enableZoom = false; // Disable zoom for better experience

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      if (mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default PanoramaViewer;
