/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  Vector2,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  Texture,
  CubeTexture,
  Mesh,
  PBRMaterial,
  DynamicTexture,
  ParticleSystem,
  Animation,
  GlowLayer,
  CSG,
} from '@babylonjs/core';
import { WaterMaterial } from '@babylonjs/materials';
import useGameManager from './hooks/useGameManager';
import usePlayerManager from './hooks/usePlayerManager';
import useRivalSystem from './hooks/useRivalSystem';
import SwimmerManager from './graphics/SwimmerManager';

type VenueTheme = 'olympic' | 'game7' | 'neon' | 'sunset' | 'custom';

interface CustomColors {
  skyColor: string;
  hallColor: string;
  waterColor: string;
  deckColor: string;
  blockColor: string;
}

const VENUES = {
  olympic: {
    name: "Olympic Arena",
    skyColor: new Color4(0.8, 0.9, 1.0, 1),
    ambientLight: new Color3(1, 1, 1),
    lightIntensity: 0.8,
    hallColor: new Color3(0.15, 0.18, 0.22),
    ceilingLightColor: new Color3(1, 1, 1),
    waterColor: new Color3(0.0, 0.6, 0.8),
    waterBlend: 0.6,
    deckColor: new Color3(0.7, 0.7, 0.7),
    blockColor: new Color3(0.1, 0.1, 0.4),
    ropeColors: [new Color3(1, 0, 0), new Color3(1, 1, 1)],
    signColor: new Color3(0, 0, 0.5),
    signTextColor: "#000066",
    scoreboardBg: "#020210",
    scoreboardText: "#ffffff",
    scoreboardTitle: "WORLD CHAMPIONSHIPS",
  },
  game7: {
    name: "Game 7 Championship",
    skyColor: new Color4(0.02, 0.02, 0.02, 1),
    ambientLight: new Color3(1, 0.9, 0.7),
    lightIntensity: 0.4,
    hallColor: new Color3(0.05, 0.05, 0.05),
    ceilingLightColor: new Color3(1, 0.8, 0.4),
    waterColor: new Color3(0.0, 0.4, 1.0),
    waterBlend: 0.8,
    deckColor: new Color3(0.1, 0.1, 0.1),
    blockColor: new Color3(0.8, 0.6, 0.1),
    ropeColors: [new Color3(0.8, 0.6, 0.1), new Color3(0.1, 0.1, 0.1)],
    signColor: new Color3(0.8, 0.6, 0.1),
    signTextColor: "#000000",
    scoreboardBg: "#000000",
    scoreboardText: "#FFD700",
    scoreboardTitle: "GAME 7 FINALS",
  },
  neon: {
    name: "Neon Night",
    skyColor: new Color4(0.05, 0.0, 0.1, 1),
    ambientLight: new Color3(1, 0.2, 0.8),
    lightIntensity: 0.6,
    hallColor: new Color3(0.02, 0.0, 0.05),
    ceilingLightColor: new Color3(0, 1, 0.8),
    waterColor: new Color3(0.0, 1.0, 0.8),
    waterBlend: 0.7,
    deckColor: new Color3(0.1, 0.05, 0.2),
    blockColor: new Color3(1.0, 0.0, 0.8),
    ropeColors: [new Color3(1, 0, 0.8), new Color3(0, 1, 0.8)],
    signColor: new Color3(1.0, 0.0, 0.8),
    signTextColor: "#ffffff",
    scoreboardBg: "#1a0033",
    scoreboardText: "#00ffff",
    scoreboardTitle: "NEON INVITATIONAL",
  },
  sunset: {
    name: "Sunset Open Air",
    skyColor: new Color4(0.8, 0.4, 0.2, 1),
    ambientLight: new Color3(1, 0.6, 0.3),
    lightIntensity: 1.0,
    hallColor: new Color3(0.6, 0.4, 0.3),
    ceilingLightColor: new Color3(1, 0.5, 0),
    waterColor: new Color3(0.1, 0.4, 0.5),
    waterBlend: 0.5,
    deckColor: new Color3(0.8, 0.6, 0.4),
    blockColor: new Color3(0.8, 0.3, 0.1),
    ropeColors: [new Color3(1, 0.5, 0), new Color3(1, 1, 0)],
    signColor: new Color3(0.8, 0.3, 0.1),
    signTextColor: "#ffffff",
    scoreboardBg: "#331a00",
    scoreboardText: "#ffcc00",
    scoreboardTitle: "SUNSET CLASSIC",
  },
  custom: {
    name: "Custom Design",
    skyColor: new Color4(0.1, 0.1, 0.1, 1),
    ambientLight: new Color3(1, 1, 1),
    lightIntensity: 0.8,
    hallColor: new Color3(0.2, 0.2, 0.2),
    ceilingLightColor: new Color3(1, 1, 1),
    waterColor: new Color3(0.0, 0.5, 1.0),
    waterBlend: 0.6,
    deckColor: new Color3(0.5, 0.5, 0.5),
    blockColor: new Color3(0.2, 0.2, 0.2),
    ropeColors: [new Color3(1, 0, 0), new Color3(1, 1, 1)],
    signColor: new Color3(0.2, 0.2, 0.2),
    signTextColor: "#ffffff",
    scoreboardBg: "#000000",
    scoreboardText: "#ffffff",
    scoreboardTitle: "CUSTOM ARENA",
  }
};

export default function App() {
  // Initialize new modular systems
  const { gameManager, isReady: gmReady } = useGameManager();
  const { playerManager, currentPlayer, isReady: pmReady } = usePlayerManager();
  const { rivalSystem, isReady: rsReady } = useRivalSystem();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentVenue, setCurrentVenue] = useState<VenueTheme>('game7');
  const [customColors, setCustomColors] = useState<CustomColors>({
    skyColor: '#0a0a0a',
    hallColor: '#1a1a1a',
    waterColor: '#0088ff',
    deckColor: '#444444',
    blockColor: '#ffdd00',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
const TIME_OF_DAY_CONFIG = {
  morning: {
    ambientLight: new Color3(1, 0.9, 0.7),
    lightIntensity: 0.8,
    skyColor: new Color4(0.5, 0.7, 1.0, 1),
    ceilingLightColor: new Color3(1, 1, 0.9),
    ceilingLightIntensity: 0.4,
  },
  afternoon: {
    ambientLight: new Color3(1, 1, 1),
    lightIntensity: 1.0,
    skyColor: new Color4(0.4, 0.6, 0.9, 1),
    ceilingLightColor: new Color3(1, 1, 1),
    ceilingLightIntensity: 0.5,
  },
  evening: {
    ambientLight: new Color3(1, 0.5, 0.3),
    lightIntensity: 0.6,
    skyColor: new Color4(0.3, 0.2, 0.4, 1),
    ceilingLightColor: new Color3(0.9, 0.8, 1),
    ceilingLightIntensity: 0.7,
  },
  night: {
    ambientLight: new Color3(0.2, 0.2, 0.5),
    lightIntensity: 0.2,
    skyColor: new Color4(0.05, 0.05, 0.1, 1),
    ceilingLightColor: new Color3(0.8, 0.9, 1),
    ceilingLightIntensity: 0.9,
  },
};

// ...
  const [cameraPerspective, setCameraPerspective] = useState<'default' | 'aerial' | 'startingBlock' | 'racing'>('default');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [countdown, setCountdown] = useState(0);
  const [raceStatus, setRaceStatus] = useState<'idle' | 'countdown' | 'racing' | 'finished'>('idle');
  const cameraPerspectiveRef = useRef(cameraPerspective);
  useEffect(() => {
    cameraPerspectiveRef.current = cameraPerspective;
  }, [cameraPerspective]);
  const countdownRef = useRef(0);
  const raceActiveRef = useRef(false);
  const isRecordingRef = useRef(false);
  const isReplayingRef = useRef(false);
  const recordedDataRef = useRef<any[]>([]);
  const replayFrameRef = useRef(0);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const lightRef = useRef<HemisphericLight | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const startLightMatsRef = useRef<StandardMaterial[]>([]);
  const spotLightsRef = useRef<SpotLight[]>([]);
  const lightPanelMatRef = useRef<StandardMaterial | null>(null);

  useEffect(() => {
    if (!sceneRef.current || !lightRef.current) return;
    
    sceneRef.current.clearColor = TIME_OF_DAY_CONFIG[timeOfDay].skyColor;
    lightRef.current.diffuse = TIME_OF_DAY_CONFIG[timeOfDay].ambientLight;
    lightRef.current.intensity = TIME_OF_DAY_CONFIG[timeOfDay].lightIntensity;
    
    if (lightPanelMatRef.current) {
        lightPanelMatRef.current.emissiveColor = TIME_OF_DAY_CONFIG[timeOfDay].ceilingLightColor;
    }
    spotLightsRef.current.forEach(spotLight => {
        spotLight.diffuse = TIME_OF_DAY_CONFIG[timeOfDay].ceilingLightColor;
        spotLight.intensity = TIME_OF_DAY_CONFIG[timeOfDay].ceilingLightIntensity;
    });
  }, [timeOfDay]);

  useEffect(() => {
    if (!cameraRef.current) return;
    
    switch(cameraPerspective) {
      case 'aerial':
        cameraRef.current.alpha = -Math.PI / 2;
        cameraRef.current.beta = 0.1;
        cameraRef.current.radius = 80;
        cameraRef.current.target = new Vector3(0, 0, 0);
        break;
      case 'racing':
        // Camera will be controlled by the render loop
        break;
      case 'startingBlock':
        cameraRef.current.alpha = -Math.PI / 2;
        cameraRef.current.beta = Math.PI / 2 - 0.5;
        cameraRef.current.radius = 15;
        cameraRef.current.target = new Vector3(0, 1, -20);
        break;
      case 'default':
      default:
        cameraRef.current.alpha = -Math.PI / 2;
        cameraRef.current.beta = Math.PI / 3;
        cameraRef.current.radius = 40;
        cameraRef.current.target = new Vector3(0, 0, 0);
        break;
    }
  }, [cameraPerspective]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let v = VENUES[currentVenue];
    
    if (currentVenue === 'custom') {
      v = {
        ...v,
        skyColor: Color4.FromHexString(customColors.skyColor + 'FF'),
        hallColor: Color3.FromHexString(customColors.hallColor),
        waterColor: Color3.FromHexString(customColors.waterColor),
        deckColor: Color3.FromHexString(customColors.deckColor),
        blockColor: Color3.FromHexString(customColors.blockColor),
        signColor: Color3.FromHexString(customColors.blockColor),
      };
    }

    const engine = new Engine(canvasRef.current, true);
    sceneRef.current = new Scene(engine);
    sceneRef.current.clearColor = TIME_OF_DAY_CONFIG[timeOfDay].skyColor;
    const scene = sceneRef.current;
    
    // Fog
    scene.fogMode = Scene.FOGMODE_EXP;
    scene.fogDensity = 0.005;
    const clearColor = scene.clearColor as Color4;
    scene.fogColor = new Color3(clearColor.r, clearColor.g, clearColor.b);

    // Camera
    cameraRef.current = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      40,
      new Vector3(0, 0, 0),
      scene
    );
    cameraRef.current.attachControl(canvasRef.current, true);
    cameraRef.current.lowerRadiusLimit = 10;
    cameraRef.current.upperRadiusLimit = 100; // Keep camera inside the hall
    
    // Restrict camera angles to prevent looking underneath the stadium
    cameraRef.current.upperBetaLimit = Math.PI / 2 - 0.05; // Stop just above the floor
    cameraRef.current.lowerBetaLimit = 0.1; // Prevent looking directly top-down
    
    // Disable panning so the stadium doesn't slide away
    cameraRef.current.panningSensibility = 0;

    // Light
    lightRef.current = new HemisphericLight('light', new Vector3(0, 1, 0), sceneRef.current);
    lightRef.current.diffuse = TIME_OF_DAY_CONFIG[timeOfDay].ambientLight;
    lightRef.current.intensity = TIME_OF_DAY_CONFIG[timeOfDay].lightIntensity;
    
    // Initial ceiling light settings
    if (lightPanelMatRef.current) {
        lightPanelMatRef.current.emissiveColor = TIME_OF_DAY_CONFIG[timeOfDay].ceilingLightColor;
    }
    spotLightsRef.current.forEach(spotLight => {
        spotLight.diffuse = TIME_OF_DAY_CONFIG[timeOfDay].ceilingLightColor;
        spotLight.intensity = TIME_OF_DAY_CONFIG[timeOfDay].ceilingLightIntensity;
    });

    // Pool Dimensions
    const poolWidth = 20;
    const poolLength = 40;
    const poolDepth = 3;
    const laneCount = 8;
    const laneWidth = poolWidth / laneCount;

    // Indoor Hall Dimensions
    const hallWidth = 100;
    const hallLength = 140;
    const hallHeight = 45;

    // Indoor Hall (Building)
    const hall = MeshBuilder.CreateBox('hall', { 
      width: hallWidth, 
      height: hallHeight, 
      depth: hallLength,
      sideOrientation: Mesh.BACKSIDE 
    }, scene);
    hall.position.y = hallHeight / 2 - 0.25; // Align with deck
    
    const hallMat = new StandardMaterial('hallMat', scene);
    hallMat.diffuseColor = v.hallColor;
    hallMat.specularColor = new Color3(0.1, 0.1, 0.1);
    hall.material = hallMat;

    // Ceiling Lights
    const lightPanels: Mesh[] = [];
    const lightPanelMat = new StandardMaterial('lightPanelMat', scene);
    lightPanelMatRef.current = lightPanelMat;
    lightPanelMat.emissiveColor = v.ceilingLightColor;
    lightPanelMat.disableLighting = true;
    lightPanelMat.alpha = 0.9; // Slight transparency for glow effect

    for (let i = -3; i <= 3; i+=2) {
      const panel = MeshBuilder.CreatePlane(`lightPanel${i}`, { width: 2, height: hallLength - 20 }, scene);
      panel.rotation.x = Math.PI / 2;
      panel.position.y = hallHeight - 0.5;
      panel.position.x = i * 8;
      panel.material = lightPanelMat;
      lightPanels.push(panel);

      // Add SpotLight for each panel
      const spotLight = new SpotLight(`spotLight${i}`, new Vector3(i * 8, hallHeight - 1, 0), new Vector3(0, -1, 0), Math.PI / 2, 10, scene);
      spotLight.diffuse = v.ceilingLightColor;
      spotLight.intensity = 0.5;
      spotLightsRef.current.push(spotLight);
    }

    // Caustics Texture
    const causticsTexture = new Texture('https://playground.babylonjs.com/textures/waterbump.png', scene);
    causticsTexture.uScale = 4;
    causticsTexture.vScale = 8;

    // Pool Floor
    const floor = MeshBuilder.CreatePlane('floor', { width: poolWidth, height: poolLength }, scene);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -poolDepth;
    const floorMat = new StandardMaterial('floorMat', scene);
    floorMat.diffuseColor = new Color3(0.5, 0.8, 1.0); // Light blue
    floorMat.diffuseTexture = new Texture('https://playground.babylonjs.com/textures/tile.jpg', scene); 
    (floorMat.diffuseTexture as Texture).uScale = 10;
    (floorMat.diffuseTexture as Texture).vScale = 20;
    floorMat.emissiveTexture = causticsTexture;
    floorMat.emissiveColor = new Color3(0.2, 0.4, 0.6); // Brighter caustics
    floor.material = floorMat;

    // Lane Markings on Floor
    for (let i = 0; i < laneCount; i++) {
      const laneLine = MeshBuilder.CreatePlane(`laneLine${i}`, { width: 0.2, height: poolLength * 0.8 }, scene);
      laneLine.rotation.x = Math.PI / 2;
      laneLine.position.y = -poolDepth + 0.01;
      laneLine.position.x = -poolWidth / 2 + (i + 0.5) * laneWidth;
      laneLine.position.z = 0;
      const lineMat = new StandardMaterial('lineMat', scene);
      lineMat.diffuseColor = new Color3(0, 0, 0.5);
      laneLine.material = lineMat;
    }

    // Pool Walls
    const wallMat = new StandardMaterial('wallMat', scene);
    wallMat.diffuseColor = new Color3(0.4, 0.7, 0.9);
    wallMat.diffuseTexture = new Texture('https://playground.babylonjs.com/textures/tile.jpg', scene);
    (wallMat.diffuseTexture as Texture).uScale = 10;
    (wallMat.diffuseTexture as Texture).vScale = 2;
    wallMat.emissiveTexture = causticsTexture;
    wallMat.emissiveColor = new Color3(0.1, 0.3, 0.6);

    const wallBack = MeshBuilder.CreatePlane('wallBack', { width: poolWidth, height: poolDepth }, scene);
    wallBack.position.z = poolLength / 2;
    wallBack.position.y = -poolDepth / 2;
    wallBack.material = wallMat;

    const wallFront = MeshBuilder.CreatePlane('wallFront', { width: poolWidth, height: poolDepth }, scene);
    wallFront.rotation.y = Math.PI;
    wallFront.position.z = -poolLength / 2;
    wallFront.position.y = -poolDepth / 2;
    wallFront.material = wallMat;

    const wallLeft = MeshBuilder.CreatePlane('wallLeft', { width: poolLength, height: poolDepth }, scene);
    wallLeft.rotation.y = -Math.PI / 2;
    wallLeft.position.x = -poolWidth / 2;
    wallLeft.position.y = -poolDepth / 2;
    wallLeft.material = wallMat;

    const wallRight = MeshBuilder.CreatePlane('wallRight', { width: poolLength, height: poolDepth }, scene);
    wallRight.rotation.y = Math.PI / 2;
    wallRight.position.x = poolWidth / 2;
    wallRight.position.y = -poolDepth / 2;
    wallRight.material = wallMat;

    // Pool Deck with Hole
    const deckMat = new StandardMaterial('deckMat', scene);
    deckMat.diffuseColor = v.deckColor;
    deckMat.diffuseTexture = new Texture('https://playground.babylonjs.com/textures/concrete.jpg', scene); 
    (deckMat.diffuseTexture as Texture).uScale = 10;
    (deckMat.diffuseTexture as Texture).vScale = 10;

    const mainDeck = MeshBuilder.CreateBox('mainDeck', { width: hallWidth, height: 0.5, depth: hallLength }, scene);
    const poolHole = MeshBuilder.CreateBox('poolHole', { width: poolWidth, height: 1, depth: poolLength }, scene);
    
    mainDeck.position.y = -0.25;
    poolHole.position.y = -0.25;

    const mainDeckCSG = CSG.FromMesh(mainDeck);
    const poolHoleCSG = CSG.FromMesh(poolHole);
    const deckCSG = mainDeckCSG.subtract(poolHoleCSG);
    
    const deck = deckCSG.toMesh('deck', deckMat, scene);
    deck.isPickable = false;
    
    mainDeck.dispose();
    poolHole.dispose();

    // Seating / Bleachers
    const createBleachers = () => {
      const bleacherGroup = new Mesh('bleachers', scene);
      const stepCount = 18;
      const stepHeight = 0.6;
      const stepDepth = 1.2;
      const bleacherWidth = poolLength + 10;

      const stepMat = new StandardMaterial('stepMat', scene);
      stepMat.diffuseColor = new Color3(0.4, 0.4, 0.45);

      // Crowd material
      const crowdMat = new StandardMaterial('crowdMat', scene);
      crowdMat.diffuseColor = new Color3(0.2, 0.2, 0.2); // Dark spectators

      for (let i = 0; i < stepCount; i++) {
        // Left bleachers
        const stepL = MeshBuilder.CreateBox(`stepL_${i}`, { width: stepDepth, height: stepHeight * (i + 1), depth: bleacherWidth }, scene);
        stepL.position.x = -poolWidth / 2 - 8 - (i * stepDepth);
        stepL.position.y = (stepHeight * (i + 1)) / 2 - 0.25;
        stepL.position.z = 0;
        stepL.material = stepMat;
        stepL.parent = bleacherGroup;

        // Add crowd to Left
        for (let j = 0; j < 20; j++) {
            const spectatorGroup = new Mesh(`specL_${i}_${j}`, scene);
            spectatorGroup.position.set(stepL.position.x, stepL.position.y, (Math.random() - 0.5) * bleacherWidth);
            
            // Torso
            const torso = MeshBuilder.CreateBox("torso", { width: 0.4, height: 0.6, depth: 0.3 }, scene);
            torso.position.y = 0.3;
            torso.material = crowdMat;
            torso.parent = spectatorGroup;
            
            // Head
            const head = MeshBuilder.CreateSphere("head", { diameter: 0.3 }, scene);
            head.position.y = 0.8;
            head.material = crowdMat;
            head.parent = spectatorGroup;
            
            spectatorGroup.parent = bleacherGroup;
        }

        // Right bleachers
        const stepR = MeshBuilder.CreateBox(`stepR_${i}`, { width: stepDepth, height: stepHeight * (i + 1), depth: bleacherWidth }, scene);
        stepR.position.x = poolWidth / 2 + 8 + (i * stepDepth);
        stepR.position.y = (stepHeight * (i + 1)) / 2 - 0.25;
        stepR.position.z = 0;
        stepR.material = stepMat;
        stepR.parent = bleacherGroup;

        // Add crowd to Right
        for (let j = 0; j < 20; j++) {
            const spectatorGroup = new Mesh(`specR_${i}_${j}`, scene);
            spectatorGroup.position.set(stepR.position.x, stepR.position.y, (Math.random() - 0.5) * bleacherWidth);
            
            // Torso
            const torso = MeshBuilder.CreateBox("torso", { width: 0.4, height: 0.6, depth: 0.3 }, scene);
            torso.position.y = 0.3;
            torso.material = crowdMat;
            torso.parent = spectatorGroup;
            
            // Head
            const head = MeshBuilder.CreateSphere("head", { diameter: 0.3 }, scene);
            head.position.y = 0.8;
            head.material = crowdMat;
            head.parent = spectatorGroup;
            
            spectatorGroup.parent = bleacherGroup;
        }

        // Front bleachers
        const stepF = MeshBuilder.CreateBox(`stepF_${i}`, { width: poolWidth + 10, height: stepHeight * (i + 1), depth: stepDepth }, scene);
        stepF.position.x = 0;
        stepF.position.y = (stepHeight * (i + 1)) / 2 - 0.25;
        stepF.position.z = -poolLength / 2 - 8 - (i * stepDepth);
        stepF.material = stepMat;
        stepF.parent = bleacherGroup;

        // Back bleachers
        const stepB = MeshBuilder.CreateBox(`stepB_${i}`, { width: poolWidth + 10, height: stepHeight * (i + 1), depth: stepDepth }, scene);
        stepB.position.x = 0;
        stepB.position.y = (stepHeight * (i + 1)) / 2 - 0.25;
        stepB.position.z = poolLength / 2 + 8 + (i * stepDepth);
        stepB.material = stepMat;
        stepB.parent = bleacherGroup;
      }
      return bleacherGroup;
    };
    const bleachers = createBleachers();

    // Railings
    const createRailings = () => {
      const railingGroup = new Mesh('railings', scene);
      const railingColor = new Color3(0.9, 0.9, 0.9);
      const railingMat = new StandardMaterial('railingMat', scene);
      railingMat.diffuseColor = railingColor;
      railingMat.specularColor = new Color3(1, 1, 1);

      const addRailSection = (start: Vector3, end: Vector3) => {
        const distance = Vector3.Distance(start, end);
        const rail = MeshBuilder.CreateCylinder('rail', { height: distance, diameter: 0.1 }, scene);
        rail.position = Vector3.Center(start, end);
        rail.lookAt(end);
        rail.rotate(new Vector3(1, 0, 0), Math.PI / 2);
        rail.material = railingMat;
        rail.parent = railingGroup;
      };

      const addPost = (pos: Vector3) => {
        const post = MeshBuilder.CreateCylinder('post', { height: 1.2, diameter: 0.15 }, scene);
        post.position = pos.add(new Vector3(0, 0.6, 0));
        post.material = railingMat;
        post.parent = railingGroup;
      };

      // Perimeter Railings
      const corners = [
        new Vector3(-poolWidth / 2 - 1, 0, -poolLength / 2 - 1),
        new Vector3(poolWidth / 2 + 1, 0, -poolLength / 2 - 1),
        new Vector3(poolWidth / 2 + 1, 0, poolLength / 2 + 1),
        new Vector3(-poolWidth / 2 - 1, 0, poolLength / 2 + 1),
      ];

      for (let i = 0; i < corners.length; i++) {
        const next = corners[(i + 1) % corners.length];
        // Skip the sides with bleachers
        if (i === 1 || i === 3) continue; 
        
        const segments = 10;
        for (let j = 0; j <= segments; j++) {
          const pos = Vector3.Lerp(corners[i], next, j / segments);
          addPost(pos);
          if (j < segments) {
            const nextPos = Vector3.Lerp(corners[i], next, (j + 1) / segments);
            addRailSection(pos.add(new Vector3(0, 1.1, 0)), nextPos.add(new Vector3(0, 1.1, 0)));
            addRailSection(pos.add(new Vector3(0, 0.6, 0)), nextPos.add(new Vector3(0, 0.6, 0)));
          }
        }
      }
      return railingGroup;
    };
    const railings = createRailings();

    // Stadium Scoreboard (Jumbotron)
    const scoreboard = MeshBuilder.CreateBox('scoreboard', { width: 24, height: 12, depth: 1 }, scene);
    scoreboard.position.set(0, 18, poolLength / 2 + 15);
    const sbMat = new StandardMaterial('sbMat', scene);
    const sbTex = new DynamicTexture('sbTex', { width: 1024, height: 512 }, scene);
    sbMat.diffuseTexture = sbTex;
    sbMat.emissiveTexture = sbTex; // Use texture for emissive to make text glow
    sbMat.emissiveColor = new Color3(0.6, 0.6, 0.6);
    scoreboard.material = sbMat;
    
    // Glow Layer for scoreboard and lights
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.8;
    
    sbTex.drawText(v.scoreboardTitle, null, 80, "bold 60px Arial", v.scoreboardText, v.scoreboardBg, true, true);
    sbTex.drawText("1. PHELPS      49.82", null, 180, "bold 40px Arial", v.scoreboardText, null, true, true);
    sbTex.drawText("2. DRESSEL     49.88", null, 250, "bold 40px Arial", v.scoreboardText, null, true, true);
    sbTex.drawText("3. MILAK       50.14", null, 320, "bold 40px Arial", v.scoreboardText, null, true, true);
    sbTex.drawText("TIME: 00:49.82", null, 450, "bold 50px Arial", v.scoreboardText, null, true, true);

    // Roof Trusses
    const trusses: Mesh[] = [];
    const trussMat = new StandardMaterial('trussMat', scene);
    trussMat.diffuseColor = new Color3(0.15, 0.15, 0.15);
    for (let z = -hallLength/2 + 10; z <= hallLength/2 - 10; z += 20) {
        const truss = MeshBuilder.CreateCylinder(`truss_${z}`, { height: hallWidth, diameter: 0.8 }, scene);
        truss.rotation.z = Math.PI / 2;
        truss.position.set(0, hallHeight - 2, z);
        truss.material = trussMat;
        trusses.push(truss);
    }

    // Banners
    const banners: Mesh[] = [];
    const bannerColors = ["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#42d4f4"];
    for (let i = 0; i < bannerColors.length; i++) {
        const banner = MeshBuilder.CreatePlane(`banner_${i}`, { width: 4, height: 10, sideOrientation: Mesh.DOUBLESIDE }, scene);
        const xPos = -hallWidth/2 + 15 + i * ((hallWidth - 30) / (bannerColors.length - 1));
        banner.position.set(xPos, hallHeight - 7, -hallLength/2 + 1);
        const bMat = new StandardMaterial(`bMat_${i}`, scene);
        bMat.diffuseColor = Color3.FromHexString(bannerColors[i]);
        banner.material = bMat;
        banners.push(banner);
    }

    // Water
    const waterMesh = MeshBuilder.CreateGround('waterMesh', { width: poolWidth, height: poolLength, subdivisions: 64 }, scene);
    waterMesh.position.y = -0.2;
    const water = new WaterMaterial('water', scene, new Vector2(1024, 1024));
    water.bumpTexture = new Texture('https://playground.babylonjs.com/textures/waterbump.png', scene);
    water.windForce = 20;
    water.waveHeight = 0.35;
    water.bumpHeight = 0.4;
    water.waveLength = 0.08;
    water.waterColor = v.waterColor;
    water.colorBlendFactor = 0.4; // Increased blend factor for more reflection
    
    water.addToRenderList(hall);
    lightPanels.forEach(p => water.addToRenderList(p));
    water.addToRenderList(floor);
    water.addToRenderList(wallBack);
    water.addToRenderList(wallFront);
    water.addToRenderList(wallLeft);
    water.addToRenderList(wallRight);
    water.addToRenderList(bleachers);
    water.addToRenderList(railings);
    water.addToRenderList(scoreboard);
    trusses.forEach(t => water.addToRenderList(t));
    banners.forEach(b => water.addToRenderList(b));
    waterMesh.material = water;

    // Ambient Splashes (Particle System)
    const splashParticles = new ParticleSystem('splashes', 1500, scene);
    splashParticles.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png', scene);
    
    // Emit from the entire surface of the pool
    splashParticles.createBoxEmitter(
      new Vector3(0, 1, 0), // direction1
      new Vector3(0, 1.5, 0), // direction2
      new Vector3(-poolWidth / 2 + 0.5, -0.2, -poolLength / 2 + 0.5), // minEmitBox
      new Vector3(poolWidth / 2 - 0.5, -0.2, poolLength / 2 - 0.5) // maxEmitBox
    );

    splashParticles.color1 = new Color4(0.8, 0.9, 1.0, 0.6);
    splashParticles.color2 = new Color4(0.9, 1.0, 1.0, 0.3);
    splashParticles.colorDead = new Color4(1, 1, 1, 0.0);
    
    splashParticles.minSize = 0.02;
    splashParticles.maxSize = 0.08;
    splashParticles.minLifeTime = 0.2;
    splashParticles.maxLifeTime = 0.6;
    splashParticles.emitRate = 200; // Subtle ambient bubbling/splashing
    
    splashParticles.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    splashParticles.gravity = new Vector3(0, -9.81, 0);
    splashParticles.minEmitPower = 0.5;
    splashParticles.maxEmitPower = 1.5;
    splashParticles.updateSpeed = 0.01;
    
    splashParticles.start();

    // Interactive Splashes & Ripples
    const createInteractiveSplash = (position: Vector3) => {
      const splash = new ParticleSystem('interactiveSplash', 100, scene);
      splash.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png', scene);
      splash.emitter = position;
      splash.minEmitBox = new Vector3(-0.5, 0, -0.5);
      splash.maxEmitBox = new Vector3(0.5, 0, 0.5);
      splash.color1 = new Color4(0.8, 0.9, 1.0, 0.8);
      splash.color2 = new Color4(0.9, 1.0, 1.0, 0.5);
      splash.colorDead = new Color4(1, 1, 1, 0.0);
      splash.minSize = 0.05;
      splash.maxSize = 0.15;
      splash.minLifeTime = 0.2;
      splash.maxLifeTime = 0.6;
      splash.emitRate = 1000;
      splash.blendMode = ParticleSystem.BLENDMODE_STANDARD;
      splash.gravity = new Vector3(0, -9.81, 0);
      splash.direction1 = new Vector3(-1.5, 3, -1.5);
      splash.direction2 = new Vector3(1.5, 5, 1.5);
      splash.minEmitPower = 1;
      splash.maxEmitPower = 2.5;
      splash.updateSpeed = 0.02;
      splash.targetStopDuration = 0.15; // Stop emitting quickly
      splash.disposeOnStop = true;
      splash.start();
    };

    const createRipple = (position: Vector3) => {
      const ripple = MeshBuilder.CreateTorus('ripple', { diameter: 0.5, thickness: 0.03, tessellation: 32 }, scene);
      ripple.position = position.clone();
      ripple.position.y = -0.19; // Just above water surface
      ripple.scaling = new Vector3(1, 0.05, 1);
      
      const rippleMat = new StandardMaterial('rippleMat', scene);
      rippleMat.diffuseColor = new Color3(0.8, 0.9, 1.0);
      rippleMat.alpha = 0.7;
      rippleMat.disableLighting = true;
      ripple.material = rippleMat;

      // Expand ripple
      Animation.CreateAndStartAnimation('rippleScale', ripple, 'scaling', 60, 60, new Vector3(1, 0.05, 1), new Vector3(6, 0.05, 6), 0, undefined, () => {
         ripple.dispose();
      });
      // Fade out ripple
      Animation.CreateAndStartAnimation('rippleAlpha', rippleMat, 'alpha', 60, 60, 0.7, 0, 0);
    };

    // Click interaction
    scene.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit && pickResult.pickedMesh === waterMesh) {
        createInteractiveSplash(pickResult.pickedPoint!);
        createRipple(pickResult.pickedPoint!);
      }
    };

    // Initialize SwimmerManager for 3D models
    const swimmerManager = new SwimmerManager(scene, poolWidth, 8);
    try {
      swimmerManager.initialize();
      console.log('SwimmerManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SwimmerManager:', error);
      throw error;
    }

    // Swimmers Data
    const swimmersData = [
      { name: "PHELPS", lane: 4, speed: 2.45, color: new Color3(1, 0.4, 0) },
      { name: "DRESSEL", lane: 5, speed: 2.42, color: new Color3(0, 0.5, 1) },
      { name: "MILAK", lane: 3, speed: 2.38, color: new Color3(0.2, 0.8, 0.2) },
      { name: "POPOVICI", lane: 6, speed: 2.40, color: new Color3(0.8, 0.2, 0.8) },
      { name: "CHALMERS", lane: 2, speed: 2.35, color: new Color3(1, 0.8, 0) },
      { name: "LE CLOS", lane: 7, speed: 2.32, color: new Color3(0.1, 0.1, 0.1) },
      { name: "GUY", lane: 1, speed: 2.30, color: new Color3(0.5, 0.5, 0.5) },
      { name: "PROUD", lane: 8, speed: 2.48, color: new Color3(1, 1, 1) },
    ];

    const swimmers: any[] = [];
    swimmersData.forEach((data, i) => {
      const swimmerInstance = swimmerManager.getSwimmer(i);
      if (!swimmerInstance || !swimmerInstance.mesh) {
        console.error(`Failed to get swimmer at lane ${i}`);
        return;
      }

      const swimmer = swimmerInstance.mesh;

      // Validate mesh has position and rotation
      if (!swimmer.position || !swimmer.rotation) {
        console.error(`Swimmer mesh invalid at lane ${i}`);
        return;
      }

      // Initial position on starting block
      swimmer.position.x = -poolWidth / 2 + (data.lane - 0.5) * laneWidth;
      swimmer.position.y = 1.2; // Standing on block
      swimmer.position.z = -poolLength / 2 - 1.2;
      swimmer.rotation.x = Math.PI / 8; // Leaning forward slightly

      // Update swimmer colors
      swimmerManager.setSwimmerSuitColor(i, data.color);

      // Add all swimmer body meshes to water render list
      const bodyMeshes = swimmerManager.getSwimmerBodyMeshes(i);
      if (bodyMeshes && bodyMeshes.length > 0) {
        bodyMeshes.forEach((mesh) => {
          if (mesh) {
            water.addToRenderList(mesh);
          }
        });
      }

      swimmers.push({
        mesh: swimmer,
        data: data,
        z: -poolLength / 2 - 1.2,
        y: 1.2,
        dir: 1,
        time: 0,
        finished: false,
        rank: 0,
        speed: data.speed + (Math.random() * 0.1 - 0.05), // Slight random variation
        state: 'waiting', // waiting, diving, swimming
        diveTime: 0
      });
    });

    // Verify we have 8 swimmers
    if (swimmers.length !== 8) {
      console.warn(`Expected 8 swimmers but got ${swimmers.length}`);
    }

    let raceTime = 0;
    let raceActive = false;
    let lastRippleTime = 0;
    
    // Use the component state for countdown and raceStatus
    // But we need to update them from the loop.
    // This is tricky because we are inside a useEffect.
    // Let's use refs for the loop and update the state.

    // Update Scoreboard Function
    const updateScoreboard = () => {
      sbTex.drawText(v.scoreboardTitle, null, 60, "bold 45px Arial", v.scoreboardText, v.scoreboardBg, true, true);
      
      // Sort swimmers by progress/time for ranking
      const sorted = [...swimmers].sort((a, b) => {
        if (a.finished && b.finished) return a.time - b.time;
        if (a.finished) return -1;
        if (b.finished) return 1;
        return b.z - a.z; // Further along is "better"
      });

      sorted.forEach((s, i) => {
        const yPos = 130 + i * 45;
        const rank = s.finished ? s.rank : i + 1;
        const timeStr = s.finished ? s.time.toFixed(2) : raceTime.toFixed(2);
        
        // High-contrast colors for rankings
        const color = i === 0 ? "#FFD700" : i === 1 ? "#E0E0E0" : i === 2 ? "#CD7F32" : v.scoreboardText;
        
        sbTex.drawText(`${rank}. L${s.data.lane}  ${s.data.name.padEnd(12)} ${timeStr}`, 50, yPos, "bold 32px monospace", color, null, true, false);
      });

      let statusText = "";
      if (!raceActiveRef.current && countdownRef.current > 0) {
        statusText = `STARTING IN: ${Math.ceil(countdownRef.current)}`;
        // Animate lights: 3=Red, 2=Yellow, 1=Green
        const step = Math.ceil(countdownRef.current); // 3, 2, 1
        startLightMatsRef.current.forEach((mat, index) => {
            const lightIndex = index % 3; // 0 (top), 1 (middle), 2 (bottom)
            if (3 - step >= lightIndex) {
                mat.emissiveColor = new Color3(1, 0, 0); // Red
            } else {
                mat.emissiveColor = new Color3(0, 0, 0); // Off
            }
        });
      } else if (raceActiveRef.current) {
        statusText = `RACE TIME: ${raceTime.toFixed(2)}`;
        startLightMatsRef.current.forEach(mat => mat.emissiveColor = new Color3(0, 1, 0)); // Green
      } else {
        statusText = "RACE FINISHED";
        startLightMatsRef.current.forEach(mat => mat.emissiveColor = new Color3(0, 0, 0)); // Off
      }
      sbTex.drawText(statusText, null, 490, "bold 40px Arial", "#00FF00", null, true, true);
    };

    // Lane Ropes
    const createLaneRope = (x: number) => {
      const ropeGroup = new Mesh(`rope_${x}`, scene);
      const buoyCount = 100;
      const buoySpacing = poolLength / buoyCount;
      
      for (let i = 0; i < buoyCount; i++) {
        const buoy = MeshBuilder.CreateSphere(`buoy_${x}_${i}`, { diameter: 0.2 }, scene);
        buoy.position.x = x;
        buoy.position.z = -poolLength / 2 + i * buoySpacing;
        buoy.position.y = -0.15;
        
        const buoyMat = new StandardMaterial(`buoyMat_${x}_${i}`, scene);
        if (i % 4 < 2) {
          buoyMat.diffuseColor = v.ropeColors[0];
        } else {
          buoyMat.diffuseColor = v.ropeColors[1];
        }
        buoy.material = buoyMat;
        buoy.parent = ropeGroup;
      }
      water.addToRenderList(ropeGroup);
    };

    for (let i = 1; i < laneCount; i++) {
      createLaneRope(-poolWidth / 2 + i * laneWidth);
    }

    // Starting Blocks
    const athletes = ["Phelps", "Ledecky", "Dressel", "Sjöström", "Peaty", "McKeon", "Milak", "Titmus"];
    
    const createStartingBlock = (x: number, laneIndex: number) => {
      const blockBase = MeshBuilder.CreateBox(`blockBase_${laneIndex}`, { width: 0.8, height: 0.6, depth: 0.8 }, scene);
      blockBase.position.x = x;
      blockBase.position.z = -poolLength / 2 - 1.2;
      blockBase.position.y = 0.3;
      
      const blockTop = MeshBuilder.CreateBox(`blockTop_${laneIndex}`, { width: 0.9, height: 0.1, depth: 0.9 }, scene);
      blockTop.position.x = x;
      blockTop.position.z = -poolLength / 2 - 1.2;
      blockTop.position.y = 0.65;
      blockTop.rotation.x = Math.PI / 12;

      const blockMat = new StandardMaterial(`blockMat_${laneIndex}`, scene);
      blockMat.diffuseColor = v.blockColor;
      blockBase.material = blockMat;

      // Dynamic Texture for Lane Number on the front of the base
      const frontTex = new DynamicTexture(`frontTex_${laneIndex}`, { width: 256, height: 128 }, scene);
      const frontMat = new StandardMaterial(`frontMat_${laneIndex}`, scene);
      frontMat.diffuseTexture = frontTex;
      frontTex.hasAlpha = true;
      
      const laneNumPlane = MeshBuilder.CreatePlane(`laneNumPlane_${laneIndex}`, { width: 0.6, height: 0.4 }, scene);
      laneNumPlane.position.set(x, 0.3, -poolLength / 2 - 1.2 + 0.41); // Slightly in front of the base
      laneNumPlane.material = frontMat;
      water.addToRenderList(laneNumPlane);
      
      frontTex.drawText(
        `${laneIndex + 1}`,
        null,
        null,
        "bold 80px Arial",
        "white",
        "transparent",
        true,
        true
      );

      // Dynamic Texture for Lane Number and Athlete Name on top
      const dynamicTexture = new DynamicTexture(`dynamicTex_${laneIndex}`, { width: 512, height: 512 }, scene);
      const topMat = new StandardMaterial(`topMat_${laneIndex}`, scene);
      topMat.diffuseTexture = dynamicTexture;
      blockTop.material = topMat;

      const font = "bold 80px Arial";
      dynamicTexture.drawText(
        `LANE ${laneIndex + 1}`,
        null,
        150,
        font,
        "white",
        "#1a1a4a",
        true,
        true
      );
      dynamicTexture.drawText(
        athletes[laneIndex],
        null,
        350,
        "60px Arial",
        "#00ffcc",
        null,
        true,
        true
      );

      water.addToRenderList(blockBase);
      water.addToRenderList(blockTop);
    };

    for (let i = 0; i < laneCount; i++) {
      createStartingBlock(-poolWidth / 2 + (i + 0.5) * laneWidth, i);
    }

    // Signage / Flags
    const createFlagPost = (x: number, z: number) => {
      const post = MeshBuilder.CreateCylinder(`post_${x}_${z}`, { diameter: 0.1, height: 4 }, scene);
      post.position.set(x, 2, z);
      const postMat = new StandardMaterial(`postMat_${x}_${z}`, scene);
      postMat.diffuseColor = new Color3(0.5, 0.5, 0.5);
      post.material = postMat;

      const sign = MeshBuilder.CreatePlane(`sign_${x}_${z}`, { size: 1.5 }, scene);
      sign.position.set(x, 3.5, z);
      sign.rotation.y = Math.PI / 2;
      const signMat = new StandardMaterial(`signMat_${x}_${z}`, scene);
      signMat.diffuseColor = v.signColor;
      sign.material = signMat;
      
      const signTex = new DynamicTexture(`signTex_${x}_${z}`, { width: 256, height: 256 }, scene);
      signTex.drawText("FINISH", null, 140, "bold 40px Arial", v.signTextColor, v.signColor.toHexString(), true, true);
      signMat.diffuseTexture = signTex;
      
      water.addToRenderList(post);
      water.addToRenderList(sign);
    };

    createFlagPost(-poolWidth / 2 - 2, poolLength / 2 + 2);
    createFlagPost(poolWidth / 2 + 2, poolLength / 2 + 2);

    // Starting Light System
    startLightMatsRef.current = [];
    const createStartLightSystem = (xPos: number, facingRight: boolean) => {
      const pole = MeshBuilder.CreateCylinder(`lightPole_${xPos}`, { diameter: 0.2, height: 4 }, scene);
      pole.position.set(xPos, 2, -poolLength / 2 - 1.2);
      const poleMat = new StandardMaterial(`lightPoleMat_${xPos}`, scene);
      poleMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
      pole.material = poleMat;

      const box = MeshBuilder.CreateBox(`lightBox_${xPos}`, { width: 0.4, height: 1.8, depth: 0.6 }, scene);
      box.position.set(xPos, 3, -poolLength / 2 - 1.2);
      const boxMat = new StandardMaterial(`lightBoxMat_${xPos}`, scene);
      boxMat.diffuseColor = new Color3(0.1, 0.1, 0.1);
      box.material = boxMat;

      for (let i = 0; i < 3; i++) {
        const light = MeshBuilder.CreateSphere(`startLight_${xPos}_${i}`, { diameter: 0.4 }, scene);
        // Position slightly forward (towards the pool)
        light.position.set(xPos + (facingRight ? 0.2 : -0.2), 3.6 - i * 0.6, -poolLength / 2 - 1.2);
        const lightMat = new StandardMaterial(`startLightMat_${xPos}_${i}`, scene);
        lightMat.diffuseColor = new Color3(0.1, 0.1, 0.1);
        lightMat.emissiveColor = new Color3(0, 0, 0); // Off initially
        light.material = lightMat;
        startLightMatsRef.current.push(lightMat);
      }
    };
    
    // Create lights on both sides of the starting blocks
    createStartLightSystem(-poolWidth / 2 - 2, true);
    createStartLightSystem(poolWidth / 2 + 2, false);

    let time = 0;
    engine.runRenderLoop(() => {
      const dt = engine.getDeltaTime() * 0.001;
      time += dt;
      
      // Dynamic currents: slowly shift wind direction and modulate wave height
      if (water) {
        water.windDirection = new Vector2(Math.cos(time * 0.2), Math.sin(time * 0.2));
        water.waveHeight = 0.12 + Math.sin(time * 0.5) * 0.04;
      }

      // Animate caustics
      if (causticsTexture) {
        causticsTexture.uOffset = time * 0.02;
        causticsTexture.vOffset = time * 0.03;
      }

      if (isReplayingRef.current) {
        if (replayFrameRef.current < recordedDataRef.current.length) {
            const frame = recordedDataRef.current[replayFrameRef.current];
            swimmers.forEach((s, i) => {
                if (frame && frame[i] && s && s.mesh) {
                    s.mesh.position.x = frame[i].x;
                    s.mesh.position.y = frame[i].y;
                    s.mesh.position.z = frame[i].z;
                    s.mesh.rotation.x = frame[i].rotationX;
                }
            });
            replayFrameRef.current++;
        } else {
            isReplayingRef.current = false;
        }
      } else {
        // Update Swimmers & Race
        if (!raceActiveRef.current && countdownRef.current > 0) {
            countdownRef.current -= dt;
            setCountdown(countdownRef.current);
            
            // Update Start Lights
            const step = Math.ceil(countdownRef.current); // 3, 2, 1
            startLightMatsRef.current.forEach((mat, index) => {
            const lightIndex = index % 3; // 0 (top), 1 (middle), 2 (bottom)
            if (3 - step >= lightIndex) {
                mat.emissiveColor = new Color3(1, 0, 0); // Red
            } else {
                mat.emissiveColor = new Color3(0, 0, 0);
            }
            });

            if (countdownRef.current <= 0) {
                raceActiveRef.current = true;
                setRaceStatus('racing');
                swimmers.forEach(s => {
                    s.state = 'diving';
                    s.diveTime = 0;
                });
            } else {
                setRaceStatus('countdown');
            }
        }

        if (raceActiveRef.current) {
            raceTime += dt;
            let allFinished = true;
            
            // Start Lights Green for 2 seconds
            if (raceTime < 2) {
            startLightMatsRef.current.forEach(mat => mat.emissiveColor = new Color3(0, 1, 0)); // Green
            } else {
            startLightMatsRef.current.forEach(mat => mat.emissiveColor = new Color3(0, 0, 0)); // Off
            }

            swimmers.forEach(s => {
              if (!s || !s.mesh || !s.mesh.position || !s.mesh.rotation) return;

              if (!s.finished) {
                  allFinished = false;

                  if (s.state === 'diving') {
                    s.diveTime += dt;
                    const diveDuration = 0.6; // 0.6 seconds dive

                    if (s.diveTime < diveDuration) {
                        const t = s.diveTime / diveDuration;

                        // Start: z = -poolLength/2 - 1.2, y = 1.2
                        // End: z = -poolLength/2 + 1.0, y = -0.2
                        const startZ = -poolLength / 2 - 1.2;
                        const endZ = -poolLength / 2 + 1.0;
                        const startY = 1.2;
                        const endY = -0.2;

                        s.z = startZ + (endZ - startZ) * t;
                        // Parabola for Y: goes up slightly then down
                        const height = 0.8;
                        s.y = startY + (endY - startY) * t + Math.sin(t * Math.PI) * height;

                        // Rotation: lean forward to flat
                        s.mesh.rotation.x = Math.PI / 8 + (Math.PI / 2 - Math.PI / 8) * t;

                        s.mesh.position.z = s.z;
                        s.mesh.position.y = s.y;
                    } else {
                        // Dive finished, enter water
                        s.state = 'swimming';
                        s.y = -0.2;
                        s.mesh.position.y = s.y;
                        s.mesh.rotation.x = Math.PI / 2;
                        // Update to swimming pose
                        swimmerManager.updateSwimmerAnimation(swimmers.indexOf(s), 'freestyle');
                        createInteractiveSplash(s.mesh.position); // Big splash on entry
                    }
                  } else if (s.state === 'swimming') {
                    s.z += s.dir * s.speed * dt;

                    // Oscillate swimming pose for animation effect
                    const swimPulse = Math.sin(raceTime * 4) * 0.15;
                    s.mesh.rotation.x = -Math.PI / 6 + swimPulse;

                    // Finish line check (one lap race for simplicity)
                    if (s.z >= poolLength / 2 - 2) {
                        s.z = poolLength / 2 - 2;
                        s.finished = true;
                        s.time = raceTime;
                        s.rank = swimmers.filter(sw => sw.finished).length;
                    }
                    s.mesh.position.z = s.z;

                    // Generate swimmer ripples and splashes periodically
                    if (time - lastRippleTime > 0.4) {
                        createRipple(s.mesh.position);
                        const splashPos = new Vector3(s.mesh.position.x, s.mesh.position.y, s.mesh.position.z - s.dir * 0.6);
                        createInteractiveSplash(splashPos);
                    }
                  }
              }
            });

            if (time - lastRippleTime > 0.4) {
                lastRippleTime = time;
            }

            if (allFinished) {
            raceActiveRef.current = false;
            countdownRef.current = 0; // Ensure it stays finished
            setRaceStatus('finished');
            }
        }
      }

      // Recording
      if (isRecordingRef.current) {
        const frame = swimmers.map(s => ({
            x: s.mesh.position.x,
            y: s.mesh.position.y,
            z: s.mesh.position.z,
            rotationX: s.mesh.rotation.x
        }));
        recordedDataRef.current.push(frame);
      }

      // Update Scoreboard every few frames for performance
      if (Math.floor(time * 10) % 2 === 0) {
        updateScoreboard();
      }

      // Update Camera to follow leader
      if (raceActiveRef.current && cameraPerspectiveRef.current === 'racing') {
          let leader = null;
          let maxZ = -Infinity;
          swimmers.forEach(s => {
              if (!s.finished && s.z > maxZ) {
                  maxZ = s.z;
                  leader = s;
              }
          });

          if (leader) {
              // Smoothly interpolate camera target
              const target = leader.mesh.position;
              cameraRef.current.target = Vector3.Lerp(cameraRef.current.target, target, 0.05);
          }
      }

      scene.render();
    });

    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup swimmers
      try {
        swimmerManager.dispose();
      } catch (e) {
        console.error('Error disposing swimmers:', e);
      }
      // Cleanup scene and engine
      engine.dispose();
    };
  }, [currentVenue, customColors]);

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col overflow-hidden relative">
      {raceStatus === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-9xl font-bold z-20">
          {Math.ceil(countdown)}
        </div>
      )}
      <header className="p-4 bg-black/50 backdrop-blur-md border-b border-white/10 z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Olympic Swimming Arena</h1>
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase tracking-widest">3D Simulation • Babylon.js</p>
        </div>
        <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-300 items-center">
          <button 
            onClick={() => {
                countdownRef.current = 3.0;
                setCountdown(3.0);
                setRaceStatus('countdown');
            }}
            className="px-2 py-1 rounded border bg-emerald-500 text-white"
          >
            Start Race
          </button>
          <select 
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value as 'morning' | 'afternoon' | 'evening' | 'night')}
            className="bg-black/40 border border-white/20 rounded px-2 sm:px-3 py-1 text-white outline-none focus:border-emerald-500"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <select 
            value={cameraPerspective}
            onChange={(e) => setCameraPerspective(e.target.value as 'default' | 'aerial' | 'startingBlock' | 'racing')}
            className="bg-black/40 border border-white/20 rounded px-2 sm:px-3 py-1 text-white outline-none focus:border-emerald-500"
          >
            <option value="default">Default View</option>
            <option value="aerial">Aerial View</option>
            <option value="startingBlock">Starting Block</option>
            <option value="racing">Racing View</option>
          </select>
          <select 
            value={currentVenue}
            onChange={(e) => setCurrentVenue(e.target.value as VenueTheme)}
            className="bg-black/40 border border-white/20 rounded px-2 sm:px-3 py-1 text-white outline-none focus:border-emerald-500"
          >
            {Object.entries(VENUES).map(([key, venue]) => (
              <option key={key} value={key}>{venue.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                isRecordingRef.current = !isRecordingRef.current;
                if (isRecordingRef.current) recordedDataRef.current = [];
                setIsRecording(isRecordingRef.current);
              }}
              className={`px-2 py-1 rounded border ${isRecording ? 'bg-red-500' : 'bg-white/10'}`}
            >
              {isRecording ? 'Stop' : 'Record'}
            </button>
            <button 
              onClick={() => {
                isReplayingRef.current = !isReplayingRef.current;
                replayFrameRef.current = 0;
                setIsReplaying(isReplayingRef.current);
              }}
              className={`px-2 py-1 rounded border ${isReplaying ? 'bg-blue-500' : 'bg-white/10'}`}
            >
              {isReplaying ? 'Stop' : 'Replay'}
            </button>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Render
          </div>
          <div className="px-2 py-1 bg-white/10 rounded border border-white/10">
            Lanes: 8
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative min-h-0">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block outline-none touch-none"
          id="renderCanvas"
        />
        
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 p-3 sm:p-4 bg-black/60 backdrop-blur-lg rounded-2xl border border-white/10 w-full max-w-[200px] sm:max-w-xs pointer-events-none">
          <h2 className="text-xs sm:text-sm font-semibold text-white mb-1 italic serif">Pool Specifications</h2>
          <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs text-slate-300">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Length</span>
              <span className="font-mono">50m</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span>Width</span>
              <span className="font-mono">25m</span>
            </div>
            <div className="flex justify-between">
              <span>Water Temp</span>
              <span className="font-mono">26°C</span>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2">
          {currentVenue === 'custom' && (
            <div className="p-3 sm:p-4 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col gap-2 sm:gap-3 w-full max-w-[240px] sm:w-64 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-white/10 pb-1 mb-1">Arena Customizer</h3>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Sky</label>
                  <input 
                    type="color" 
                    value={customColors.skyColor} 
                    onChange={(e) => setCustomColors(prev => ({ ...prev, skyColor: e.target.value }))}
                    className="w-full h-6 sm:h-8 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Walls</label>
                  <input 
                    type="color" 
                    value={customColors.hallColor} 
                    onChange={(e) => setCustomColors(prev => ({ ...prev, hallColor: e.target.value }))}
                    className="w-full h-6 sm:h-8 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Water</label>
                  <input 
                    type="color" 
                    value={customColors.waterColor} 
                    onChange={(e) => setCustomColors(prev => ({ ...prev, waterColor: e.target.value }))}
                    className="w-full h-6 sm:h-8 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Deck</label>
                  <input 
                    type="color" 
                    value={customColors.deckColor} 
                    onChange={(e) => setCustomColors(prev => ({ ...prev, deckColor: e.target.value }))}
                    className="w-full h-6 sm:h-8 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[9px] text-slate-400 uppercase">Blocks & Signs</label>
                  <input 
                    type="color" 
                    value={customColors.blockColor} 
                    onChange={(e) => setCustomColors(prev => ({ ...prev, blockColor: e.target.value }))}
                    className="w-full h-6 sm:h-8 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => setCurrentVenue('olympic')}
                className="mt-1 text-[9px] text-slate-500 hover:text-white transition-colors uppercase tracking-tighter"
              >
                Reset to Presets
              </button>
            </div>
          )}

          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors cursor-help self-end">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        </div>
      </main>

      <footer className="p-2 bg-black text-[10px] text-slate-500 text-center uppercase tracking-tighter">
        Click on the water to create splashes! • Drag to rotate • Scroll to zoom
      </footer>
    </div>
  );
}
