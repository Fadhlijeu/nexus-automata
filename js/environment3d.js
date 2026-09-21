/**
 * 3D Environment Engine: Stylized Grass Grid, Foliage, Lakes, Mountains, Sun with Shadows, Atmosphere Modes, and 3D Clouds
 * Nexus Automata (Three.js 3D Engine)
 */

import * as THREE from '../libs/three.module.js';

export class WorldEnvironment3D {
    constructor(scene, grid) {
        this.scene = scene;
        this.grid = grid;
        this.tileSize = 2.0;

        this.clouds = [];
        this.oreMeshes = [];
        this.waterMeshes = [];
        this.currentAtmosphere = 'day';
        this.stars = null;
        this.aurora = null;
        this.sunSphere = null;

        this.initLighting();
        this.initTerrain();
        this.initMountains();
        this.initFoliageAndWater();
        this.initClouds();
        this.initOreDeposits();
        this.initSunSphere();
        this.initStarfield();
        this.initAurora();

        // Apply default day atmosphere to position sun sphere correctly
        setTimeout(() => this.setAtmosphere('day'), 0);
    }

    initLighting() {
        // Ambient Sky / Ground Bounce Light
        this.hemiLight = new THREE.HemisphereLight(0xD8F3DC, 0x2D6A4F, 0.75);
        this.scene.add(this.hemiLight);

        // Directional Sun Light with Shadows
        this.sunLight = new THREE.DirectionalLight(0xFFFBEA, 1.45);
        this.sunLight.position.set(60, 100, 70);
        this.sunLight.castShadow = true;

        // Configure Sun Shadow Map for high definition
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 10;
        this.sunLight.shadow.camera.far = 320;

        const d = 115;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
        this.sunLight.shadow.bias = -0.0004;

        this.scene.add(this.sunLight);

        // Soft Atmosphere Fog matching horizon
        this.scene.background = new THREE.Color(0x99D5C9);
        this.scene.fog = new THREE.FogExp2(0x99D5C9, 0.005);
        this.cycleTime = 0;
    }

    initSunSphere() {
        // Visible glowing 3D Sun disc
        const sunGeom = new THREE.SphereGeometry(8, 16, 16);
        this.sunMat = new THREE.MeshBasicMaterial({
            color: 0xFFFDE7,
        });
        this.sunSphere = new THREE.Mesh(sunGeom, this.sunMat);
        this.scene.add(this.sunSphere);

        // Sun corona halo (bigger slightly transparent sphere)
        const coronaGeom = new THREE.SphereGeometry(12, 12, 12);
        this.coronaMat = new THREE.MeshBasicMaterial({
            color: 0xFFF9C4,
            transparent: true,
            opacity: 0.22
        });
        const corona = new THREE.Mesh(coronaGeom, this.coronaMat);
        this.sunSphere.add(corona);
    }

    initStarfield() {
        const starCount = 3000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            // Place stars on a large hemisphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 450 + Math.random() * 100;
            positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 20; // keep stars in upper hemisphere
            positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const starGeom = new THREE.BufferGeometry();
        starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1.8, sizeAttenuation: true, transparent: true, opacity: 0.0 });
        this.stars = new THREE.Points(starGeom, starMat);
        this.scene.add(this.stars);
    }

    initAurora() {
        // Procedural aurora borealis effect using a curved ribbon
        const auroraGroup = new THREE.Group();
        const auroraColors = [0x00FFAA, 0x4040FF, 0x00CCFF, 0xAA00FF];

        for (let i = 0; i < 4; i++) {
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(-200 + i * 60, 80 + i * 10, -350 - i * 20),
                new THREE.Vector3(80, 100 + Math.sin(i) * 30, -300),
                new THREE.Vector3(200 + i * 40, 70 + i * 8, -250 - i * 30)
            );
            const points = curve.getPoints(20);
            const ribbonGeom = new THREE.BufferGeometry().setFromPoints(points);
            const ribbonMat = new THREE.LineBasicMaterial({
                color: auroraColors[i % auroraColors.length],
                transparent: true,
                opacity: 0.0
            });
            const ribbon = new THREE.Line(ribbonGeom, ribbonMat);
            auroraGroup.add(ribbon);
        }
        this.aurora = auroraGroup;
        this.scene.add(auroraGroup);
    }

    setAtmosphere(mode = 'day') {
        this.currentAtmosphere = mode;
        const cx = this.grid.width * this.tileSize / 2;
        const cz = this.grid.height * this.tileSize / 2;

        if (mode === 'sunset') {
            // Golden hour sunset
            this.scene.background.setHex(0xF4845F);
            this.scene.fog.color.setHex(0xF4845F);
            this.sunLight.color.setHex(0xFFA552);
            this.sunLight.intensity = 1.35;
            this.sunLight.position.set(110, 35, 45);
            this.hemiLight.color.setHex(0xFFD6BA);
            this.hemiLight.groundColor.setHex(0x5E503F);
            if (this.sunSphere) {
                this.sunMat.color.setHex(0xFF8833);
                this.sunSphere.position.set(cx + 200, 40, cz + 100);
                this.sunSphere.visible = true;
            }
            if (this.stars) this.stars.material.opacity = 0.0;
            if (this.aurora) this.aurora.children.forEach(c => c.material.opacity = 0.0);
        } else if (mode === 'night') {
            // Cybernetic midnight
            this.scene.background.setHex(0x0B0F19);
            this.scene.fog.color.setHex(0x0B0F19);
            this.sunLight.color.setHex(0x38BDF8);
            this.sunLight.intensity = 0.45;
            this.sunLight.position.set(-50, 70, -60);
            this.hemiLight.color.setHex(0x1E293B);
            this.hemiLight.groundColor.setHex(0x020617);
            if (this.sunSphere) this.sunSphere.visible = false;
            if (this.stars) this.stars.material.opacity = 0.85;
            if (this.aurora) this.aurora.children.forEach((c, i) => c.material.opacity = 0.3 + i * 0.05);
        } else if (mode === 'cycle') {
            // Auto day-night cycle active
            this.cycleTime = 0.5; // Start near morning
        } else {
            // High noon day
            this.scene.background.setHex(0x99D5C9);
            this.scene.fog.color.setHex(0x99D5C9);
            this.sunLight.color.setHex(0xFFFBEA);
            this.sunLight.intensity = 1.45;
            this.sunLight.position.set(60, 100, 70);
            this.hemiLight.color.setHex(0xD8F3DC);
            this.hemiLight.groundColor.setHex(0x2D6A4F);
            if (this.sunSphere) {
                this.sunMat.color.setHex(0xFFFDE7);
                this.sunSphere.position.set(cx + 100, 180, cz + 130);
                this.sunSphere.visible = true;
            }
            if (this.stars) this.stars.material.opacity = 0.0;
            if (this.aurora) this.aurora.children.forEach(c => c.material.opacity = 0.0);
        }
    }

    initTerrain() {
        const w = this.grid.width;
        const h = this.grid.height;
        const ts = this.tileSize;

        const geometry = new THREE.PlaneGeometry(w * ts, h * ts, w, h);
        geometry.rotateX(-Math.PI / 2);
        geometry.translate((w * ts) / 2, 0, (h * ts) / 2);

        // Stylized multi-tone green grass colors matching reference image
        const count = geometry.attributes.position.count;
        const colors = new Float32Array(count * 3);

        const colorPalette = [
            new THREE.Color(0x3A865D), // Grass Green
            new THREE.Color(0x4EAC7A), // Light Vibrant Green
            new THREE.Color(0x6BC593), // Fresh Meadow Green
            new THREE.Color(0x255E43)  // Deep Patch Green
        ];

        for (let i = 0; i < count; i++) {
            const x = geometry.attributes.position.getX(i);
            const z = geometry.attributes.position.getZ(i);

            const n = Math.sin(x * 0.08) * Math.cos(z * 0.08) + Math.sin(x * 0.15 + z * 0.1) * 0.5;
            let palIdx = 0;
            if (n > 0.4) palIdx = 1;
            else if (n > -0.1) palIdx = 2;
            else if (n > -0.6) palIdx = 0;
            else palIdx = 3;

            const c = colorPalette[palIdx];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.9,
            metalness: 0.05,
            flatShading: true
        });

        const terrainMesh = new THREE.Mesh(geometry, material);
        terrainMesh.receiveShadow = true;
        this.scene.add(terrainMesh);

        // Grid lines overlay
        const gridHelper = new THREE.GridHelper(w * ts, w, 0x255E43, 0x3A865D);
        gridHelper.position.set((w * ts) / 2, 0.02, (h * ts) / 2);
        gridHelper.material.opacity = 0.35;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    initMountains() {
        const w = this.grid.width * this.tileSize;
        const h = this.grid.height * this.tileSize;
        const cx = w / 2;
        const cz = h / 2;

        const mountainGroup = new THREE.Group();
        const mountainMat = new THREE.MeshStandardMaterial({
            color: 0x346857,
            roughness: 0.95,
            flatShading: true
        });
        const snowMat = new THREE.MeshStandardMaterial({
            color: 0xEEF7F2,
            roughness: 0.8,
            flatShading: true
        });

        // Ring of mountains around perimeter
        const mountainCount = 48;
        const distMin = w * 0.78;
        const distMax = w * 1.4;

        for (let i = 0; i < mountainCount; i++) {
            const angle = (i / mountainCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
            const dist = distMin + Math.random() * (distMax - distMin);
            const x = cx + Math.cos(angle) * dist;
            const z = cz + Math.sin(angle) * dist;

            const radius = 28 + Math.random() * 38;
            const height = 45 + Math.random() * 75;

            // Mountain Cone
            const geom = new THREE.ConeGeometry(radius, height, 6 + Math.floor(Math.random() * 3));
            geom.translate(0, height / 2 - 4, 0);

            const mMesh = new THREE.Mesh(geom, mountainMat);
            mMesh.position.set(x, 0, z);
            mMesh.rotation.y = Math.random() * Math.PI;
            mountainGroup.add(mMesh);

            // Snow Cap on tall peaks
            if (height > 58) {
                const snowGeom = new THREE.ConeGeometry(radius * 0.45, height * 0.35, 6);
                snowGeom.translate(0, height * 0.82, 0);
                const sMesh = new THREE.Mesh(snowGeom, snowMat);
                sMesh.position.set(x, 0, z);
                mountainGroup.add(sMesh);
            }
        }

        this.scene.add(mountainGroup);
    }

    initFoliageAndWater() {
        const ts = this.tileSize;
        const foliageGroup = new THREE.Group();

        // Materials
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.9 });
        const pineFoliageMat = new THREE.MeshStandardMaterial({ color: 0x1B4332, roughness: 0.8, flatShading: true });
        const deciduousMat = new THREE.MeshStandardMaterial({ color: 0x40916C, roughness: 0.7, flatShading: true });
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.9, flatShading: true });

        // Scenic Lake in a quiet quadrant (e.g. near x: 65, y: 65)
        const lakeGeom = new THREE.CylinderGeometry(ts * 5.5, ts * 6.5, 0.1, 16);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x0284C7,
            roughness: 0.1,
            metalness: 0.85,
            transparent: true,
            opacity: 0.88
        });
        const lake = new THREE.Mesh(lakeGeom, waterMat);
        lake.position.set(ts * 65, 0.04, ts * 65);
        foliageGroup.add(lake);
        this.waterMeshes.push(lake);

        // Plant low-poly trees and decorative rocks in natural groves
        const cx = Math.floor(this.grid.width / 2);
        const cy = Math.floor(this.grid.height / 2);

        for (let y = 3; y < this.grid.height - 3; y += 2) {
            for (let x = 3; x < this.grid.width - 3; x += 2) {
                // Avoid spawn center area and resource patches
                const distFromCenter = Math.hypot(x - cx, y - cy);
                if (distFromCenter < 14) continue;
                if (this.grid.terrain[y][x]) continue;

                // Density noise
                const treeNoise = Math.sin(x * 0.4) * Math.cos(y * 0.4);
                if (treeNoise > 0.45 && Math.random() < 0.45) {
                    const worldX = x * ts + (Math.random() - 0.5) * ts * 0.8;
                    const worldZ = y * ts + (Math.random() - 0.5) * ts * 0.8;

                    // Choose Conifer Pine or Round Tree
                    const isPine = Math.random() > 0.4;
                    const tree = new THREE.Group();

                    // Trunk
                    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.8, 6), trunkMat);
                    trunk.position.y = 0.4;
                    trunk.castShadow = true;
                    tree.add(trunk);

                    if (isPine) {
                        // 3-tiered pine cone
                        for (let t = 0; t < 3; t++) {
                            const cone = new THREE.Mesh(
                                new THREE.ConeGeometry(0.7 - t * 0.18, 0.9, 6),
                                pineFoliageMat
                            );
                            cone.position.y = 0.9 + t * 0.55;
                            cone.castShadow = true;
                            tree.add(cone);
                        }
                    } else {
                        // Deciduous leafy crown
                        const crown = new THREE.Mesh(
                            new THREE.DodecahedronGeometry(0.75, 1),
                            deciduousMat
                        );
                        crown.position.y = 1.3;
                        crown.castShadow = true;
                        tree.add(crown);
                    }

                    const scale = 0.8 + Math.random() * 0.5;
                    tree.scale.set(scale, scale, scale);
                    tree.position.set(worldX, 0, worldZ);
                    foliageGroup.add(tree);
                } else if (Math.random() < 0.04) {
                    // Small decorative boulder
                    const rockGeom = new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.3, 0);
                    const rock = new THREE.Mesh(rockGeom, rockMat);
                    rock.position.set(x * ts, 0.2, y * ts);
                    rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
                    rock.castShadow = true;
                    rock.receiveShadow = true;
                    foliageGroup.add(rock);
                }
            }
        }

        this.scene.add(foliageGroup);
    }

    initClouds() {
        const cloudGroup = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xF8FAFC,
            roughness: 0.4,
            metalness: 0.0,
            flatShading: true,
            transparent: true,
            opacity: 0.92
        });

        const cloudCount = 30;
        const areaSize = this.grid.width * this.tileSize * 1.6;

        for (let i = 0; i < cloudCount; i++) {
            const cluster = new THREE.Group();
            const puffCount = 4 + Math.floor(Math.random() * 5);

            for (let j = 0; j < puffCount; j++) {
                const radius = 6 + Math.random() * 8;
                const puff = new THREE.Mesh(
                    new THREE.DodecahedronGeometry(radius, 1),
                    cloudMat
                );
                puff.position.set(
                    (j - puffCount / 2) * 6 + (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 8
                );
                puff.scale.set(1.4, 0.7, 1.1);
                puff.castShadow = true;
                cluster.add(puff);
            }

            cluster.position.set(
                Math.random() * areaSize - areaSize * 0.3,
                48 + Math.random() * 25,
                Math.random() * areaSize - areaSize * 0.3
            );

            cluster.userData = {
                speed: 1.2 + Math.random() * 2.0,
                bounds: areaSize
            };

            cloudGroup.add(cluster);
            this.clouds.push(cluster);
        }

        this.scene.add(cloudGroup);
    }

    initOreDeposits() {
        const ts = this.tileSize;
        const oreGroup = new THREE.Group();

        // Distinct PBR materials for 3D ore rocks
        const oreMaterials = {
            iron_ore: new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.85, roughness: 0.25, flatShading: true }),
            copper_ore: new THREE.MeshStandardMaterial({ color: 0xEA580C, metalness: 0.8, roughness: 0.3, flatShading: true }),
            coal: new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.1, roughness: 0.95, flatShading: true }),
            stone: new THREE.MeshStandardMaterial({ color: 0xA8A29E, metalness: 0.05, roughness: 0.9, flatShading: true }),
            crystal: new THREE.MeshStandardMaterial({
                color: 0xC084FC,
                emissive: 0x9333EA,
                emissiveIntensity: 0.75,
                metalness: 0.2,
                roughness: 0.1,
                flatShading: true
            })
        };

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const tile = this.grid.terrain[y][x];
                if (!tile || !tile.type) continue;

                const mat = oreMaterials[tile.type] || oreMaterials.stone;
                const rockCluster = new THREE.Group();

                const numRocks = 2 + Math.floor(Math.random() * 3);
                for (let r = 0; r < numRocks; r++) {
                    const radius = (0.28 + Math.random() * 0.36) * ts;
                    const geom = tile.type === 'crystal' 
                        ? new THREE.OctahedronGeometry(radius, 0)
                        : new THREE.DodecahedronGeometry(radius, 0);

                    const rock = new THREE.Mesh(geom, mat);
                    rock.position.set(
                        (Math.random() - 0.5) * ts * 0.6,
                        radius * 0.7,
                        (Math.random() - 0.5) * ts * 0.6
                    );
                    rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
                    rock.scale.set(1.0, 0.8 + Math.random() * 0.6, 1.0);
                    rock.castShadow = true;
                    rock.receiveShadow = true;
                    rockCluster.add(rock);
                }

                rockCluster.position.set(x * ts + ts / 2, 0, y * ts + ts / 2);
                oreGroup.add(rockCluster);
            }
        }

        this.scene.add(oreGroup);
    }

    update(dt) {
        const cx = this.grid.width * this.tileSize / 2;
        const cz = this.grid.height * this.tileSize / 2;

        // Dynamic diurnal sun progression if auto-cycle is selected
        if (this.currentAtmosphere === 'cycle') {
            this.cycleTime += dt * 0.04;
            const sunAngle = this.cycleTime;
            const sinY = Math.sin(sunAngle);
            const cosX = Math.cos(sunAngle);

            const lx = 70 * cosX + 40;
            const ly = Math.max(8, sinY * 110);
            const lz = 70 * sinY;
            this.sunLight.position.set(lx, ly, lz);

            // Position sun sphere to track light direction
            if (this.sunSphere) {
                const sunDist = 220;
                const normLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
                this.sunSphere.position.set(
                    cx + (lx / normLen) * sunDist,
                    (ly / normLen) * sunDist,
                    cz + (lz / normLen) * sunDist
                );
                this.sunSphere.visible = sinY > -0.15;
            }

            if (sinY > 0.25) {
                // Day
                this.scene.background.setHex(0x99D5C9);
                this.scene.fog.color.setHex(0x99D5C9);
                this.sunLight.color.setHex(0xFFFBEA);
                this.sunLight.intensity = 1.45;
                this.hemiLight.color.setHex(0xD8F3DC);
                this.hemiLight.groundColor.setHex(0x2D6A4F);
                if (this.sunMat) this.sunMat.color.setHex(0xFFFDE7);
                if (this.stars) this.stars.material.opacity = 0.0;
                if (this.aurora) this.aurora.children.forEach(c => c.material.opacity = 0.0);
            } else if (sinY > -0.05) {
                // Sunset / Sunrise
                this.scene.background.setHex(0xF4845F);
                this.scene.fog.color.setHex(0xF4845F);
                this.sunLight.color.setHex(0xFFA552);
                this.sunLight.intensity = 1.15;
                this.hemiLight.color.setHex(0xFFD6BA);
                this.hemiLight.groundColor.setHex(0x5E503F);
                if (this.sunMat) this.sunMat.color.setHex(0xFF6622);
                if (this.stars) this.stars.material.opacity = Math.max(0, (-sinY / 0.05) * 0.4);
                if (this.aurora) this.aurora.children.forEach(c => c.material.opacity = 0.0);
            } else {
                // Night
                this.scene.background.setHex(0x0B0F19);
                this.scene.fog.color.setHex(0x0B0F19);
                this.sunLight.color.setHex(0x38BDF8);
                this.sunLight.intensity = 0.45;
                this.hemiLight.color.setHex(0x1E293B);
                this.hemiLight.groundColor.setHex(0x020617);
                if (this.stars) this.stars.material.opacity = 0.82;
                // Pulsing aurora
                if (this.aurora) {
                    const auroraPulse = 0.25 + Math.sin(performance.now() * 0.0008) * 0.12;
                    this.aurora.children.forEach((c, i) => {
                        c.material.opacity = auroraPulse + i * 0.04;
                    });
                }
            }
        }

        // Update static sun sphere position
        if (this.sunSphere && this.currentAtmosphere !== 'cycle') {
            const lp = this.sunLight.position;
            const sunDist = 220;
            const normLen = Math.sqrt(lp.x * lp.x + lp.y * lp.y + lp.z * lp.z);
            if (normLen > 0 && this.sunSphere.visible) {
                this.sunSphere.position.set(
                    cx + (lp.x / normLen) * sunDist,
                    (lp.y / normLen) * sunDist,
                    cz + (lp.z / normLen) * sunDist
                );
            }
        }

        // Drift clouds across the sky
        this.clouds.forEach(c => {
            c.position.x += c.userData.speed * dt;
            if (c.position.x > c.userData.bounds * 0.9) {
                c.position.x = -c.userData.bounds * 0.4;
            }
        });

        // Subtle water ripple shimmer
        this.waterMeshes.forEach(w => {
            w.rotation.y += 0.02 * dt;
        });
    }
}
