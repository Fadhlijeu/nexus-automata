/**
 * Main Application Orchestrator & 3D Input Handling
 * Nexus Automata (Three.js 3D Engine)
 */

import { WorldGrid } from './grid.js?v=31';
import { SimulationEngine } from './simulation.js?v=31';
import { Renderer3D } from './renderer3d.js?v=31';
import { UIController } from './ui.js?v=31';
import { DIRECTIONS, BUILDINGS, TECH_TREE } from './data.js?v=31';
import { sound } from './audio.js?v=31';

class GameApp {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.canvasContainer = document.getElementById('game-canvas-container');

        // Core Systems
        this.grid = new WorldGrid(80, 80);
        this.sim = new SimulationEngine(this.grid, (evt, data) => this.handleSimEvent(evt, data));
        this.renderer = new Renderer3D(this.canvas, this.grid, this.sim);
        this.ui = new UIController(this.grid, this.sim, this.renderer);

        this.buildDirection = DIRECTIONS.NORTH;
        this.isOrbiting = false;
        this.isPanning = false;
        this.isCinematicMode = false;
        this.mousePos = { x: 0, y: 0 };
        this.lastDragTile = null;
        this.isPlacingDrag = false;

        this.keysDown = {};
        this.lastTime = performance.now();

        this.initInputs();
        this.initStarterFactory();

        // Load saved state or default
        this.ui.loadGame();

        // 30s Autosave
        setInterval(() => this.ui.saveGame(), 30000);

        // Start 60 FPS Render Loop
        requestAnimationFrame((t) => this.loop(t));
    }

    handleSimEvent(evt, data) {
        if (evt === 'tech_unlocked') {
            sound.playResearchUnlock();
            this.ui.showToast('Research Complete', `Technology '${data.name}' researched! New production unlocked.`, 'success');
            this.ui.renderDock();
            this.ui.renderTechTree();
        } else if (evt === 'milestone_complete') {
            sound.playRocketLaunch();
            this.ui.showToast('Orbital Milestone Achieved!', `Phase complete: ${data.title}! Cargo pod launched into orbit!`, 'success');
            if (this.renderer && this.renderer.triggerSpaceElevatorLaunch) {
                this.renderer.triggerSpaceElevatorLaunch();
            }
        }
    }

    initStarterFactory() {
        if (this.grid.buildingList.length > 0) return;

        const cx = Math.floor(this.grid.width / 2);
        const cy = Math.floor(this.grid.height / 2);

        // Locate nearest iron vein
        let ironTile = null;
        for (let y = cy - 8; y < cy + 8; y++) {
            for (let x = cx - 8; x < cx + 8; x++) {
                const t = this.grid.getTile(x, y);
                if (t && t.type === 'iron_ore') {
                    ironTile = { x, y };
                    break;
                }
            }
            if (ironTile) break;
        }

        if (ironTile) {
            // Place Miner
            this.grid.placeBuilding('miner', ironTile.x, ironTile.y, DIRECTIONS.EAST);

            // Belts heading East
            this.grid.placeBuilding('belt', ironTile.x + 1, ironTile.y, DIRECTIONS.EAST);
            this.grid.placeBuilding('belt', ironTile.x + 2, ironTile.y, DIRECTIONS.EAST);

            // Smelter
            const smelter = this.grid.placeBuilding('smelter', ironTile.x + 3, ironTile.y, DIRECTIONS.EAST);
            if (smelter) smelter.recipe = 'smelt_iron';

            // Output belts
            this.grid.placeBuilding('belt', ironTile.x + 5, ironTile.y, DIRECTIONS.EAST);
            this.grid.placeBuilding('belt', ironTile.x + 6, ironTile.y, DIRECTIONS.EAST);

            // Storage Silo
            this.grid.placeBuilding('storage_silo', ironTile.x + 7, ironTile.y, DIRECTIONS.EAST);

            // Power distribution
            this.grid.placeBuilding('power_pole', ironTile.x + 3, ironTile.y - 3, DIRECTIONS.NORTH);
            this.grid.placeBuilding('solar_panel', ironTile.x + 1, ironTile.y - 3, DIRECTIONS.NORTH);
        }
    }

    loadMegafactoryDemo() {
        this.grid.buildings.clear();
        this.grid.buildingList = [];

        // Unlock all tech & buildings for demo showcase
        TECH_TREE.forEach(t => t.unlocked = true);
        Object.values(BUILDINGS).forEach(b => b.unlocked = true);

        const cx = Math.floor(this.grid.width / 2);
        const cy = Math.floor(this.grid.height / 2);

        // Helper to place belt with initial flowing items
        const placeBeltWithItems = (type, x, y, dir, itemType1 = null, itemType2 = null) => {
            const belt = this.grid.placeBuilding(type, x, y, dir);
            if (belt) {
                if (itemType1) belt.items.push({ type: itemType1, pos: 0.25 });
                if (itemType2) belt.items.push({ type: itemType2, pos: 0.75 });
            }
            return belt;
        };

        // 1. Locate natural ore patches near spawn
        let ironSpot = null, copperSpot = null, coalSpot = null;
        for (let y = cy - 14; y < cy + 14; y++) {
            for (let x = cx - 14; x < cx + 14; x++) {
                const t = this.grid.getTile(x, y);
                if (t) {
                    if (!ironSpot && t.type === 'iron_ore') ironSpot = { x, y };
                    if (!copperSpot && t.type === 'copper_ore') copperSpot = { x, y };
                    if (!coalSpot && t.type === 'coal') coalSpot = { x, y };
                }
            }
        }
        if (!ironSpot) ironSpot = { x: cx - 6, y: cy - 4 };
        if (!copperSpot) copperSpot = { x: cx + 6, y: cy + 5 };
        if (!coalSpot) coalSpot = { x: cx - 10, y: cy - 10 };

        // 2. Active Mining Outposts
        this.grid.placeBuilding('miner', ironSpot.x, ironSpot.y, DIRECTIONS.EAST);
        placeBeltWithItems('fast_belt', ironSpot.x + 1, ironSpot.y, DIRECTIONS.EAST, 'iron_ore', 'iron_ore');
        placeBeltWithItems('fast_belt', ironSpot.x + 2, ironSpot.y, DIRECTIONS.EAST, 'iron_ore', 'iron_ore');

        this.grid.placeBuilding('miner', copperSpot.x, copperSpot.y, DIRECTIONS.WEST);
        placeBeltWithItems('fast_belt', copperSpot.x - 1, copperSpot.y, DIRECTIONS.WEST, 'copper_ore', 'copper_ore');
        placeBeltWithItems('fast_belt', copperSpot.x - 2, copperSpot.y, DIRECTIONS.WEST, 'copper_ore', 'copper_ore');

        this.grid.placeBuilding('miner', coalSpot.x, coalSpot.y, DIRECTIONS.EAST);
        placeBeltWithItems('fast_belt', coalSpot.x + 1, coalSpot.y, DIRECTIONS.EAST, 'coal', 'coal');
        placeBeltWithItems('fast_belt', coalSpot.x + 2, coalSpot.y, DIRECTIONS.EAST, 'coal', 'coal');

        // 3. Parallel Smelters Complex
        const s1 = this.grid.placeBuilding('smelter', cx - 6, cy - 7, DIRECTIONS.EAST);
        if (s1) s1.recipe = 'smelt_iron';
        const s2 = this.grid.placeBuilding('smelter', cx - 6, cy - 4, DIRECTIONS.EAST);
        if (s2) s2.recipe = 'smelt_iron';
        const s3 = this.grid.placeBuilding('smelter', cx - 6, cy - 1, DIRECTIONS.EAST);
        if (s3) s3.recipe = 'smelt_copper';
        const s4 = this.grid.placeBuilding('smelter', cx - 6, cy + 2, DIRECTIONS.EAST);
        if (s4) s4.recipe = 'smelt_copper';

        // Smelter input feeder tracks
        for (let dy of [-7, -4]) {
            placeBeltWithItems('fast_belt', cx - 8, cy + dy, DIRECTIONS.EAST, 'iron_ore');
            placeBeltWithItems('fast_belt', cx - 7, cy + dy, DIRECTIONS.EAST, 'iron_ore');
        }
        for (let dy of [-1, 2]) {
            placeBeltWithItems('fast_belt', cx - 8, cy + dy, DIRECTIONS.EAST, 'copper_ore');
            placeBeltWithItems('fast_belt', cx - 7, cy + dy, DIRECTIONS.EAST, 'copper_ore');
        }

        // Smelter outputs to Logistics Spine
        for (let dy of [-7, -4]) {
            placeBeltWithItems('fast_belt', cx - 4, cy + dy, DIRECTIONS.EAST, 'iron_ingot');
            placeBeltWithItems('fast_belt', cx - 3, cy + dy, DIRECTIONS.EAST, 'iron_ingot');
            placeBeltWithItems('fast_belt', cx - 2, cy + dy, DIRECTIONS.EAST, 'iron_ingot');
        }
        for (let dy of [-1, 2]) {
            placeBeltWithItems('fast_belt', cx - 4, cy + dy, DIRECTIONS.EAST, 'copper_ingot');
            placeBeltWithItems('fast_belt', cx - 3, cy + dy, DIRECTIONS.EAST, 'copper_ingot');
            placeBeltWithItems('fast_belt', cx - 2, cy + dy, DIRECTIONS.EAST, 'copper_ingot');
        }

        // 4. Logistics Routing (Splitters, Mergers, Express Bus)
        this.grid.placeBuilding('merger', cx - 1, cy - 7, DIRECTIONS.EAST);
        this.grid.placeBuilding('merger', cx - 1, cy - 1, DIRECTIONS.EAST);
        this.grid.placeBuilding('splitter', cx, cy - 7, DIRECTIONS.EAST);
        this.grid.placeBuilding('splitter', cx, cy - 1, DIRECTIONS.EAST);

        // Express conveyor main bus lanes
        for (let x = cx + 1; x <= cx + 4; x++) {
            placeBeltWithItems('fast_belt', x, cy - 8, DIRECTIONS.EAST, 'iron_ingot');
            placeBeltWithItems('fast_belt', x, cy - 5, DIRECTIONS.EAST, 'copper_ingot');
            placeBeltWithItems('fast_belt', x, cy - 2, DIRECTIONS.EAST, 'iron_gear');
            placeBeltWithItems('fast_belt', x, cy + 1, DIRECTIONS.EAST, 'copper_wire');
        }

        // 5. Assembler Manufacturing Array
        const a1 = this.grid.placeBuilding('assembler', cx + 5, cy - 8, DIRECTIONS.EAST);
        if (a1) a1.recipe = 'craft_gear';

        const a2 = this.grid.placeBuilding('assembler', cx + 5, cy - 5, DIRECTIONS.EAST);
        if (a2) a2.recipe = 'craft_wire';

        const a3 = this.grid.placeBuilding('assembler', cx + 5, cy - 2, DIRECTIONS.EAST);
        if (a3) a3.recipe = 'craft_circuit';

        const a4 = this.grid.placeBuilding('assembler', cx + 5, cy + 1, DIRECTIONS.EAST);
        if (a4) a4.recipe = 'craft_science_1';

        // Assembler Output Belts
        placeBeltWithItems('fast_belt', cx + 7, cy - 8, DIRECTIONS.EAST, 'iron_gear', 'iron_gear');
        placeBeltWithItems('fast_belt', cx + 8, cy - 8, DIRECTIONS.EAST, 'iron_gear');
        this.grid.placeBuilding('storage_silo', cx + 9, cy - 8, DIRECTIONS.EAST);

        placeBeltWithItems('fast_belt', cx + 7, cy + 1, DIRECTIONS.EAST, 'science_pack_1', 'science_pack_1');
        placeBeltWithItems('fast_belt', cx + 8, cy + 1, DIRECTIONS.EAST, 'science_pack_1');

        // 6. Dual Advanced Research Labs
        this.grid.placeBuilding('research_lab', cx + 9, cy + 1, DIRECTIONS.EAST);
        this.grid.placeBuilding('research_lab', cx + 9, cy + 4, DIRECTIONS.EAST);
        placeBeltWithItems('fast_belt', cx + 9, cy + 3, DIRECTIONS.SOUTH, 'science_pack_1');

        // 7. Space Elevator Gateway
        this.grid.placeBuilding('space_elevator', cx + 13, cy - 4, DIRECTIONS.NORTH);
        placeBeltWithItems('fast_belt', cx + 11, cy - 3, DIRECTIONS.EAST, 'electronic_circuit');
        placeBeltWithItems('fast_belt', cx + 12, cy - 3, DIRECTIONS.EAST, 'electronic_circuit');

        // 8. Power Infrastructure: Coal Generators & Solar Array
        const cg1 = this.grid.placeBuilding('coal_generator', cx - 6, cy + 6, DIRECTIONS.NORTH);
        const cg2 = this.grid.placeBuilding('coal_generator', cx - 3, cy + 6, DIRECTIONS.NORTH);
        if (cg1) cg1.inventory.inputs['coal'] = 30;
        if (cg2) cg2.inventory.inputs['coal'] = 30;

        this.grid.placeBuilding('solar_panel', cx - 6, cy + 9, DIRECTIONS.NORTH);
        this.grid.placeBuilding('solar_panel', cx - 3, cy + 9, DIRECTIONS.NORTH);
        this.grid.placeBuilding('solar_panel', cx, cy + 9, DIRECTIONS.NORTH);
        this.grid.placeBuilding('solar_panel', cx + 3, cy + 9, DIRECTIONS.NORTH);

        // Power Poles with Catenary Grid
        this.grid.placeBuilding('power_pole', cx - 5, cy - 4, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx, cy - 4, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx + 5, cy - 4, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx + 10, cy - 4, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx - 5, cy + 3, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx, cy + 3, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx + 5, cy + 3, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx + 10, cy + 3, DIRECTIONS.NORTH);
        this.grid.placeBuilding('power_pole', cx, cy - 10, DIRECTIONS.NORTH);

        // 9. Chemical Refining Complex & Polymer Synthesis
        const chem1 = this.grid.placeBuilding('chemical_plant', cx - 2, cy - 13, DIRECTIONS.NORTH);
        if (chem1) {
            chem1.recipe = 'refine_oil';
            chem1.inventory.inputs['coal'] = 30;
            chem1.inventory.inputs['stone'] = 20;
        }

        const chem2 = this.grid.placeBuilding('chemical_plant', cx + 2, cy - 13, DIRECTIONS.NORTH);
        if (chem2) {
            chem2.recipe = 'craft_battery';
            chem2.inventory.inputs['copper_ingot'] = 25;
            chem2.inventory.inputs['plastic'] = 20;
        }

        // Chemical output feeder & Conveyor Bridge Overpass
        placeBeltWithItems('fast_belt', cx + 1, cy - 10, DIRECTIONS.EAST, 'plastic', 'plastic');
        this.grid.placeBuilding('conveyor_bridge', cx + 2, cy - 10, DIRECTIONS.EAST);
        placeBeltWithItems('fast_belt', cx + 3, cy - 10, DIRECTIONS.EAST, 'plastic');

        // 10. Robotic Inserters (Articulated arm picking & placing)
        this.grid.placeBuilding('inserter', cx + 4, cy - 2, DIRECTIONS.EAST);
        this.grid.placeBuilding('fast_inserter', cx + 4, cy + 1, DIRECTIONS.EAST);

        // Pre-buffer ingredients in all machines
        this.grid.buildingList.forEach(b => {
            if (b.type === 'smelter') {
                b.inventory.inputs['iron_ore'] = 24;
                b.inventory.inputs['copper_ore'] = 24;
            } else if (b.type === 'assembler') {
                b.inventory.inputs['iron_ingot'] = 20;
                b.inventory.inputs['copper_ingot'] = 20;
                b.inventory.inputs['copper_wire'] = 25;
                b.inventory.inputs['iron_gear'] = 20;
                b.inventory.inputs['circuit'] = 15;
            } else if (b.type === 'coal_generator') {
                b.inventory.inputs['coal'] = 30;
                b.fuelTime = 90.0;
            } else if (b.type === 'research_lab') {
                b.inventory.inputs['science_pack_1'] = 15;
            } else if (b.type === 'chemical_plant') {
                if (b.recipe === 'refine_oil') {
                    b.inventory.inputs['coal'] = 30;
                    b.inventory.inputs['stone'] = 20;
                } else if (b.recipe === 'craft_battery') {
                    b.inventory.inputs['copper_ingot'] = 25;
                    b.inventory.inputs['plastic'] = 20;
                }
            }
        });

        // Unlock all tech & buildings for sandbox showcase
        TECH_TREE.forEach(t => t.unlocked = true);
        Object.values(BUILDINGS).forEach(b => b.unlocked = true);

        // Set active tech
        this.sim.setActiveTech('space_exploration');

        // Breathtaking panoramic camera view
        this.renderer.camTarget.x = (cx + 3) * this.renderer.tileSize;
        this.renderer.camTarget.z = (cy - 1) * this.renderer.tileSize;
        this.renderer.camDistance = 78;
        this.renderer.camPitch = 0.58;
        this.renderer.camYaw = 0.72;
        this.renderer.updateCameraPosition();

        this.ui.renderDock();
        this.ui.renderTechTree();
    }

    handleSimEvent(evt, data) {
        if (evt === 'tech_unlocked') {
            this.ui.showToast('Research Complete', `${data.name} is now online. New industrial units unlocked.`, 'success');
            
            if (data.unlocks) {
                data.unlocks.forEach(bId => {
                    if (BUILDINGS[bId]) BUILDINGS[bId].unlocked = true;
                });
            }

            this.ui.renderDock();
            this.ui.renderTechTree();
        } else if (evt === 'milestone_complete') {
            this.ui.showToast('Milestone Achieved', `${data.title} fulfilled! Industrial expansion authorized.`, 'success');
        }
    }

    initInputs() {
        window.addEventListener('click', () => sound.init(), { once: true });
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());

        // Mouse Down
        this.canvas.addEventListener('mousedown', (e) => {
            sound.init();

            // Right Click (2): 3D Orbit / Rotate View
            if (e.button === 2) {
                this.isOrbiting = true;
                this.mousePos = { x: e.clientX, y: e.clientY };
                this.canvasContainer.classList.add('panning');
                return;
            }

            // Middle Click (1): Pan
            if (e.button === 1) {
                this.isPanning = true;
                this.mousePos = { x: e.clientX, y: e.clientY };
                this.canvasContainer.classList.add('panning');
                return;
            }

            // Left Click (0): Build / Select / Drag
            if (e.button === 0) {
                const { tileX, tileY } = this.renderer.screenToTile(e.clientX, e.clientY);
                this.handleTileClick(tileX, tileY);
                this.isPlacingDrag = true;
                this.lastDragTile = `${tileX},${tileY}`;
            }
        });

        // Mouse Move
        window.addEventListener('mousemove', (e) => {
            if (this.isOrbiting) {
                const dx = e.clientX - this.mousePos.x;
                const dy = e.clientY - this.mousePos.y;
                this.mousePos = { x: e.clientX, y: e.clientY };

                this.renderer.camYaw -= dx * 0.006;
                this.renderer.camPitch = Math.max(0.25, Math.min(1.4, this.renderer.camPitch + dy * 0.006));
                this.renderer.updateCameraPosition();
                return;
            }

            if (this.isPanning) {
                const dx = (e.clientX - this.mousePos.x) * 0.15;
                const dy = (e.clientY - this.mousePos.y) * 0.15;
                this.mousePos = { x: e.clientX, y: e.clientY };

                const sinYaw = Math.sin(this.renderer.camYaw);
                const cosYaw = Math.cos(this.renderer.camYaw);

                this.renderer.camTarget.x -= (dx * cosYaw + dy * sinYaw);
                this.renderer.camTarget.z -= (-dx * sinYaw + dy * cosYaw);
                this.renderer.updateCameraPosition();
                return;
            }

            // Raycast tile
            const { tileX, tileY } = this.renderer.screenToTile(e.clientX, e.clientY);
            this.renderer.setGhost(this.ui.selectedTool, tileX, tileY, this.buildDirection);

            // Drag-placing belts
            if (this.isPlacingDrag && (this.ui.selectedTool === 'belt' || this.ui.selectedTool === 'fast_belt')) {
                const tileKey = `${tileX},${tileY}`;
                if (tileKey !== this.lastDragTile) {
                    this.lastDragTile = tileKey;
                    this.handleTileClick(tileX, tileY);
                }
            }
        });

        // Mouse Up
        window.addEventListener('mouseup', (e) => {
            if (e.button === 2) {
                this.isOrbiting = false;
                this.canvasContainer.classList.remove('panning');
            }
            if (e.button === 1) {
                this.isPanning = false;
                this.canvasContainer.classList.remove('panning');
            }
            if (e.button === 0) {
                this.isPlacingDrag = false;
                this.lastDragTile = null;
            }
        });

        // Mouse Wheel: 3D Zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY * 0.06;
            this.renderer.camDistance = Math.max(16, Math.min(180, this.renderer.camDistance + zoomDelta));
            this.renderer.updateCameraPosition();
        }, { passive: false });

        // Keyboard Controls
        window.addEventListener('keydown', (e) => {
            this.keysDown[e.key.toLowerCase()] = true;

            // R: Rotate 3D Building Orientation
            if (e.key.toLowerCase() === 'r') {
                sound.playRotate();
                this.buildDirection = (this.buildDirection + 1) % 4;
                const hit = this.renderer.screenToTile(window.innerWidth / 2, window.innerHeight / 2);
                this.renderer.setGhost(this.ui.selectedTool, hit.tileX, hit.tileY, this.buildDirection);
            }

            // Q: Pipet
            if (e.key.toLowerCase() === 'q') {
                const hit = this.renderer.screenToTile(window.innerWidth / 2, window.innerHeight / 2);
                const hovered = this.grid.getBuilding(hit.tileX, hit.tileY);
                if (hovered) {
                    sound.playClick();
                    this.ui.selectedTool = hovered.type;
                    this.ui.renderDock();
                }
            }

            // C: Cinematic Flyby Camera
            if (e.key.toLowerCase() === 'c') {
                sound.playClick();
                this.toggleCinematicMode();
            }

            // E: Tech Tree
            if (e.key.toLowerCase() === 'e') {
                sound.playClick();
                this.ui.openModal('tech-modal');
                this.ui.renderTechTree();
            }

            // H: Toggle Minimal HUD
            if (e.key.toLowerCase() === 'h') {
                this.ui.toggleMinimalHUD();
            }

            // Tab: Cycle Category Tabs
            if (e.key === 'Tab') {
                e.preventDefault();
                const categories = ['logistics', 'production', 'power', 'special', 'tools'];
                let curIdx = categories.indexOf(this.ui.selectedCategory);
                curIdx = (curIdx + 1) % categories.length;
                this.ui.selectedCategory = categories[curIdx];
                document.querySelectorAll('.dock-pill-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.category === this.ui.selectedCategory);
                });
                this.ui.renderDock();
                sound.playClick();
            }

            // Space: Pause simulation
            if (e.code === 'Space') {
                e.preventDefault();
                const newSpeed = this.sim.gameSpeed > 0 ? 0 : 1;
                this.sim.setGameSpeed(newSpeed);
                this.ui.showToast('Simulation Clock', newSpeed === 0 ? 'Simulation Paused' : 'Simulation Resumed', 'info');
            }

            // 1-9: Slot selection
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key, 10) - 1;
                const slots = document.querySelectorAll('.dock-slot');
                if (slots[index]) {
                    slots[index].click();
                }
            }

            // Delete: Demolish tool
            if (e.key === 'Delete' || e.key === 'Backspace') {
                sound.playClick();
                this.ui.selectedTool = 'demolish';
                this.ui.renderDock();
            }

            // Escape: Cancel tool
            if (e.key === 'Escape') {
                this.ui.closeAllModals();
                this.ui.selectedTool = 'select';
                this.ui.renderDock();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keysDown[e.key.toLowerCase()] = false;
        });
    }

    handleTileClick(x, y) {
        const tool = this.ui.selectedTool;

        if (tool === 'select') {
            const building = this.grid.getBuilding(x, y);
            if (building) {
                sound.playClick();
                this.ui.openInspector(building);
            }
            return;
        }

        if (tool === 'demolish') {
            const removed = this.grid.removeBuilding(x, y);
            if (removed) {
                sound.playDemolish();
            }
            return;
        }

        if (this.grid.canPlace(tool, x, y, this.buildDirection)) {
            const created = this.grid.placeBuilding(tool, x, y, this.buildDirection);
            if (created) {
                sound.playPlace();
                this.renderer.setGhost(tool, x, y, this.buildDirection);
            }
        }
    }

    toggleCinematicMode(forcedState = null) {
        this.isCinematicMode = forcedState !== null ? forcedState : !this.isCinematicMode;
        const pill = document.getElementById('cinematic-hud-pill');
        const btn = document.getElementById('hud-cinema-btn');
        if (pill) pill.style.display = this.isCinematicMode ? 'flex' : 'none';
        if (btn) btn.classList.toggle('active', this.isCinematicMode);
        this.ui.showToast(
            'Camera Mode',
            this.isCinematicMode ? 'Cinematic Flyby Active (Press C or WASD to exit)' : 'Manual RTS Camera Control Resumed',
            'info'
        );
    }

    updateCameraMovement(dt) {
        if (this.isCinematicMode) {
            this.renderer.camYaw += 0.08 * dt;
            this.renderer.camPitch = 0.58 + Math.sin(performance.now() * 0.0003) * 0.05;
            this.renderer.updateCameraPosition();
        }

        const moveSpeed = 45 * dt * (this.renderer.camDistance / 60);

        const sinYaw = Math.sin(this.renderer.camYaw);
        const cosYaw = Math.cos(this.renderer.camYaw);

        let dx = 0;
        let dz = 0;

        if (this.keysDown['w'] || this.keysDown['arrowup']) {
            dx -= sinYaw;
            dz -= cosYaw;
        }
        if (this.keysDown['s'] || this.keysDown['arrowdown']) {
            dx += sinYaw;
            dz += cosYaw;
        }
        if (this.keysDown['a'] || this.keysDown['arrowleft']) {
            dx -= cosYaw;
            dz += sinYaw;
        }
        if (this.keysDown['d'] || this.keysDown['arrowright']) {
            dx += cosYaw;
            dz -= sinYaw;
        }

        if (dx !== 0 || dz !== 0) {
            if (this.isCinematicMode) {
                this.toggleCinematicMode(false);
            }
            const len = Math.hypot(dx, dz);
            this.renderer.camTarget.x += (dx / len) * moveSpeed;
            this.renderer.camTarget.z += (dz / len) * moveSpeed;
            this.renderer.updateCameraPosition();
        }
    }

    loop(timestamp) {
        requestAnimationFrame((t) => this.loop(t));

        const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        try {
            // Camera keyboard pan
            this.updateCameraMovement(dt);

            // Discrete simulation tick
            this.sim.update(dt);

            // Three.js 3D Render
            this.renderer.render(dt);

            // UI Telemetry
            this.ui.updateHUD();
        } catch (err) {
            console.error("Critical error in GameApp loop:", err);
            window.lastLoopError = err ? (err.message + "\n" + err.stack) : "Unknown error";
        }
    }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameApp();
});
