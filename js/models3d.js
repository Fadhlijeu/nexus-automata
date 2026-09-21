/**
 * Comprehensive 3D Model Library & Mesh Generators
 * Nexus Automata (Three.js 3D Engine)
 */

import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';

export class ModelFactory3D {
    constructor() {
        this.tileSize = 2.0;

        // Animated Conveyor Textures with high-vis industrial chevrons
        this.standardBeltTexture = this.createBeltTexture(false);
        this.fastBeltTexture = this.createBeltTexture(true);

        // Reusable PBR Materials
        this.materials = {
            darkSteel: new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.85, roughness: 0.25 }),
            lightSteel: new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8, roughness: 0.3 }),
            industrialYellow: new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.4, roughness: 0.4 }),
            industrialCyan: new THREE.MeshStandardMaterial({ color: 0x0EA5E9, metalness: 0.4, roughness: 0.4 }),
            brightCyan: new THREE.MeshStandardMaterial({ color: 0x22D3EE, emissive: 0x0EA5E9, emissiveIntensity: 0.6 }),
            neonPurple: new THREE.MeshStandardMaterial({ color: 0xA855F7, emissive: 0x7E22CE, emissiveIntensity: 0.8 }),
            conveyorBelt: new THREE.MeshStandardMaterial({
                map: this.standardBeltTexture,
                roughness: 0.75,
                metalness: 0.15
            }),
            conveyorFast: new THREE.MeshStandardMaterial({
                map: this.fastBeltTexture,
                roughness: 0.65,
                metalness: 0.25
            }),
            furnaceBody: new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.7, metalness: 0.3 }),
            moltenCore: new THREE.MeshStandardMaterial({ color: 0xF97316, emissive: 0xEA580C, emissiveIntensity: 1.3 }),
            solarCell: new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.9, roughness: 0.15 }),
            copper: new THREE.MeshStandardMaterial({ color: 0xEA580C, metalness: 0.85, roughness: 0.3 }),
            iron: new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.85, roughness: 0.25 }),
            pcbGreen: new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.3, metalness: 0.2 }),
            goldPin: new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.2 }),
            glassScience: new THREE.MeshStandardMaterial({ color: 0x38BDF8, emissive: 0x0284C7, emissiveIntensity: 0.7, transparent: true, opacity: 0.85 }),
            hazardStripe: new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.5 }),
            plasticWhite: new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.2, metalness: 0.1 }),
            batteryYellow: new THREE.MeshStandardMaterial({ color: 0xEAB308, metalness: 0.75, roughness: 0.25 }),
            chemicalFluid: new THREE.MeshStandardMaterial({ color: 0x06B6D4, emissive: 0x0891B2, emissiveIntensity: 1.4, transparent: true, opacity: 0.85 }),
            glassTube: new THREE.MeshStandardMaterial({ color: 0xBAE6FD, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.45 }),
            floodlight: new THREE.MeshStandardMaterial({ color: 0xFEF08A, emissive: 0xFDE047, emissiveIntensity: 2.2 }),
            nuclearCore: new THREE.MeshStandardMaterial({ color: 0x84CC16, emissive: 0x65A30D, emissiveIntensity: 1.8 }),
            titanium: new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.95, roughness: 0.15 }),
            uranium: new THREE.MeshStandardMaterial({ color: 0xA3E635, emissive: 0x65A30D, emissiveIntensity: 1.5 }),
            quantumPink: new THREE.MeshStandardMaterial({ color: 0xF43F5E, emissive: 0xE11D48, emissiveIntensity: 1.6 }),
            crimsonSteel: new THREE.MeshStandardMaterial({ color: 0xDC2626, metalness: 0.7, roughness: 0.35 }),
            biomassGreen: new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.6, metalness: 0.1 }),
            accumulatorBlue: new THREE.MeshStandardMaterial({ color: 0x2563EB, emissive: 0x1D4ED8, emissiveIntensity: 0.8 })
        };

        // Open-Source 3D GLB Loader & Model Cache (Kenney CC0 Assets)
        this.loader = new GLTFLoader();
        this.modelsGLB = new Map();
        this.thumbnails = new Map();
        this.modelsLoaded = false;
        this.loadOpenSourceModels();
    }

    loadOpenSourceModels(onReady) {
        const assets = {
            conveyor: 'assets/models/conveyor.glb',
            conveyor_stripe: 'assets/models/conveyor-stripe.glb',
            conveyor_cross: 'assets/models/conveyor-cross.glb',
            conveyor_junction: 'assets/models/conveyor-junction-t.glb',
            robot_arm_a: 'assets/models/robot-arm-a.glb',
            robot_arm_b: 'assets/models/robot-arm-b.glb',
            machine: 'assets/models/machine.glb',
            machine_fortified: 'assets/models/machine-fortified.glb',
            machine_bed: 'assets/models/machine-bed.glb',
            machine_pipe: 'assets/models/machine-connection-pipe.glb',
            tank_large: 'assets/models/detail-tank-large.glb',
            tank_small: 'assets/models/detail-tank.glb',
            chimney_large: 'assets/models/chimney-large.glb',
            chimney_medium: 'assets/models/chimney-medium.glb',
            building_a: 'assets/models/building-a.glb',
            building_b: 'assets/models/building-b.glb',
            building_c: 'assets/models/building-c.glb',
            building_f: 'assets/models/building-f.glb',
            hopper_round: 'assets/models/hopper-high-round.glb',
            hopper_square: 'assets/models/hopper-high-square.glb',
            scanner_low: 'assets/models/scanner-low.glb',
            piston_round: 'assets/models/piston-round.glb',
            crane: 'assets/models/crane.glb',
            solar_panel: 'assets/models/solar-panel-landscape-group.glb',
            windmill: 'assets/models/windmill.glb',
            water_tower: 'assets/models/water-tower.glb',
            shipping_container: 'assets/models/shipping-container-a.glb'
        };

        const keys = Object.keys(assets);
        let loadedCount = 0;

        keys.forEach(key => {
            this.loader.load(
                assets[key],
                (gltf) => {
                    const scene = gltf.scene;
                    scene.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    this.modelsGLB.set(key, scene);
                    loadedCount++;
                    if (loadedCount === keys.length) {
                        this.modelsLoaded = true;
                        this.thumbnails.clear();
                        if (this.onLoaded) this.onLoaded();
                        if (onReady) onReady();
                    }
                },
                undefined,
                () => {
                    loadedCount++;
                    if (loadedCount === keys.length) {
                        this.modelsLoaded = true;
                        this.thumbnails.clear();
                        if (this.onLoaded) this.onLoaded();
                        if (onReady) onReady();
                    }
                }
            );
        });
    }

    cloneModel(key) {
        if (!this.modelsGLB.has(key)) return null;
        const original = this.modelsGLB.get(key);
        return original.clone(true);
    }

    initThumbnailRenderer() {
        if (this.thumbRenderer) return;
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        this.thumbRenderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.thumbRenderer.setSize(120, 120);
        this.thumbRenderer.setPixelRatio(1);
        this.thumbRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.thumbRenderer.toneMappingExposure = 1.35;

        this.thumbScene = new THREE.Scene();
        
        const amb = new THREE.AmbientLight(0xFFFFFF, 1.4);
        this.thumbScene.add(amb);

        const keyLight = new THREE.DirectionalLight(0xFDE047, 2.5);
        keyLight.position.set(5, 9, 6);
        this.thumbScene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x38BDF8, 1.6);
        fillLight.position.set(-6, 4, -5);
        this.thumbScene.add(fillLight);

        const topRim = new THREE.DirectionalLight(0xFFFFFF, 1.1);
        topRim.position.set(0, 10, 0);
        this.thumbScene.add(topRim);

        this.thumbCamera = new THREE.PerspectiveCamera(34, 1, 0.2, 50);
        this.thumbObjHolder = new THREE.Group();
        this.thumbScene.add(this.thumbObjHolder);
    }

    generateThumbnail(type, size = 1) {
        if (this.thumbnails.has(type)) {
            return this.thumbnails.get(type);
        }

        this.initThumbnailRenderer();

        while (this.thumbObjHolder.children.length > 0) {
            this.thumbObjHolder.remove(this.thumbObjHolder.children[0]);
        }

        let mesh = null;
        if (type === 'select') {
            mesh = this.buildSurveyorDrone();
        } else if (type === 'demolish') {
            mesh = this.buildDemolisherDrone();
        } else {
            mesh = this.createBuildingMesh(type, 0, size);
        }

        this.thumbObjHolder.add(mesh);

        const bbox = new THREE.Box3().setFromObject(mesh);
        const center = bbox.getCenter(new THREE.Vector3());
        const bsize = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(bsize.x, bsize.y, bsize.z, 1.2);

        mesh.position.sub(center);

        const dist = maxDim * 2.15;
        this.thumbCamera.position.set(dist * 0.92, dist * 0.85, dist * 0.92);
        this.thumbCamera.lookAt(0, 0, 0);

        this.thumbRenderer.render(this.thumbScene, this.thumbCamera);
        const dataUrl = this.thumbRenderer.domElement.toDataURL('image/png');
        this.thumbnails.set(type, dataUrl);
        return dataUrl;
    }

    buildDemolisherDrone() {
        const drone = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.25, 0.5),
            this.materials.darkSteel
        );
        body.position.y = 0.8;
        body.castShadow = true;
        drone.add(body);

        const laser = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8),
            this.materials.crimsonSteel
        );
        laser.rotation.x = Math.PI / 2;
        laser.position.set(0, 0.8, 0.28);
        drone.add(laser);

        const beam = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            this.materials.quantumPink
        );
        beam.position.set(0, 0.8, 0.5);
        drone.add(beam);
        return drone;
    }

    createBeltTexture(isFast) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Background rubber tread
        ctx.fillStyle = isFast ? '#082F49' : '#0F172A';
        ctx.fillRect(0, 0, 128, 128);

        // Tread slats
        ctx.fillStyle = isFast ? '#0C4A6E' : '#1E293B';
        for (let y = 0; y < 128; y += 16) {
            ctx.fillRect(0, y, 128, 6);
        }

        // Directional chevrons
        ctx.strokeStyle = isFast ? '#38BDF8' : '#F59E0B';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        for (let y = 10; y < 128; y += 32) {
            ctx.beginPath();
            ctx.moveTo(34, y + 14);
            ctx.lineTo(64, y - 4);
            ctx.lineTo(94, y + 14);
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        return tex;
    }

    updateConveyorAnimation(dt) {
        // Scroll belt textures along forward direction
        this.standardBeltTexture.offset.y -= 0.65 * dt;
        this.fastBeltTexture.offset.y -= 1.35 * dt;
    }

    createBuildingMesh(type, direction, size = 1) {
        const root = new THREE.Group();
        root.userData = { type, direction, size };

        let mesh = null;
        switch (type) {
            case 'belt':
                mesh = this.buildConveyorBelt(false);
                break;
            case 'fast_belt':
                mesh = this.buildConveyorBelt(true);
                break;
            case 'splitter':
                mesh = this.buildSplitter();
                break;
            case 'merger':
                mesh = this.buildMerger();
                break;
            case 'underground_belt':
                mesh = this.buildUndergroundBelt();
                break;
            case 'miner':
                mesh = this.buildMiner();
                break;
            case 'smelter':
                mesh = this.buildSmelter();
                break;
            case 'assembler':
                mesh = this.buildAssembler();
                break;
            case 'coal_generator':
                mesh = this.buildCoalGenerator();
                break;
            case 'solar_panel':
                mesh = this.buildSolarPanel();
                break;
            case 'power_pole':
                mesh = this.buildPowerPole();
                break;
            case 'storage_silo':
                mesh = this.buildStorageSilo();
                break;
            case 'research_lab':
                mesh = this.buildResearchLab();
                break;
            case 'space_elevator':
                mesh = this.buildSpaceElevator();
                break;
            case 'inserter':
                mesh = this.buildInserter(false);
                break;
            case 'fast_inserter':
                mesh = this.buildInserter(true);
                break;
            case 'conveyor_bridge':
                mesh = this.buildConveyorBridge();
                break;
            case 'smart_splitter':
                mesh = this.buildSmartSplitter();
                break;
            case 'long_inserter':
                mesh = this.buildLongInserter();
                break;
            case 'conveyor_lift':
                mesh = this.buildConveyorLift();
                break;
            case 'belt_crossing':
                mesh = this.buildBeltCrossing();
                break;
            case 'chemical_plant':
                mesh = this.buildChemicalPlant();
                break;
            case 'foundry':
                mesh = this.buildFoundry();
                break;
            case 'manufacturer':
                mesh = this.buildManufacturer();
                break;
            case 'greenhouse':
                mesh = this.buildGreenhouse();
                break;
            case 'wind_turbine':
                mesh = this.buildWindTurbine();
                break;
            case 'nuclear_reactor':
                mesh = this.buildNuclearReactor();
                break;
            case 'accumulator':
                mesh = this.buildAccumulator();
                break;
            case 'storage_silo_mk2':
                mesh = this.buildStorageSiloMk2();
                break;
            default:
                mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.materials.darkSteel);
                break;
        }

        root.add(mesh);
        this.applyDirection(root, direction);
        return root;
    }

    applyDirection(group, direction) {
        group.rotation.y = -direction * (Math.PI / 2);
    }

    // 1. Conveyor Belt 3D Model
    buildConveyorBelt(isFast) {
        const group = new THREE.Group();
        const ts = this.tileSize;
        const beltMat = isFast ? this.materials.conveyorFast : this.materials.conveyorBelt;

        // Open-Source Kenney 3D Model Integration
        const glb = this.cloneModel(isFast ? 'conveyor_stripe' : 'conveyor');
        if (glb) {
            glb.scale.set(ts * 0.96, ts * 0.96, ts * 0.96);
            glb.position.set(0, 0, 0);
            group.add(glb);

            // Animated surface overlay
            const bedGeom = new THREE.BoxGeometry(ts * 0.58, 0.04, ts * 0.98);
            const bedMesh = new THREE.Mesh(bedGeom, beltMat);
            bedMesh.position.y = 0.28;
            group.add(bedMesh);
            return group;
        }

        // Base frame bed fallback
        const bedGeom = new THREE.BoxGeometry(ts * 0.88, 0.12, ts * 0.98);
        const bedMesh = new THREE.Mesh(bedGeom, beltMat);
        bedMesh.position.y = 0.06;
        bedMesh.castShadow = true;
        bedMesh.receiveShadow = true;
        group.add(bedMesh);

        // Side Rails
        const railGeom = new THREE.BoxGeometry(0.1, 0.22, ts * 0.98);
        const leftRail = new THREE.Mesh(railGeom, this.materials.darkSteel);
        leftRail.position.set(-ts * 0.44, 0.11, 0);
        leftRail.castShadow = true;
        group.add(leftRail);

        const rightRail = new THREE.Mesh(railGeom, this.materials.darkSteel);
        rightRail.position.set(ts * 0.44, 0.11, 0);
        rightRail.castShadow = true;
        group.add(rightRail);

        // Cylindrical Rollers
        const rollerGeom = new THREE.CylinderGeometry(0.04, 0.04, ts * 0.86, 8);
        rollerGeom.rotateZ(Math.PI / 2);
        for (let i = -0.35; i <= 0.35; i += 0.35) {
            const roller = new THREE.Mesh(rollerGeom, this.materials.lightSteel);
            roller.position.set(0, 0.13, i * ts);
            group.add(roller);
        }

        return group;
    }

    // 2. Splitter 3D Model
    buildSplitter() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const glb = this.cloneModel('conveyor_cross');
        if (glb) {
            glb.scale.set(ts * 0.92, ts * 0.92, ts * 0.92);
            group.add(glb);

            const arch = new THREE.Mesh(
                new THREE.BoxGeometry(ts * 0.72, 0.4, 0.14),
                this.materials.industrialYellow
            );
            arch.position.set(0, 0.55, 0);
            arch.castShadow = true;
            group.add(arch);

            const led = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), this.materials.neonPurple);
            led.position.set(0, 0.8, 0);
            group.add(led);
            return group;
        }

        const chassis = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.94, 0.45, ts * 0.94),
            this.materials.darkSteel
        );
        chassis.position.y = 0.225;
        chassis.castShadow = true;
        group.add(chassis);

        // Dual output lanes
        const laneGeom = new THREE.BoxGeometry(ts * 0.38, 0.15, 0.2);
        const leftLane = new THREE.Mesh(laneGeom, this.materials.conveyorBelt);
        leftLane.position.set(-0.25 * ts, 0.2, -ts * 0.48);
        group.add(leftLane);

        const rightLane = new THREE.Mesh(laneGeom, this.materials.conveyorBelt);
        rightLane.position.set(0.25 * ts, 0.2, -ts * 0.48);
        group.add(rightLane);

        // Splitter Top Indicator
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), this.materials.neonPurple);
        led.position.set(0, 0.48, 0);
        group.add(led);

        return group;
    }

    // 3. Merger 3D Model
    buildMerger() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const glb = this.cloneModel('conveyor_junction');
        if (glb) {
            glb.scale.set(ts * 0.92, ts * 0.92, ts * 0.92);
            group.add(glb);

            const arch = new THREE.Mesh(
                new THREE.BoxGeometry(ts * 0.72, 0.4, 0.14),
                this.materials.industrialCyan
            );
            arch.position.set(0, 0.55, 0);
            arch.castShadow = true;
            group.add(arch);
            return group;
        }

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.92, 0.4, ts * 0.92),
            this.materials.darkSteel
        );
        body.position.y = 0.2;
        body.castShadow = true;
        group.add(body);

        // Converging funnel
        const funnel = new THREE.Mesh(
            new THREE.ConeGeometry(ts * 0.4, 0.35, 4),
            this.materials.industrialYellow
        );
        funnel.position.set(0, 0.35, 0);
        group.add(funnel);

        return group;
    }

    // 4. Underground Belt 3D Model
    buildUndergroundBelt() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        // Tunnel arch entrance
        const arch = new THREE.Mesh(
            new THREE.CylinderGeometry(ts * 0.38, ts * 0.42, 0.6, 12, 1, false, 0, Math.PI),
            this.materials.darkSteel
        );
        arch.rotateZ(Math.PI / 2);
        arch.position.set(0, 0.3, 0);
        arch.castShadow = true;
        group.add(arch);

        // Caution Stripes hood
        const hood = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.85, 0.1, 0.15),
            this.materials.hazardStripe
        );
        hood.position.set(0, 0.55, -0.2);
        group.add(hood);

        return group;
    }

    // 5. Mining Drill 3D Model
    buildMiner() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        // Heavy Base Legs
        const legGeom = new THREE.BoxGeometry(0.16, 0.5, 0.16);
        for (let x of [-0.35, 0.35]) {
            for (let z of [-0.35, 0.35]) {
                const leg = new THREE.Mesh(legGeom, this.materials.darkSteel);
                leg.position.set(x * ts, 0.25, z * ts);
                leg.castShadow = true;
                group.add(leg);
            }
        }

        // Platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.88, 0.22, ts * 0.88),
            this.materials.industrialYellow
        );
        platform.position.y = 0.55;
        platform.castShadow = true;
        group.add(platform);

        // Motor Housing
        const motor = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.42, 0.6, 12),
            this.materials.industrialCyan
        );
        motor.position.y = 0.95;
        motor.castShadow = true;
        group.add(motor);

        // Helical Auger Drill Bit (Animated)
        const drillAuger = new THREE.Mesh(
            new THREE.ConeGeometry(0.28, 0.7, 8),
            this.materials.lightSteel
        );
        drillAuger.rotateX(Math.PI);
        drillAuger.position.y = 0.25;
        drillAuger.name = 'drillAuger';
        drillAuger.castShadow = true;
        group.add(drillAuger);

        return group;
    }

    // 6. Smelter 3D Model (2x2)
    buildSmelter() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;
        const machineGlb = this.cloneModel('machine');
        const chimneyGlb = this.cloneModel('chimney_large');

        if (machineGlb) {
            machineGlb.scale.set(size * 0.55, size * 0.55, size * 0.55);
            machineGlb.position.set(0, 0, 0);
            group.add(machineGlb);

            if (chimneyGlb) {
                chimneyGlb.scale.set(size * 0.38, size * 0.45, size * 0.38);
                chimneyGlb.position.set(0, 0.75, -size * 0.22);
                group.add(chimneyGlb);
            }

            const hearth = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.4, 0.28, 0.18),
                this.materials.moltenCore
            );
            hearth.position.set(0, 0.38, size * 0.35);
            hearth.name = 'moltenHearth';
            group.add(hearth);
            return group;
        }

        // Furnace Main Body Fallback
        const furnace = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.88, 1.2, size * 0.88),
            this.materials.furnaceBody
        );
        furnace.position.y = 0.6;
        furnace.castShadow = true;
        furnace.receiveShadow = true;
        group.add(furnace);

        // Molten Glow Hearth Interior
        const hearth = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.45, 0.5, 0.2),
            this.materials.moltenCore
        );
        hearth.position.set(0, 0.4, size * 0.45);
        hearth.name = 'moltenHearth';
        group.add(hearth);

        // Twin Smokestacks
        const chimneyGeom = new THREE.CylinderGeometry(0.2, 0.26, 1.4, 10);
        const c1 = new THREE.Mesh(chimneyGeom, this.materials.darkSteel);
        c1.position.set(-size * 0.25, 1.6, -size * 0.22);
        c1.castShadow = true;
        group.add(c1);

        const c2 = new THREE.Mesh(chimneyGeom, this.materials.darkSteel);
        c2.position.set(size * 0.25, 1.6, -size * 0.22);
        c2.castShadow = true;
        group.add(c2);

        return group;
    }

    // 7. Assembler 3D Model (2x2)
    buildAssembler() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;
        const bedGlb = this.cloneModel('machine_bed');
        const armGlb = this.cloneModel('robot_arm_b');

        if (bedGlb) {
            bedGlb.scale.set(size * 0.55, size * 0.55, size * 0.55);
            group.add(bedGlb);

            if (armGlb) {
                armGlb.scale.set(size * 0.42, size * 0.42, size * 0.42);
                armGlb.position.set(0, 0.4, 0);
                armGlb.name = 'robotArm';
                group.add(armGlb);
            }
            return group;
        }

        // Workshop Base & Walls Fallback
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.9, 0.8, size * 0.9),
            this.materials.darkSteel
        );
        base.position.y = 0.4;
        base.castShadow = true;
        group.add(base);

        // Cylindrical Turret Enclosure
        const dome = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.35, size * 0.38, 0.5, 16),
            this.materials.industrialCyan
        );
        dome.position.y = 1.0;
        dome.castShadow = true;
        group.add(dome);

        // Articulated Robot Arm (Animated)
        const armPivot = new THREE.Group();
        armPivot.position.set(0, 1.15, 0);
        armPivot.name = 'robotArm';

        const upperArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.6, 0.12),
            this.materials.industrialYellow
        );
        upperArm.position.y = 0.3;
        upperArm.castShadow = true;
        armPivot.add(upperArm);

        const claw = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.08, 0.25),
            this.materials.lightSteel
        );
        claw.position.y = 0.6;
        armPivot.add(claw);

        group.add(armPivot);
        return group;
    }

    // 8. Coal Power Plant (2x2)
    buildCoalGenerator() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;
        const buildingGlb = this.cloneModel('building_a');
        const chimneyGlb = this.cloneModel('chimney_large');

        if (buildingGlb) {
            buildingGlb.scale.set(size * 0.48, size * 0.48, size * 0.48);
            group.add(buildingGlb);

            if (chimneyGlb) {
                chimneyGlb.scale.set(size * 0.4, size * 0.45, size * 0.4);
                chimneyGlb.position.set(size * 0.22, 1.0, -size * 0.22);
                group.add(chimneyGlb);
            }
            return group;
        }

        const boiler = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.38, size * 0.38, 1.6, 16),
            this.materials.darkSteel
        );
        boiler.position.set(0, 0.8, -size * 0.1);
        boiler.castShadow = true;
        group.add(boiler);

        // Coal Intake Hopper
        const hopper = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.6, 0.7, size * 0.4),
            this.materials.industrialYellow
        );
        hopper.position.set(0, 0.35, size * 0.25);
        hopper.castShadow = true;
        group.add(hopper);

        // Tall Exhaust Smokestack
        const stack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.32, 2.8, 12),
            this.materials.darkSteel
        );
        stack.position.set(size * 0.24, 1.9, -size * 0.25);
        stack.castShadow = true;
        group.add(stack);

        return group;
    }

    // 9. Solar Array (2x2)
    buildSolarPanel() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;

        const glb = this.cloneModel('solar_panel');
        if (glb) {
            glb.scale.set(size * 0.46, size * 0.46, size * 0.46);
            glb.position.set(0, 0, 0);
            group.add(glb);
            return group;
        }

        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.88, 0.15, size * 0.88),
            this.materials.darkSteel
        );
        base.position.y = 0.075;
        group.add(base);

        // Angled Photovoltaic Panel Array
        const panelGeom = new THREE.BoxGeometry(size * 0.82, 0.08, size * 0.82);
        const panel = new THREE.Mesh(panelGeom, this.materials.solarCell);
        panel.rotateX(-0.25);
        panel.position.set(0, 0.55, 0);
        panel.castShadow = true;
        group.add(panel);

        return group;
    }

    // 10. Power Substation Pole (1x1)
    buildPowerPole() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.16, 3.8, 6),
            this.materials.darkSteel
        );
        pole.position.y = 1.9;
        pole.castShadow = true;
        group.add(pole);

        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.85, 0.08, 0.08), this.materials.lightSteel);
        arm1.position.y = 3.2;
        group.add(arm1);

        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(ts * 0.65, 0.08, 0.08), this.materials.lightSteel);
        arm2.position.y = 3.6;
        group.add(arm2);

        const insulGeom = new THREE.CylinderGeometry(0.04, 0.06, 0.18, 6);
        for (let x of [-ts * 0.38, ts * 0.38]) {
            const insul = new THREE.Mesh(insulGeom, this.materials.brightCyan);
            insul.position.set(x, 3.1, 0);
            group.add(insul);
        }

        // High-Mast Downward Floodlight Reflector Fixtures
        const lampHousing = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.2), this.materials.darkSteel);
        lampHousing.position.set(0, 3.75, 0.15);
        lampHousing.rotation.x = 0.45;
        group.add(lampHousing);

        const lampBulb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.16), this.materials.floodlight);
        lampBulb.position.set(0, 3.72, 0.17);
        lampBulb.rotation.x = 0.45;
        group.add(lampBulb);

        // Ground illumination point light
        const floodLight = new THREE.PointLight(0xFDE047, 0.85, 15, 2.0);
        floodLight.position.set(0, 3.5, 0.2);
        group.add(floodLight);

        return group;
    }

    // 11. Storage Silo (2x2)
    buildStorageSilo() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;
        const tankGlb = this.cloneModel('tank_large');

        if (tankGlb) {
            tankGlb.scale.set(size * 0.58, size * 0.58, size * 0.58);
            group.add(tankGlb);
            return group;
        }

        const cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.42, size * 0.42, 2.2, 18),
            this.materials.lightSteel
        );
        cylinder.position.y = 1.1;
        cylinder.castShadow = true;
        group.add(cylinder);

        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(size * 0.45, 0.7, 18),
            this.materials.darkSteel
        );
        roof.position.y = 2.55;
        roof.castShadow = true;
        group.add(roof);

        return group;
    }

    // 12. Research Lab (2x2)
    buildResearchLab() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;
        const buildingGlb = this.cloneModel('building_c');

        if (buildingGlb) {
            buildingGlb.scale.set(size * 0.52, size * 0.52, size * 0.52);
            group.add(buildingGlb);

            const ring1 = new THREE.Mesh(new THREE.TorusGeometry(size * 0.35, 0.04, 6, 24), this.materials.brightCyan);
            ring1.position.y = 2.4;
            ring1.name = 'orbitRing1';
            group.add(ring1);

            const ring2 = new THREE.Mesh(new THREE.TorusGeometry(size * 0.42, 0.03, 6, 24), this.materials.neonPurple);
            ring2.position.y = 2.4;
            ring2.name = 'orbitRing2';
            group.add(ring2);
            return group;
        }

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.45, size * 0.48, 0.5, 16),
            this.materials.darkSteel
        );
        base.position.y = 0.25;
        base.castShadow = true;
        group.add(base);

        // Central Quantum Core Sphere
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.24, 16, 16),
            this.materials.brightCyan
        );
        core.position.y = 1.2;
        group.add(core);

        // Holographic Orbital Rings
        const ringGeom = new THREE.TorusGeometry(size * 0.36, 0.04, 8, 32);
        const r1 = new THREE.Mesh(ringGeom, this.materials.brightCyan);
        r1.name = 'orbitRing1';
        r1.position.y = 1.2;
        group.add(r1);

        const r2 = new THREE.Mesh(ringGeom, this.materials.neonPurple);
        r2.name = 'orbitRing2';
        r2.position.y = 1.2;
        group.add(r2);

        return group;
    }

    // 13. Space Elevator (3x3)
    buildSpaceElevator() {
        const group = new THREE.Group();
        const size = this.tileSize * 3;

        // Base Heavy Reinforced Foundation
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.92, 0.65, size * 0.92),
            this.materials.darkSteel
        );
        base.position.y = 0.325;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Caution Perimeter Striping
        const perimeterStripe = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.94, 0.12, size * 0.94),
            this.materials.hazardStripe
        );
        perimeterStripe.position.y = 0.65;
        group.add(perimeterStripe);

        // 4 Buttress Towers with Structural Truss Crossbars
        const towerGeom = new THREE.CylinderGeometry(0.38, 0.75, 4.8, 8);
        for (let x of [-size * 0.35, size * 0.35]) {
            for (let z of [-size * 0.35, size * 0.35]) {
                const tower = new THREE.Mesh(towerGeom, this.materials.lightSteel);
                tower.position.set(x, 2.7, z);
                tower.castShadow = true;
                group.add(tower);

                // Red Aviation Warning Beacon on each tower summit
                const beacon = new THREE.Mesh(
                    new THREE.SphereGeometry(0.14, 8, 8),
                    new THREE.MeshStandardMaterial({
                        color: 0xEF4444,
                        emissive: 0xEF4444,
                        emissiveIntensity: 2.0
                    })
                );
                beacon.position.set(x, 5.2, z);
                group.add(beacon);
            }
        }

        // Structural Girders between towers
        const girderX = new THREE.Mesh(new THREE.BoxGeometry(size * 0.7, 0.16, 0.2), this.materials.darkSteel);
        girderX.position.set(0, 3.8, size * 0.35);
        group.add(girderX);
        const girderX2 = girderX.clone();
        girderX2.position.set(0, 3.8, -size * 0.35);
        group.add(girderX2);

        const girderZ = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, size * 0.7), this.materials.darkSteel);
        girderZ.position.set(size * 0.35, 3.8, 0);
        group.add(girderZ);
        const girderZ2 = girderZ.clone();
        girderZ2.position.set(-size * 0.35, 3.8, 0);
        group.add(girderZ2);

        // Magnetic Accelerator Ring
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(size * 0.35, 0.22, 10, 28),
            this.materials.brightCyan
        );
        ring.rotateX(Math.PI / 2);
        ring.position.y = 4.6;
        group.add(ring);

        // Hyper-Structure Orbital Carbon Nanotube Tether Beam
        const tether = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 200, 8),
            this.materials.brightCyan
        );
        tether.position.y = 100;
        group.add(tether);

        // Docked Orbital Transport Pod
        const pod = new THREE.Group();
        pod.name = 'orbitalPod';
        pod.position.set(0, 4.8, 0);

        // Pod Main Fuselage
        const podBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.65, 0.85, 2.0, 12),
            this.materials.plasticWhite
        );
        podBody.castShadow = true;
        pod.add(podBody);

        // Aerodynamic Nosecone
        const podNose = new THREE.Mesh(
            new THREE.ConeGeometry(0.65, 0.9, 12),
            this.materials.darkSteel
        );
        podNose.position.y = 1.45;
        pod.add(podNose);

        // Cockpit / Sensor Array Visor
        const visor = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.25, 0.8),
            this.materials.brightCyan
        );
        visor.position.set(0, 0.5, 0.4);
        pod.add(visor);

        // 4 Cargo Stabilizer Fins
        for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.8, 0.4),
                this.materials.industrialYellow
            );
            fin.rotation.y = (i * Math.PI) / 2;
            fin.position.set(Math.sin((i * Math.PI) / 2) * 0.95, -0.4, Math.cos((i * Math.PI) / 2) * 0.95);
            pod.add(fin);
        }

        // Ion Propulsion Engine Bell & Plume
        const engineBell = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.35, 0.35, 10),
            this.materials.darkSteel
        );
        engineBell.position.y = -1.15;
        pod.add(engineBell);

        const enginePlume = new THREE.Mesh(
            new THREE.ConeGeometry(0.45, 1.6, 8),
            new THREE.MeshStandardMaterial({
                color: 0x38BDF8,
                emissive: 0x0EA5E9,
                emissiveIntensity: 2.8,
                transparent: true,
                opacity: 0.85
            })
        );
        enginePlume.name = 'enginePlume';
        enginePlume.rotation.x = Math.PI;
        enginePlume.position.y = -1.95;
        enginePlume.visible = false;
        pod.add(enginePlume);

        group.add(pod);
        return group;
    }

    // 14. Articulated Robotic Inserter (1x1)
    buildInserter(isFast = false) {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const armGlb = this.cloneModel(isFast ? 'robot_arm_b' : 'robot_arm_a');
        if (armGlb) {
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(ts * 0.36, ts * 0.44, 0.22, 16),
                this.materials.darkSteel
            );
            base.position.y = 0.11;
            base.castShadow = true;
            group.add(base);

            const ringMat = isFast ? this.materials.neonPurple : this.materials.industrialYellow;
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(ts * 0.38, 0.04, 8, 20),
                ringMat
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.2;
            group.add(ring);

            const armGroup = new THREE.Group();
            armGroup.name = 'inserterArm';
            armGroup.position.y = 0.22;

            armGlb.scale.set(ts * 0.65, ts * 0.65, ts * 0.65);
            armGlb.position.set(0, 0, 0);
            armGroup.add(armGlb);

            const clawItem = new THREE.Group();
            clawItem.name = 'clawItem';
            clawItem.position.set(0, 0.2, 0.75);
            clawItem.visible = false;
            
            const heldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.22), this.materials.iron);
            heldMesh.name = 'heldItemMesh';
            clawItem.add(heldMesh);
            armGroup.add(clawItem);

            group.add(armGroup);
            return group;
        }

        // Base Turntable Platform
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(ts * 0.36, ts * 0.44, 0.22, 16),
            this.materials.darkSteel
        );
        base.position.y = 0.11;
        base.castShadow = true;
        group.add(base);

        // Accent Ring
        const ringMat = isFast ? this.materials.neonPurple : this.materials.industrialYellow;
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(ts * 0.38, 0.04, 8, 20),
            ringMat
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.2;
        group.add(ring);

        // Rotating Inserter Arm Group (Root pivot at base center)
        const armGroup = new THREE.Group();
        armGroup.name = 'inserterArm';
        armGroup.position.y = 0.22;

        // Shoulder Pivot Hub
        const shoulder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.16, 0.16, 0.28, 12),
            this.materials.lightSteel
        );
        shoulder.rotation.z = Math.PI / 2;
        shoulder.position.y = 0.14;
        shoulder.castShadow = true;
        armGroup.add(shoulder);

        // Lower Arm (angled back toward +Z, which is pickup tile when rotation is 0)
        const lowerArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.72, 0.14),
            isFast ? this.materials.industrialCyan : this.materials.industrialYellow
        );
        lowerArm.position.set(0, 0.46, 0.22);
        lowerArm.rotation.x = -0.45;
        lowerArm.castShadow = true;
        armGroup.add(lowerArm);

        // Elbow Joint
        const elbow = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.22, 10),
            this.materials.darkSteel
        );
        elbow.rotation.z = Math.PI / 2;
        elbow.position.set(0, 0.78, 0.4);
        elbow.castShadow = true;
        armGroup.add(elbow);

        // Upper Forearm reaching down
        const foreArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.76, 0.1),
            this.materials.lightSteel
        );
        foreArm.position.set(0, 0.44, 0.62);
        foreArm.rotation.x = 0.55;
        foreArm.castShadow = true;
        armGroup.add(foreArm);

        // Wrist Gripper Head
        const wrist = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.08, 0.18),
            isFast ? this.materials.neonPurple : this.materials.industrialYellow
        );
        wrist.position.set(0, 0.12, 0.85);
        wrist.castShadow = true;
        armGroup.add(wrist);

        // Gripper Claws (Dual pneumatic pinchers)
        const clawMat = isFast ? this.materials.brightCyan : this.materials.industrialYellow;
        for (let side of [-0.1, 0.1]) {
            const claw = new THREE.Mesh(
                new THREE.BoxGeometry(0.04, 0.16, 0.14),
                clawMat
            );
            claw.position.set(side, 0.05, 0.94);
            armGroup.add(claw);
        }

        // Held Item Container (dynamically made visible when holding item)
        const clawItem = new THREE.Group();
        clawItem.name = 'clawItem';
        clawItem.position.set(0, 0.05, 0.94);
        clawItem.visible = false;
        
        const heldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.22), this.materials.iron);
        heldMesh.name = 'heldItemMesh';
        clawItem.add(heldMesh);
        armGroup.add(clawItem);

        group.add(armGroup);
        return group;
    }

    // 15. Chemical Plant & Fluid Refinery (3x3)
    buildChemicalPlant() {
        const group = new THREE.Group();
        const size = this.tileSize * 3;

        const tankGlb = this.cloneModel('tank_large');
        const chimneyGlb = this.cloneModel('chimney_medium');
        if (tankGlb) {
            tankGlb.scale.set(size * 0.5, size * 0.55, size * 0.5);
            tankGlb.position.set(-size * 0.2, 0, -size * 0.15);
            group.add(tankGlb);

            if (chimneyGlb) {
                chimneyGlb.scale.set(size * 0.35, size * 0.5, size * 0.35);
                chimneyGlb.position.set(size * 0.28, 0.8, -size * 0.2);
                group.add(chimneyGlb);
            }

            // Bioluminescent Fluid Reaction Vessel (Glass Tube + Glowing Core)
            const fluidGroup = new THREE.Group();
            fluidGroup.position.set(size * 0.2, 1.1, size * 0.22);

            const fluidCore = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.12, size * 0.12, 1.8, 16),
                this.materials.chemicalFluid
            );
            fluidCore.name = 'fluidVessel';
            fluidGroup.add(fluidCore);

            const glassSheath = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.14, size * 0.14, 1.95, 16),
                this.materials.glassTube
            );
            fluidGroup.add(glassSheath);
            group.add(fluidGroup);

            return group;
        }

        // Base Heavy Industry Foundation Platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.94, 0.28, size * 0.94),
            this.materials.darkSteel
        );
        platform.position.y = 0.14;
        platform.castShadow = true;
        platform.receiveShadow = true;
        group.add(platform);

        // Primary Tall Fractional Distillation Column
        const tallTower = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.15, size * 0.18, 4.4, 18),
            this.materials.lightSteel
        );
        tallTower.position.set(-size * 0.24, 2.34, -size * 0.22);
        tallTower.castShadow = true;
        group.add(tallTower);

        // Ribbed structural reinforcement rings on tall tower
        for (let y = 1.0; y <= 4.0; y += 0.8) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(size * 0.17, 0.04, 6, 18),
                this.materials.darkSteel
            );
            ring.rotation.x = Math.PI / 2;
            ring.position.set(-size * 0.24, y + 0.14, -size * 0.22);
            group.add(ring);
        }

        // Secondary Distillation Column with Spherical Dome
        const medTower = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.13, size * 0.15, 3.0, 16),
            this.materials.lightSteel
        );
        medTower.position.set(size * 0.25, 1.64, -size * 0.22);
        medTower.castShadow = true;
        group.add(medTower);

        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
            this.materials.darkSteel
        );
        dome.position.set(size * 0.25, 3.14, -size * 0.22);
        group.add(dome);

        // Bioluminescent Fluid Reaction Vessel (Glass Tube + Glowing Core)
        const fluidGroup = new THREE.Group();
        fluidGroup.position.set(0, 1.25, size * 0.2);

        const fluidCore = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.13, size * 0.13, 1.9, 16),
            this.materials.chemicalFluid
        );
        fluidCore.name = 'fluidVessel';
        fluidGroup.add(fluidCore);

        const glassSheath = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.15, size * 0.15, 2.05, 16),
            this.materials.glassTube
        );
        fluidGroup.add(glassSheath);

        // Vessel support caps
        for (let capY of [-1.05, 1.05]) {
            const cap = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.17, size * 0.17, 0.14, 16),
                this.materials.darkSteel
            );
            cap.position.y = capY;
            fluidGroup.add(cap);
        }
        group.add(fluidGroup);

        // Industrial Steam Vent Stack (where steam puffs emit)
        const ventStack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.16, 3.8, 12),
            this.materials.darkSteel
        );
        ventStack.position.set(size * 0.32, 2.04, size * 0.25);
        ventStack.castShadow = true;
        group.add(ventStack);

        // Connecting Manifold Pipes
        const pipeMat = this.materials.copper;
        const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, size * 0.48, 8), pipeMat);
        p1.rotation.z = Math.PI / 2;
        p1.position.set(0, 2.8, -size * 0.22);
        group.add(p1);

        const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 8), pipeMat);
        p2.rotation.x = Math.PI / 2;
        p2.position.set(-size * 0.12, 1.5, 0);
        group.add(p2);

        return group;
    }

    // 16. Conveyor Overpass Bridge (1x1)
    buildConveyorBridge() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        // Ground Level Passage Archway (4 Corner Steel Trestles)
        const postGeom = new THREE.BoxGeometry(0.14, 1.3, 0.14);
        for (let x of [-ts * 0.42, ts * 0.42]) {
            for (let z of [-ts * 0.42, ts * 0.42]) {
                const post = new THREE.Mesh(postGeom, this.materials.darkSteel);
                post.position.set(x, 0.65, z);
                post.castShadow = true;
                group.add(post);
            }
        }

        // Cross Struts / Trusses
        const strutGeom = new THREE.BoxGeometry(ts * 0.94, 0.1, 0.12);
        for (let z of [-ts * 0.42, ts * 0.42]) {
            const strut = new THREE.Mesh(strutGeom, this.materials.lightSteel);
            strut.position.set(0, 1.25, z);
            group.add(strut);
        }

        // Elevated Conveyor Bed at y = 1.35
        const elevatedBed = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.88, 0.12, ts * 0.98),
            this.materials.conveyorBelt
        );
        elevatedBed.position.y = 1.35;
        elevatedBed.castShadow = true;
        group.add(elevatedBed);

        // Safety Railings on Elevated Deck
        const guardGeom = new THREE.BoxGeometry(0.08, 0.35, ts * 0.98);
        const leftGuard = new THREE.Mesh(guardGeom, this.materials.hazardStripe);
        leftGuard.position.set(-ts * 0.44, 1.48, 0);
        group.add(leftGuard);

        const rightGuard = new THREE.Mesh(guardGeom, this.materials.hazardStripe);
        rightGuard.position.set(ts * 0.44, 1.48, 0);
        group.add(rightGuard);

        return group;
    }

    // 17. Smart Filter Splitter (1x1)
    buildSmartSplitter() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const crossGlb = this.cloneModel('conveyor_cross');
        const scannerGlb = this.cloneModel('scanner_low');
        if (crossGlb) {
            crossGlb.scale.set(ts * 0.94, ts * 0.94, ts * 0.94);
            group.add(crossGlb);

            if (scannerGlb) {
                scannerGlb.scale.set(ts * 0.65, ts * 0.65, ts * 0.65);
                scannerGlb.position.set(0, 0.4, 0);
                group.add(scannerGlb);
            }
            return group;
        }

        const chassis = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.94, 0.48, ts * 0.94),
            this.materials.darkSteel
        );
        chassis.position.y = 0.24;
        chassis.castShadow = true;
        group.add(chassis);

        // Three output channels: Left, Center, Right
        const laneGeom = new THREE.BoxGeometry(ts * 0.26, 0.14, 0.22);
        for (let x of [-ts * 0.3, 0, ts * 0.3]) {
            const lane = new THREE.Mesh(laneGeom, this.materials.conveyorFast);
            lane.position.set(x, 0.22, -ts * 0.46);
            group.add(lane);
        }

        // Optical Scanner Gantry Arch
        const arch = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.85, 0.5, 0.12),
            this.materials.lightSteel
        );
        arch.position.set(0, 0.65, 0.1);
        arch.castShadow = true;
        group.add(arch);

        // Programmable Optical Filter Lens
        const lens = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12),
            this.materials.brightCyan
        );
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, 0.65, 0.17);
        group.add(lens);

        return group;
    }

    // 18. Long-Handed Inserter (1x1, 2-tile reach)
    buildLongInserter() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const armGlb = this.cloneModel('robot_arm_a');
        if (armGlb) {
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(ts * 0.4, ts * 0.46, 0.24, 16),
                this.materials.crimsonSteel
            );
            base.position.y = 0.12;
            base.castShadow = true;
            group.add(base);

            const armGroup = new THREE.Group();
            armGroup.name = 'inserterArm';
            armGroup.position.y = 0.24;

            armGlb.scale.set(ts * 0.8, ts * 0.8, ts * 1.3);
            armGlb.position.set(0, 0, 0.15);
            armGroup.add(armGlb);

            const clawItem = new THREE.Group();
            clawItem.name = 'clawItem';
            clawItem.position.set(0, 0.25, 1.4);
            clawItem.visible = false;
            const heldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.22), this.materials.iron);
            heldMesh.name = 'heldItemMesh';
            clawItem.add(heldMesh);
            armGroup.add(clawItem);

            group.add(armGroup);
            return group;
        }

        // Base Turntable Platform (Crimson Steel)
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(ts * 0.4, ts * 0.46, 0.24, 16),
            this.materials.crimsonSteel
        );
        base.position.y = 0.12;
        base.castShadow = true;
        group.add(base);

        const armGroup = new THREE.Group();
        armGroup.name = 'inserterArm';
        armGroup.position.y = 0.24;

        // Shoulder Pivot Hub
        const shoulder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.3, 12),
            this.materials.darkSteel
        );
        shoulder.rotation.z = Math.PI / 2;
        shoulder.position.y = 0.16;
        armGroup.add(shoulder);

        // Telescoping Lower Boom (Extra long reach)
        const lowerBoom = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 1.25, 0.14),
            this.materials.crimsonSteel
        );
        lowerBoom.position.set(0, 0.75, 0.45);
        lowerBoom.rotation.x = -0.52;
        lowerBoom.castShadow = true;
        armGroup.add(lowerBoom);

        // Elbow Joint
        const elbow = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 0.24, 10),
            this.materials.darkSteel
        );
        elbow.rotation.z = Math.PI / 2;
        elbow.position.set(0, 1.3, 0.82);
        armGroup.add(elbow);

        // Extended Forearm
        const foreArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.11, 1.2, 0.11),
            this.materials.lightSteel
        );
        foreArm.position.set(0, 0.8, 1.35);
        foreArm.rotation.x = 0.68;
        foreArm.castShadow = true;
        armGroup.add(foreArm);

        // Extended Gripper Head
        const clawHead = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.1, 0.22),
            this.materials.crimsonSteel
        );
        clawHead.position.set(0, 0.2, 1.88);
        armGroup.add(clawHead);

        // Held Item Container
        const clawItem = new THREE.Group();
        clawItem.name = 'clawItem';
        clawItem.position.set(0, 0.1, 1.95);
        clawItem.visible = false;
        const heldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.16, 0.22), this.materials.iron);
        heldMesh.name = 'heldItemMesh';
        clawItem.add(heldMesh);
        armGroup.add(clawItem);

        group.add(armGroup);
        return group;
    }

    // 19. Conveyor Lift Tower (1x1)
    buildConveyorLift() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        // Base & Top collars
        for (let y of [0.15, 3.15]) {
            const collar = new THREE.Mesh(
                new THREE.BoxGeometry(ts * 0.88, 0.25, ts * 0.88),
                this.materials.darkSteel
            );
            collar.position.y = y;
            group.add(collar);
        }

        // 4 Corner Vertical Columns
        const colGeom = new THREE.BoxGeometry(0.12, 3.0, 0.12);
        for (let x of [-ts * 0.38, ts * 0.38]) {
            for (let z of [-ts * 0.38, ts * 0.38]) {
                const col = new THREE.Mesh(colGeom, this.materials.lightSteel);
                col.position.set(x, 1.65, z);
                group.add(col);
            }
        }

        // Central Vertical Lift Chute
        const chute = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.55, 2.9, ts * 0.55),
            this.materials.glassTube
        );
        chute.position.y = 1.65;
        group.add(chute);

        // Carrier platform inside lift
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.48, 0.15, ts * 0.48),
            this.materials.industrialYellow
        );
        platform.position.y = 1.65;
        platform.name = 'liftPlatform';
        group.add(platform);

        return group;
    }

    // 20. Belt Crossing Junction (1x1)
    buildBeltCrossing() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        // Base plate
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.96, 0.1, ts * 0.96),
            this.materials.darkSteel
        );
        base.position.y = 0.05;
        group.add(base);

        // Ground crossing bed
        const lowerBed = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.84, 0.08, ts * 0.96),
            this.materials.conveyorBelt
        );
        lowerBed.position.y = 0.1;
        group.add(lowerBed);

        // Elevated cross bed
        const upperBed = new THREE.Mesh(
            new THREE.BoxGeometry(ts * 0.96, 0.08, ts * 0.84),
            this.materials.conveyorBelt
        );
        upperBed.position.y = 0.22;
        group.add(upperBed);

        // Corner Guides
        for (let x of [-ts * 0.44, ts * 0.44]) {
            for (let z of [-ts * 0.44, ts * 0.44]) {
                const corner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.12), this.materials.hazardStripe);
                corner.position.set(x, 0.16, z);
                group.add(corner);
            }
        }

        return group;
    }

    // 21. Heavy Alloy Foundry (3x3)
    buildFoundry() {
        const group = new THREE.Group();
        const size = this.tileSize * 3;

        const machineGlb = this.cloneModel('machine_fortified');
        const chimneyGlb = this.cloneModel('chimney_large');
        if (machineGlb) {
            machineGlb.scale.set(size * 0.58, size * 0.58, size * 0.58);
            machineGlb.position.set(0, 0, 0);
            group.add(machineGlb);

            if (chimneyGlb) {
                const c1 = chimneyGlb.clone(true);
                c1.scale.set(size * 0.32, size * 0.48, size * 0.32);
                c1.position.set(-size * 0.28, 1.0, -size * 0.25);
                group.add(c1);

                const c2 = chimneyGlb.clone(true);
                c2.scale.set(size * 0.32, size * 0.48, size * 0.32);
                c2.position.set(size * 0.28, 1.0, -size * 0.25);
                group.add(c2);
            }

            const runner = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.28, 0.15, size * 0.62),
                this.materials.moltenCore
            );
            runner.position.set(0, 0.38, size * 0.2);
            runner.name = 'moltenRunner';
            group.add(runner);

            return group;
        }

        // Heavy Foundation
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.94, 0.35, size * 0.94),
            this.materials.furnaceBody
        );
        base.position.y = 0.175;
        base.castShadow = true;
        group.add(base);

        // Dual Blast Furnace Cylinders
        for (let x of [-size * 0.24, size * 0.24]) {
            const furnace = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.2, size * 0.25, 2.6, 16),
                this.materials.furnaceBody
            );
            furnace.position.set(x, 1.45, -size * 0.15);
            furnace.castShadow = true;
            group.add(furnace);

            // Refractory reinforcement bands
            for (let y = 0.8; y <= 2.4; y += 0.8) {
                const band = new THREE.Mesh(
                    new THREE.TorusGeometry(size * 0.23, 0.04, 6, 16),
                    this.materials.darkSteel
                );
                band.rotation.x = Math.PI / 2;
                band.position.set(x, y, -size * 0.15);
                group.add(band);
            }
        }

        // Central Molten Slag Runner Channel
        const runner = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.25, 0.15, size * 0.65),
            this.materials.moltenCore
        );
        runner.position.set(0, 0.38, size * 0.12);
        runner.name = 'moltenRunner';
        group.add(runner);

        // Dual Exhaust Stacks
        for (let x of [-size * 0.24, size * 0.24]) {
            const stack = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.22, 2.2, 10),
                this.materials.darkSteel
            );
            stack.position.set(x, 3.6, -size * 0.15);
            stack.castShadow = true;
            group.add(stack);
        }

        return group;
    }

    // 22. Precision Manufacturer (3x3)
    buildManufacturer() {
        const group = new THREE.Group();
        const size = this.tileSize * 3;

        const machineGlb = this.cloneModel('machine_fortified');
        const pistonGlb = this.cloneModel('piston_round');
        const pipeGlb = this.cloneModel('machine_pipe');

        if (machineGlb) {
            machineGlb.scale.set(size * 0.62, size * 0.6, size * 0.62);
            group.add(machineGlb);

            if (pistonGlb) {
                pistonGlb.scale.set(size * 0.45, size * 0.45, size * 0.45);
                pistonGlb.position.set(0, 1.2, 0);
                pistonGlb.name = 'hydraulicRam';
                group.add(pistonGlb);
            }

            if (pipeGlb) {
                pipeGlb.scale.set(size * 0.45, size * 0.45, size * 0.45);
                pipeGlb.position.set(size * 0.3, 0.5, 0);
                group.add(pipeGlb);
            }
            return group;
        }

        // Heavy Foundation
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.94, 0.38, size * 0.94),
            this.materials.darkSteel
        );
        base.position.y = 0.19;
        base.castShadow = true;
        group.add(base);

        // Heavy Industrial Assembly Hall Structure
        const hall = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.88, 1.6, size * 0.7),
            this.materials.lightSteel
        );
        hall.position.set(0, 1.15, -size * 0.1);
        hall.castShadow = true;
        group.add(hall);

        // Yellow Caution Gantry Roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.92, 0.18, size * 0.74),
            this.materials.hazardStripe
        );
        roof.position.set(0, 2.04, -size * 0.1);
        group.add(roof);

        // 4 Feeder Conveyor Chutes at Rear & Sides
        for (let x of [-size * 0.35, -size * 0.12, size * 0.12, size * 0.35]) {
            const chute = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.16, 0.28, size * 0.24),
                this.materials.darkSteel
            );
            chute.position.set(x, 0.45, size * 0.35);
            group.add(chute);
        }

        // Center Hydraulic Stamping Ram
        const ram = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.24, 0.8, 12),
            this.materials.titanium
        );
        ram.position.set(0, 1.6, size * 0.05);
        ram.name = 'hydraulicRam';
        group.add(ram);

        return group;
    }

    // 23. Hydroponic Bio-Dome (2x2)
    buildGreenhouse() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;

        // Circular Foundation
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.46, size * 0.48, 0.3, 24),
            this.materials.darkSteel
        );
        base.position.y = 0.15;
        group.add(base);

        // Hydroponic Growth Bed
        const bed = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.42, size * 0.42, 0.12, 20),
            this.materials.biomassGreen
        );
        bed.position.y = 0.35;
        group.add(bed);

        // Geodesic Glass Dome
        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.44, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshStandardMaterial({
                color: 0x6EE7B7,
                roughness: 0.1,
                metalness: 0.1,
                transparent: true,
                opacity: 0.55
            })
        );
        dome.position.y = 0.3;
        group.add(dome);

        // Central Violet UV Grow Lamp
        const uvLamp = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8),
            this.materials.neonPurple
        );
        uvLamp.position.y = 1.0;
        group.add(uvLamp);

        return group;
    }

    // 24. Aero Wind Turbine (1x1)
    buildWindTurbine() {
        const group = new THREE.Group();
        const ts = this.tileSize;

        const glb = this.cloneModel('windmill');
        if (glb) {
            glb.scale.set(ts * 0.72, ts * 0.72, ts * 0.72);
            glb.position.set(0, 0, 0);
            group.add(glb);

            const rotorGroup = new THREE.Group();
            rotorGroup.name = 'turbineRotor';
            rotorGroup.position.set(0, 4.2, 0.35);
            const hub = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), this.materials.industrialCyan);
            rotorGroup.add(hub);
            for (let i = 0; i < 3; i++) {
                const angle = (i * Math.PI * 2) / 3;
                const blade = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 1.8, 0.04),
                    this.materials.plasticWhite
                );
                blade.position.set(Math.sin(angle) * 0.9, Math.cos(angle) * 0.9, 0);
                blade.rotation.z = -angle;
                rotorGroup.add(blade);
            }
            group.add(rotorGroup);
            return group;
        }

        // Base Pedestal
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.5, 0.4, 12),
            this.materials.darkSteel
        );
        base.position.y = 0.2;
        group.add(base);

        // Slender Composite Mast (Height: 5.5)
        const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.18, 5.2, 12),
            this.materials.plasticWhite
        );
        mast.position.y = 2.8;
        mast.castShadow = true;
        group.add(mast);

        // Top Nacelle Generator Pod
        const nacelle = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.26, 0.6),
            this.materials.titanium
        );
        nacelle.position.set(0, 5.4, 0.1);
        group.add(nacelle);

        // Spinning Rotor Group
        const rotorGroup = new THREE.Group();
        rotorGroup.name = 'turbineRotor';
        rotorGroup.position.set(0, 5.4, 0.42);

        // Rotor Hub
        const hub = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), this.materials.industrialCyan);
        rotorGroup.add(hub);

        // 3 Aerodynamic Blades
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            const blade = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 2.2, 0.04),
                this.materials.plasticWhite
            );
            blade.position.set(Math.sin(angle) * 1.1, Math.cos(angle) * 1.1, 0);
            blade.rotation.z = -angle;
            rotorGroup.add(blade);
        }

        group.add(rotorGroup);
        return group;
    }

    // 25. Nuclear Fission Reactor (3x3)
    buildNuclearReactor() {
        const group = new THREE.Group();
        const size = this.tileSize * 3;

        const buildingGlb = this.cloneModel('building_f');
        const tankGlb = this.cloneModel('tank_large');

        if (buildingGlb) {
            buildingGlb.scale.set(size * 0.55, size * 0.55, size * 0.55);
            buildingGlb.position.set(0, 0, 0);
            group.add(buildingGlb);

            if (tankGlb) {
                tankGlb.scale.set(size * 0.38, size * 0.45, size * 0.38);
                tankGlb.position.set(size * 0.26, 0.4, size * 0.2);
                group.add(tankGlb);
            }

            const pool = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.22, size * 0.22, 0.2, 16),
                this.materials.nuclearCore
            );
            pool.position.set(-size * 0.18, 0.6, -size * 0.1);
            pool.name = 'cherenkovCore';
            group.add(pool);

            return group;
        }

        // Concrete Base Platform
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.95, 0.4, size * 0.95),
            this.materials.furnaceBody
        );
        base.position.y = 0.2;
        group.add(base);

        // Massive Hyperboloid Cooling Tower
        const tower = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.26, size * 0.4, 4.2, 24),
            this.materials.furnaceBody
        );
        tower.position.set(-size * 0.18, 2.3, -size * 0.1);
        tower.castShadow = true;
        group.add(tower);

        // Cherenkov Radiation Core Pool inside tower
        const pool = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.22, size * 0.22, 0.2, 16),
            this.materials.nuclearCore
        );
        pool.position.set(-size * 0.18, 0.5, -size * 0.1);
        pool.name = 'cherenkovCore';
        group.add(pool);

        // Reactor Pressure Containment Vessel
        const vessel = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.24, 16, 14, 0, Math.PI * 2, 0, Math.PI / 2),
            this.materials.darkSteel
        );
        vessel.position.set(size * 0.26, 0.4, size * 0.2);
        group.add(vessel);

        // Control Rod Array Actuators
        for (let i = -0.15; i <= 0.15; i += 0.15) {
            const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), this.materials.uranium);
            rod.position.set(size * 0.26 + i, 1.6, size * 0.2);
            group.add(rod);
        }

        return group;
    }

    // 26. Grid Battery Accumulator (2x2)
    buildAccumulator() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;

        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.9, 0.25, size * 0.9),
            this.materials.darkSteel
        );
        base.position.y = 0.125;
        group.add(base);

        // 4 High-Voltage Capacitors
        for (let x of [-size * 0.22, size * 0.22]) {
            for (let z of [-size * 0.22, size * 0.22]) {
                const cap = new THREE.Mesh(
                    new THREE.CylinderGeometry(size * 0.16, size * 0.16, 1.8, 14),
                    this.materials.accumulatorBlue
                );
                cap.position.set(x, 1.05, z);
                cap.castShadow = true;
                group.add(cap);
            }
        }

        // Vertical LED Charge Level Meter (Front Face)
        const meterGroup = new THREE.Group();
        meterGroup.name = 'accumulatorMeter';
        meterGroup.position.set(0, 1.0, size * 0.44);

        for (let i = 0; i < 5; i++) {
            const led = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.12, 0.04),
                this.materials.brightCyan
            );
            led.position.y = (i - 2) * 0.22;
            meterGroup.add(led);
        }
        group.add(meterGroup);

        return group;
    }

    // 27. Heavy Industrial Silo Mk.2 (2x2)
    buildStorageSiloMk2() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;

        const tankGlb = this.cloneModel('tank_large');
        const hopperGlb = this.cloneModel('hopper_round');

        if (tankGlb) {
            tankGlb.scale.set(size * 0.62, size * 0.78, size * 0.62);
            tankGlb.position.set(0, 0, 0);
            group.add(tankGlb);

            if (hopperGlb) {
                hopperGlb.scale.set(size * 0.38, size * 0.38, size * 0.38);
                hopperGlb.position.set(0, 2.6, 0);
                group.add(hopperGlb);
            }
            return group;
        }

        // Base Foundation
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.44, size * 0.46, 0.35, 20),
            this.materials.darkSteel
        );
        base.position.y = 0.175;
        group.add(base);

        // Tall Reinforced Tank Body (Height 3.8)
        const tank = new THREE.Mesh(
            new THREE.CylinderGeometry(size * 0.4, size * 0.4, 3.8, 20),
            this.materials.lightSteel
        );
        tank.position.y = 2.05;
        tank.castShadow = true;
        group.add(tank);

        // Dome Roof
        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
            this.materials.darkSteel
        );
        dome.position.y = 3.95;
        group.add(dome);

        // Helical Exterior Maintenance Stairs
        const steps = 14;
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * Math.PI * 2.2;
            const step = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.35), this.materials.industrialYellow);
            step.position.set(Math.cos(angle) * size * 0.44, 0.4 + i * 0.24, Math.sin(angle) * size * 0.44);
            step.rotation.y = -angle;
            group.add(step);
        }

        return group;
    }

    // 28. Surveyor Drone / Builder Bot
    buildSurveyorDrone() {
        const drone = new THREE.Group();
        drone.name = 'surveyorDrone';

        const body = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.2, metalness: 0.1 })
        );
        body.position.y = 0.8;
        body.castShadow = true;
        drone.add(body);

        const visor = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, 0.1, 0.12),
            this.materials.brightCyan
        );
        visor.position.set(0, 0.82, 0.26);
        drone.add(visor);

        const thruster = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.02, 0.15, 8),
            this.materials.brightCyan
        );
        thruster.position.y = 0.55;
        drone.add(thruster);

        return drone;
    }

    // 29. 3D Item Models (Physically on Conveyors)
    createItemMesh(itemType) {
        let geom = null;
        let mat = this.materials.iron;

        switch (itemType) {
            case 'iron_ingot':
                geom = new THREE.BoxGeometry(0.32, 0.12, 0.22);
                mat = this.materials.iron;
                break;
            case 'copper_ingot':
                geom = new THREE.BoxGeometry(0.32, 0.12, 0.22);
                mat = this.materials.copper;
                break;
            case 'steel_plate':
                geom = new THREE.BoxGeometry(0.34, 0.06, 0.34);
                mat = this.materials.darkSteel;
                break;
            case 'titanium_plate':
                geom = new THREE.BoxGeometry(0.34, 0.06, 0.34);
                mat = this.materials.titanium;
                break;
            case 'iron_gear':
                geom = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 8);
                mat = this.materials.iron;
                break;
            case 'copper_wire':
                geom = new THREE.TorusGeometry(0.12, 0.04, 6, 12);
                mat = this.materials.copper;
                break;
            case 'circuit':
                geom = new THREE.BoxGeometry(0.28, 0.04, 0.28);
                mat = this.materials.pcbGreen;
                break;
            case 'microprocessor':
                geom = new THREE.BoxGeometry(0.28, 0.05, 0.28);
                mat = this.materials.brightCyan;
                break;
            case 'rotor':
                geom = new THREE.CylinderGeometry(0.14, 0.14, 0.28, 10);
                mat = this.materials.industrialCyan;
                break;
            case 'heavy_frame':
                geom = new THREE.BoxGeometry(0.35, 0.25, 0.35);
                mat = this.materials.darkSteel;
                break;
            case 'plastic':
                geom = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 6);
                mat = this.materials.plasticWhite;
                break;
            case 'battery':
                geom = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 12);
                mat = this.materials.batteryYellow;
                break;
            case 'fuel_rod':
                geom = new THREE.CylinderGeometry(0.1, 0.1, 0.32, 10);
                mat = this.materials.uranium;
                break;
            case 'science_pack_1':
                geom = new THREE.ConeGeometry(0.14, 0.3, 8);
                mat = this.materials.glassScience;
                break;
            case 'science_pack_2':
                geom = new THREE.DodecahedronGeometry(0.14, 0);
                mat = this.materials.neonPurple;
                break;
            case 'space_capsule':
                geom = new THREE.ConeGeometry(0.18, 0.38, 8);
                mat = this.materials.quantumPink;
                break;
            case 'quantum_cube':
                geom = new THREE.BoxGeometry(0.25, 0.25, 0.25);
                mat = this.materials.quantumPink;
                break;
            case 'biomass':
                geom = new THREE.SphereGeometry(0.16, 8, 8);
                mat = this.materials.biomassGreen;
                break;
            case 'titanium_ore':
                geom = new THREE.DodecahedronGeometry(0.16, 0);
                mat = this.materials.titanium;
                break;
            case 'uranium_ore':
                geom = new THREE.OctahedronGeometry(0.16, 0);
                mat = this.materials.uranium;
                break;
            default:
                geom = new THREE.DodecahedronGeometry(0.14, 0);
                mat = this.materials.lightSteel;
                break;
        }

        const mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        return mesh;
    }
}
