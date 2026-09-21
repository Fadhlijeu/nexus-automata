/**
 * Comprehensive 3D Model Library & Mesh Generators
 * Nexus Automata (Three.js 3D Engine)
 */

import * as THREE from '../libs/three.module.js';

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
            floodlight: new THREE.MeshStandardMaterial({ color: 0xFEF08A, emissive: 0xFDE047, emissiveIntensity: 2.2 })
        };
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
            case 'chemical_plant':
                mesh = this.buildChemicalPlant();
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

        // Base frame bed
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

        // Furnace Main Body
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

        // Twin Smokestacks (Points for billowing smoke)
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

        // Workshop Base & Walls
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
        lampHousing.rotation.x = 0.45; // angled downwards
        group.add(lampHousing);

        const lampBulb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.16), this.materials.floodlight);
        lampBulb.position.set(0, 3.72, 0.17);
        lampBulb.rotation.x = 0.45;
        group.add(lampBulb);

        // Ground illumination point light for dramatic night atmosphere
        const floodLight = new THREE.PointLight(0xFDE047, 0.85, 15, 2.0);
        floodLight.position.set(0, 3.5, 0.2);
        group.add(floodLight);

        return group;
    }

    // 11. Storage Silo (2x2)
    buildStorageSilo() {
        const group = new THREE.Group();
        const size = this.tileSize * 2;

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

        // 3 Concentric Holographic Orbital Rings (Animated)
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

        const base = new THREE.Mesh(
            new THREE.BoxGeometry(size * 0.9, 0.6, size * 0.9),
            this.materials.darkSteel
        );
        base.position.y = 0.3;
        base.castShadow = true;
        group.add(base);

        // 4 Buttress Towers
        const towerGeom = new THREE.CylinderGeometry(0.35, 0.7, 4.5, 8);
        for (let x of [-size * 0.35, size * 0.35]) {
            for (let z of [-size * 0.35, size * 0.35]) {
                const tower = new THREE.Mesh(towerGeom, this.materials.lightSteel);
                tower.position.set(x, 2.55, z);
                tower.castShadow = true;
                group.add(tower);
            }
        }

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(size * 0.35, 0.2, 8, 24),
            this.materials.brightCyan
        );
        ring.rotateX(Math.PI / 2);
        ring.position.y = 4.2;
        group.add(ring);

        const tether = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 120, 8),
            this.materials.brightCyan
        );
        tether.position.y = 60;
        group.add(tether);

        return group;
    }

    // 14. Articulated Robotic Inserter (1x1)
    buildInserter(isFast = false) {
        const group = new THREE.Group();
        const ts = this.tileSize;

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

    // 17. Surveyor Drone / Builder Bot
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

    // 15. 3D Item Models (Physically on Conveyors)
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
            case 'rotor':
                geom = new THREE.CylinderGeometry(0.14, 0.14, 0.28, 10);
                mat = this.materials.industrialCyan;
                break;
            case 'science_pack_1':
                geom = new THREE.ConeGeometry(0.14, 0.3, 8);
                mat = this.materials.glassScience;
                break;
            case 'science_pack_2':
                geom = new THREE.DodecahedronGeometry(0.14, 0);
                mat = this.materials.neonPurple;
                break;
            case 'steel_plate':
                geom = new THREE.BoxGeometry(0.34, 0.06, 0.34);
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
