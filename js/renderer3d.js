/**
 * Enhanced Three.js 3D Game Engine & Renderer (60 FPS)
 * Nexus Automata
 */

import * as THREE from '../libs/three.module.js';
import { WorldEnvironment3D } from './environment3d.js';
import { ModelFactory3D } from './models3d.js';
import { DIR_OFFSET, DIRECTIONS, BUILDINGS, ITEMS } from './data.js';

export class Renderer3D {
    constructor(canvas, worldGrid, simulation) {
        this.canvas = canvas;
        this.grid = worldGrid;
        this.sim = simulation;
        this.tileSize = 2.0;

        // 1. Scene & Renderer
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        // 2. Camera: Tilted Isometric Perspective (matching reference image)
        this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 1, 600);
        this.camTarget = new THREE.Vector3((this.grid.width * this.tileSize) / 2, 0, (this.grid.height * this.tileSize) / 2);
        this.camDistance = 65;
        this.camPitch = 0.65; // ~37 degrees tilt
        this.camYaw = 0.78;   // ~45 degrees diagonal angle
        this.updateCameraPosition();

        // 3. Environment & 3D Models
        this.env = new WorldEnvironment3D(this.scene, this.grid);
        this.factory = new ModelFactory3D();

        // 4. Building & Item Scene Objects
        this.buildingMeshes = new Map(); // id -> THREE.Group
        this.itemPool = [];
        this.activeItemMeshes = [];
        this.catenaryWiresGroup = new THREE.Group();
        this.scene.add(this.catenaryWiresGroup);

        // 5. 3D Smoke & Dust Particles
        this.particles = [];
        this.smokeGeom = new THREE.DodecahedronGeometry(0.2, 0);
        this.smokeMat = new THREE.MeshStandardMaterial({
            color: 0xE2E8F0,
            roughness: 0.9,
            transparent: true,
            opacity: 0.65,
            flatShading: true
        });
        this.darkSmokeMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.95,
            transparent: true,
            opacity: 0.7,
            flatShading: true
        });

        // 6. 3D Ghost Placement Mesh
        this.ghostGroup = new THREE.Group();
        this.ghostGroup.visible = false;
        this.ghostMatValid = new THREE.MeshStandardMaterial({
            color: 0x10B981,
            emissive: 0x10B981,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.55
        });
        this.ghostMatInvalid = new THREE.MeshStandardMaterial({
            color: 0xEF4444,
            emissive: 0xEF4444,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.55
        });
        this.ghostBox = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 1), this.ghostMatValid);
        this.ghostGroup.add(this.ghostBox);

        // Ghost Direction Pointer
        const pointerGeom = new THREE.ConeGeometry(0.3, 0.6, 4);
        pointerGeom.rotateX(-Math.PI / 2);
        this.ghostPointer = new THREE.Mesh(pointerGeom, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
        this.ghostPointer.position.y = 0.5;
        this.ghostGroup.add(this.ghostPointer);
        this.scene.add(this.ghostGroup);

        // 7. Surveyor Drone / Builder Bot
        this.surveyorDrone = this.factory.buildSurveyorDrone();
        this.scene.add(this.surveyorDrone);

        // 8. Raycaster
        this.raycaster = new THREE.Raycaster();
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        this.mouseNDC = new THREE.Vector2();

        // 9. Floating 3D Hover Badge in DOM
        this.hoverBadge = document.getElementById('world-hover-badge');
        this.lastHoveredBuilding = null;
        this.elevatorLaunchState = null;

        window.addEventListener('resize', () => this.onResize());
    }

    setAtmosphere(mode) {
        this.env.setAtmosphere(mode);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCameraPosition() {
        const hDist = this.camDistance * Math.cos(this.camPitch);
        const vDist = this.camDistance * Math.sin(this.camPitch);

        this.camera.position.x = this.camTarget.x + hDist * Math.sin(this.camYaw);
        this.camera.position.y = this.camTarget.y + vDist;
        this.camera.position.z = this.camTarget.z + hDist * Math.cos(this.camYaw);

        this.camera.lookAt(this.camTarget);
    }

    setGhost(type, x, y, direction) {
        if (!type || type === 'select' || type === 'demolish') {
            this.ghostGroup.visible = false;
            return;
        }

        const def = BUILDINGS[type];
        if (!def) return;

        const size = def.size || 1;
        const ts = this.tileSize;

        this.ghostGroup.visible = true;
        this.ghostGroup.position.set(
            x * ts + (size * ts) / 2,
            0.2,
            y * ts + (size * ts) / 2
        );

        this.ghostGroup.rotation.y = -direction * (Math.PI / 2);
        this.ghostBox.scale.set(size * ts * 0.94, 0.35, size * ts * 0.94);
        this.ghostPointer.position.set(0, 0.35, -size * ts * 0.42);

        const canPlace = this.grid.canPlace(type, x, y, direction);
        this.ghostBox.material = canPlace ? this.ghostMatValid : this.ghostMatInvalid;
    }

    screenToTile(screenX, screenY) {
        this.mouseNDC.x = (screenX / window.innerWidth) * 2 - 1;
        this.mouseNDC.y = -(screenY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouseNDC, this.camera);
        const hitPoint = new THREE.Vector3();
        const hit = this.raycaster.ray.intersectPlane(this.groundPlane, hitPoint);

        if (hit) {
            const tileX = Math.floor(hitPoint.x / this.tileSize);
            const tileY = Math.floor(hitPoint.z / this.tileSize);

            if (this.grid.isInBounds(tileX, tileY)) {
                // Update surveyor drone to hover over targeted tile
                this.surveyorDrone.position.set(
                    tileX * this.tileSize + this.tileSize / 2,
                    1.2 + Math.sin(performance.now() * 0.005) * 0.15,
                    tileY * this.tileSize + this.tileSize / 2
                );

                // Update Hover Badge
                this.updateHoverBadge(tileX, tileY);

                return { tileX, tileY };
            }
        }

        this.hideHoverBadge();
        return { tileX: 0, tileY: 0 };
    }

    updateHoverBadge(tileX, tileY) {
        if (!this.hoverBadge) return;

        const building = this.grid.getBuilding(tileX, tileY);
        if (!building || building.def.isTool) {
            this.hideHoverBadge();
            return;
        }

        this.lastHoveredBuilding = building;

        // Project 3D building top to 2D screen coordinates
        const worldPos = new THREE.Vector3(
            building.x * this.tileSize + (building.size * this.tileSize) / 2,
            building.size * 1.6 + 0.8,
            building.y * this.tileSize + (building.size * this.tileSize) / 2
        );

        worldPos.project(this.camera);

        const screenX = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-(worldPos.y * 0.5) + 0.5) * window.innerHeight;

        let statusText = 'OPERATIONAL';
        let statusColor = '#10B981';
        if (building.status === 'no_power') { statusText = 'NO POWER'; statusColor = '#EF4444'; }
        else if (building.status === 'waiting_inputs') { statusText = 'WAITING INPUTS'; statusColor = '#F59E0B'; }
        else if (building.status === 'blocked') { statusText = 'BLOCKED'; statusColor = '#F59E0B'; }

        this.hoverBadge.style.display = 'flex';
        this.hoverBadge.style.left = `${screenX}px`;
        this.hoverBadge.style.top = `${screenY}px`;
        this.hoverBadge.innerHTML = `
            <div style="font-weight: 600; font-size: 12px; color: #FFFFFF;">${building.def.name}</div>
            <div style="font-family: var(--font-mono); font-size: 10px; color: ${statusColor};">${statusText}</div>
        `;
    }

    hideHoverBadge() {
        if (this.hoverBadge) {
            this.hoverBadge.style.display = 'none';
        }
    }

    emitSmoke(x, y, z, isDark = false) {
        if (this.particles.length > 80) return;

        const p = new THREE.Mesh(this.smokeGeom, isDark ? this.darkSmokeMat : this.smokeMat);
        p.position.set(x + (Math.random() - 0.5) * 0.2, y, z + (Math.random() - 0.5) * 0.2);
        p.scale.setScalar(0.7 + Math.random() * 0.6);
        p.userData = {
            vy: 1.4 + Math.random() * 0.8,
            vx: 0.3 + Math.random() * 0.3,
            vz: (Math.random() - 0.5) * 0.2,
            life: 1.6,
            maxLife: 1.6
        };
        this.scene.add(p);
        this.particles.push(p);
    }

    updateParticles(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.userData.life -= dt;
            p.position.y += p.userData.vy * dt;
            p.position.x += p.userData.vx * dt;
            p.position.z += p.userData.vz * dt;

            // Expand as smoke rises
            p.scale.addScalar(0.7 * dt);

            if (p.userData.life <= 0) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    syncBuildings(dt) {
        const currentIds = new Set();
        const ts = this.tileSize;

        // 1. Add / update building meshes
        this.grid.buildingList.forEach(b => {
            currentIds.add(b.id);
            let mesh = this.buildingMeshes.get(b.id);

            if (!mesh) {
                mesh = this.factory.createBuildingMesh(b.type, b.direction, b.size);
                const px = b.x * ts + (b.size * ts) / 2;
                const pz = b.y * ts + (b.size * ts) / 2;
                mesh.position.set(px, 0, pz);
                this.scene.add(mesh);
                this.buildingMeshes.set(b.id, mesh);
            }

            // Animate building components & emit smoke
            if (b.type === 'miner') {
                const auger = mesh.getObjectByName('drillAuger');
                if (auger && b.status === 'working') {
                    auger.rotation.y += 0.25;
                }
            } else if (b.type === 'smelter') {
                const hearth = mesh.getObjectByName('moltenHearth');
                if (hearth) {
                    const intensity = b.status === 'working' ? 1.1 + 0.4 * Math.sin(b.animationTime * 8) : 0.2;
                    hearth.material.emissiveIntensity = intensity;
                }
                // Billow smoke from twin chimneys
                if (b.status === 'working' && Math.random() < 0.2) {
                    const px = b.x * ts + ts;
                    const pz = b.y * ts + ts;
                    this.emitSmoke(px - 0.4, 2.3, pz - 0.4, false);
                    this.emitSmoke(px + 0.4, 2.3, pz - 0.4, false);
                }
            } else if (b.type === 'coal_generator') {
                if (b.status === 'working' && Math.random() < 0.25) {
                    const px = b.x * ts + ts;
                    const pz = b.y * ts + ts;
                    this.emitSmoke(px + 0.5, 3.2, pz - 0.5, true);
                }
            } else if (b.type === 'assembler') {
                const arm = mesh.getObjectByName('robotArm');
                if (arm && b.status === 'working') {
                    arm.rotation.y = Math.sin(b.animationTime * 4) * 0.8;
                }
            } else if (b.type === 'research_lab') {
                const r1 = mesh.getObjectByName('orbitRing1');
                const r2 = mesh.getObjectByName('orbitRing2');
                if (r1) r1.rotation.x += 0.04;
                if (r2) r2.rotation.y += 0.05;
            } else if (b.type === 'inserter' || b.type === 'fast_inserter' || b.type === 'long_inserter') {
                const arm = mesh.getObjectByName('inserterArm');
                if (arm) {
                    arm.rotation.y = b.armAngle;
                }
                const clawItem = mesh.getObjectByName('clawItem');
                if (clawItem) {
                    if (b.heldItem) {
                        clawItem.visible = true;
                        const heldMesh = clawItem.getObjectByName('heldItemMesh');
                        if (heldMesh) {
                            if (b.heldItem === 'copper_wire' || b.heldItem === 'copper_ingot') {
                                heldMesh.material = this.factory.materials.copper;
                            } else if (b.heldItem === 'plastic') {
                                heldMesh.material = this.factory.materials.plasticWhite;
                            } else if (b.heldItem === 'battery') {
                                heldMesh.material = this.factory.materials.batteryYellow;
                            } else if (b.heldItem === 'circuit') {
                                heldMesh.material = this.factory.materials.pcbGreen;
                            } else {
                                heldMesh.material = this.factory.materials.iron;
                            }
                        }
                    } else {
                        clawItem.visible = false;
                    }
                }
            } else if (b.type === 'wind_turbine') {
                const rotor = mesh.getObjectByName('turbineRotor');
                if (rotor) {
                    rotor.rotation.z += dt * 4.5;
                }
            } else if (b.type === 'nuclear_reactor') {
                const core = mesh.getObjectByName('cherenkovCore');
                if (core && core.material) {
                    const intensity = b.status === 'working' ? 1.6 + 0.5 * Math.sin(performance.now() * 0.006) : 0.2;
                    core.material.emissiveIntensity = intensity;
                }
                if (b.status === 'working' && Math.random() < 0.35) {
                    const px = b.x * ts + (b.size * ts) / 2;
                    const pz = b.y * ts + (b.size * ts) / 2;
                    this.emitSmoke(px - 0.7, 4.4, pz - 0.4, false);
                }
            } else if (b.type === 'foundry') {
                const molten = mesh.getObjectByName('moltenRunner');
                if (molten && molten.material) {
                    const intensity = b.status === 'working' ? 1.4 + 0.4 * Math.sin(b.animationTime * 6) : 0.2;
                    molten.material.emissiveIntensity = intensity;
                }
                if (b.status === 'working' && Math.random() < 0.22) {
                    const px = b.x * ts + (b.size * ts) / 2;
                    const pz = b.y * ts + (b.size * ts) / 2;
                    this.emitSmoke(px - 0.8, 3.8, pz - 0.6, false);
                    this.emitSmoke(px + 0.8, 3.8, pz - 0.6, false);
                }
            } else if (b.type === 'manufacturer') {
                const ram = mesh.getObjectByName('hydraulicRam');
                if (ram && b.status === 'working') {
                    ram.position.y = 1.3 + Math.abs(Math.sin(b.animationTime * 4)) * 0.6;
                }
            } else if (b.type === 'accumulator') {
                const meter = mesh.getObjectByName('accumulatorMeter');
                if (meter && meter.children) {
                    const chargePct = (b.storedEnergy || 0) / (b.def.powerCapacity || 5000);
                    const activeLeds = Math.round(chargePct * 5);
                    meter.children.forEach((led, idx) => {
                        led.visible = idx < activeLeds;
                    });
                }
            } else if (b.type === 'chemical_plant') {
                const fluidVessel = mesh.getObjectByName('fluidVessel');
                if (fluidVessel && fluidVessel.material) {
                    const intensity = b.status === 'working' ? 1.2 + 0.6 * Math.sin(b.animationTime * 6) : 0.3;
                    fluidVessel.material.emissiveIntensity = intensity;
                }
                if (b.status === 'working' && Math.random() < 0.18) {
                    const px = b.x * ts + (b.size * ts) / 2;
                    const pz = b.y * ts + (b.size * ts) / 2;
                    this.emitSmoke(px + 0.9, 3.9, pz + 0.7, false);
                }
            } else if (b.type === 'space_elevator') {
                const pod = mesh.getObjectByName('orbitalPod');
                const plume = mesh.getObjectByName('enginePlume');
                if (pod) {
                    if (this.elevatorLaunchState && this.elevatorLaunchState.active) {
                        this.elevatorLaunchState.progress += dt * 0.35;
                        const p = this.elevatorLaunchState.progress;
                        if (plume) {
                            plume.visible = true;
                            plume.scale.set(1 + Math.sin(p * 25) * 0.25, 1 + Math.random() * 0.4, 1 + Math.sin(p * 25) * 0.25);
                        }
                        // Ascend up towards orbit
                        pod.position.y = 4.8 + Math.pow(p, 2.0) * 110;

                        // Thruster plume smoke particles
                        if (Math.random() < 0.65) {
                            const px = b.x * ts + (b.size * ts) / 2;
                            const pz = b.y * ts + (b.size * ts) / 2;
                            this.emitSmoke(px + (Math.random() - 0.5) * 0.8, Math.max(0.5, pod.position.y - 1.8), pz + (Math.random() - 0.5) * 0.8, false);
                        }

                        if (p >= 1.0) {
                            this.elevatorLaunchState = null;
                            pod.position.y = 4.8;
                            if (plume) plume.visible = false;
                        }
                    } else {
                        pod.position.y = 4.8 + Math.sin(performance.now() * 0.0025) * 0.08;
                        if (plume) plume.visible = false;
                    }
                }
            }
        });

        // 2. Remove deleted buildings
        for (const [id, mesh] of this.buildingMeshes.entries()) {
            if (!currentIds.has(id)) {
                this.scene.remove(mesh);
                this.buildingMeshes.delete(id);
            }
        }
    }

    syncConveyorItems() {
        this.activeItemMeshes.forEach(mesh => {
            mesh.visible = false;
            this.itemPool.push(mesh);
        });
        this.activeItemMeshes = [];

        const ts = this.tileSize;

        this.grid.buildingList.forEach(belt => {
            if (!belt.items || belt.items.length === 0) return;

            const offset = DIR_OFFSET[belt.direction];
            const px = belt.x * ts + ts / 2;
            const pz = belt.y * ts + ts / 2;
            const itemY = (belt.type === 'conveyor_bridge') ? 1.48 : 0.22;

            belt.items.forEach(it => {
                let mesh = this.itemPool.pop();
                if (!mesh || mesh.userData.itemType !== it.type) {
                    mesh = this.factory.createItemMesh(it.type);
                    mesh.userData.itemType = it.type;
                    this.scene.add(mesh);
                }

                const itemX = px + offset.dx * (it.pos - 0.5) * ts;
                const itemZ = pz + offset.dy * (it.pos - 0.5) * ts;
                mesh.position.set(itemX, itemY, itemZ);
                mesh.visible = true;

                this.activeItemMeshes.push(mesh);
            });
        });
    }

    syncPowerWires() {
        this.catenaryWiresGroup.clear();
        const ts = this.tileSize;

        this.grid.powerNetworks.forEach(net => {
            const poles = net.poles;
            const mat = new THREE.LineBasicMaterial({ color: 0x1E293B, linewidth: 2 });

            for (let i = 0; i < poles.length; i++) {
                for (let j = i + 1; j < poles.length; j++) {
                    const p1 = poles[i];
                    const p2 = poles[j];
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                    if (dist <= (p1.def.wireMaxDist || 8)) {
                        const x1 = p1.x * ts + ts / 2;
                        const z1 = p1.y * ts + ts / 2;
                        const x2 = p2.x * ts + ts / 2;
                        const z2 = p2.y * ts + ts / 2;

                        const curve = new THREE.QuadraticBezierCurve3(
                            new THREE.Vector3(x1, 3.2, z1),
                            new THREE.Vector3((x1 + x2) / 2, 3.2 - dist * 0.12, (z1 + z2) / 2),
                            new THREE.Vector3(x2, 3.2, z2)
                        );

                        const points = curve.getPoints(12);
                        const geom = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geom, mat);
                        this.catenaryWiresGroup.add(line);
                    }
                }
            }
        });
    }

    render(dt) {
        // 1. Update Environment (Clouds & Water)
        this.env.update(dt);

        // 2. Animate Conveyor Belt Textures
        this.factory.updateConveyorAnimation(dt);

        // 3. Sync 3D Building Meshes & Emissive components
        this.syncBuildings(dt);

        // 4. Update Billowing Smoke Particles
        this.updateParticles(dt);

        // 5. Sync 3D Items on Belts
        this.syncConveyorItems();

        // 6. Sync Power Cables
        this.syncPowerWires();

        // 7. Render 3D Scene
        this.renderer.render(this.scene, this.camera);
    }

    triggerSpaceElevatorLaunch() {
        this.elevatorLaunchState = { active: true, progress: 0 };
    }
}
