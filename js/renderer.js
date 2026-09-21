/**
 * High-Performance HTML5 Canvas Renderer (60 FPS)
 * Nexus Automata
 */

import { DIR_OFFSET, DIRECTIONS, ITEMS, BUILDINGS } from './data.js';

export class CanvasRenderer {
    constructor(canvas, worldGrid, simulation) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.grid = worldGrid;
        this.sim = simulation;

        // Viewport Camera
        this.camera = {
            x: (worldGrid.width * worldGrid.tileSize) / 2,
            y: (worldGrid.height * worldGrid.tileSize) / 2,
            zoom: 1.0,
            targetZoom: 1.0
        };

        // Ghost Placement State
        this.ghost = {
            type: null,
            x: 0,
            y: 0,
            direction: DIRECTIONS.NORTH,
            valid: false
        };

        // Visual Particles
        this.particles = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    setGhost(type, x, y, direction) {
        this.ghost.type = type;
        this.ghost.x = x;
        this.ghost.y = y;
        this.ghost.direction = direction;
        this.ghost.valid = type ? this.grid.canPlace(type, x, y, direction) : false;
    }

    worldToScreen(worldX, worldY) {
        const screenX = (worldX - this.camera.x) * this.camera.zoom + this.width / 2;
        const screenY = (worldY - this.camera.y) * this.camera.zoom + this.height / 2;
        return { x: screenX, y: screenY };
    }

    screenToWorld(screenX, screenY) {
        const worldX = (screenX - this.width / 2) / this.camera.zoom + this.camera.x;
        const worldY = (screenY - this.height / 2) / this.camera.zoom + this.camera.y;
        return { x: worldX, y: worldY };
    }

    screenToTile(screenX, screenY) {
        const world = this.screenToWorld(screenX, screenY);
        const tileX = Math.floor(world.x / this.grid.tileSize);
        const tileY = Math.floor(world.y / this.grid.tileSize);
        return { tileX, tileY };
    }

    addSpark(worldX, worldY, color = '#22D3EE') {
        this.particles.push({
            x: worldX,
            y: worldY,
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() - 0.5) * 40 - 20,
            life: 0.6,
            maxLife: 0.6,
            color
        });
    }

    render(dt) {
        const ctx = this.ctx;
        const tileSize = this.grid.tileSize;
        const zoom = this.camera.zoom;

        // Clear Screen with deep obsidian void
        ctx.fillStyle = '#08080C';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.save();
        // Camera Transform
        ctx.translate(this.width / 2, this.height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        // Visible tile bounds
        const startTileX = Math.max(0, Math.floor((this.camera.x - (this.width / 2) / zoom) / tileSize));
        const endTileX = Math.min(this.grid.width - 1, Math.ceil((this.camera.x + (this.width / 2) / zoom) / tileSize));
        const startTileY = Math.max(0, Math.floor((this.camera.y - (this.height / 2) / zoom) / tileSize));
        const endTileY = Math.min(this.grid.height - 1, Math.ceil((this.camera.y + (this.height / 2) / zoom) / tileSize));

        // 1. Render Terrain Grid & Resources
        this.renderTerrain(ctx, startTileX, endTileX, startTileY, endTileY, tileSize);

        // 2. Render Logistics (Belts & Items)
        this.renderLogistics(ctx, tileSize, dt);

        // 3. Render Multi-tile Buildings & Machines
        this.renderBuildings(ctx, tileSize, dt);

        // 4. Render Power Lines
        this.renderPowerCables(ctx, tileSize);

        // 5. Render Particles
        this.renderParticles(ctx, dt);

        // 6. Render Ghost Placement Preview
        if (this.ghost.type) {
            this.renderGhost(ctx, tileSize);
        }

        ctx.restore();
    }

    renderTerrain(ctx, startX, endX, startY, endY, tileSize) {
        // Grid lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';

        for (let x = startX; x <= endX; x++) {
            ctx.beginPath();
            ctx.moveTo(x * tileSize, startY * tileSize);
            ctx.lineTo(x * tileSize, (endY + 1) * tileSize);
            ctx.stroke();
        }
        for (let y = startY; y <= endY; y++) {
            ctx.beginPath();
            ctx.moveTo(startX * tileSize, y * tileSize);
            ctx.lineTo((endX + 1) * tileSize, y * tileSize);
            ctx.stroke();
        }

        // Render Resource Deposits
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tile = this.grid.terrain[y][x];
                if (!tile) continue;

                const px = x * tileSize;
                const py = y * tileSize;

                ctx.save();
                ctx.translate(px + tileSize / 2, py + tileSize / 2);

                if (tile.type === 'iron_ore') {
                    ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
                    ctx.fillRect(-tileSize * 0.42, -tileSize * 0.42, tileSize * 0.84, tileSize * 0.84);
                    // Shimmer crystal shards
                    ctx.fillStyle = '#CBD5E1';
                    ctx.beginPath();
                    ctx.arc(-6, -6, 5, 0, Math.PI * 2);
                    ctx.arc(7, 5, 6, 0, Math.PI * 2);
                    ctx.arc(-4, 8, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile.type === 'copper_ore') {
                    ctx.fillStyle = 'rgba(251, 146, 60, 0.22)';
                    ctx.fillRect(-tileSize * 0.42, -tileSize * 0.42, tileSize * 0.84, tileSize * 0.84);
                    ctx.fillStyle = '#FB923C';
                    ctx.beginPath();
                    ctx.arc(-5, 6, 6, 0, Math.PI * 2);
                    ctx.arc(6, -5, 5, 0, Math.PI * 2);
                    ctx.arc(3, 7, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile.type === 'coal') {
                    ctx.fillStyle = 'rgba(51, 65, 85, 0.35)';
                    ctx.fillRect(-tileSize * 0.42, -tileSize * 0.42, tileSize * 0.84, tileSize * 0.84);
                    ctx.fillStyle = '#1E293B';
                    ctx.beginPath();
                    ctx.arc(0, 0, 9, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#475569';
                    ctx.beginPath();
                    ctx.arc(-5, -4, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile.type === 'stone') {
                    ctx.fillStyle = 'rgba(168, 162, 158, 0.25)';
                    ctx.fillRect(-tileSize * 0.42, -tileSize * 0.42, tileSize * 0.84, tileSize * 0.84);
                    ctx.fillStyle = '#A8A29E';
                    ctx.beginPath();
                    ctx.arc(-4, -4, 6, 0, Math.PI * 2);
                    ctx.arc(5, 5, 7, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile.type === 'crystal') {
                    ctx.fillStyle = 'rgba(192, 132, 252, 0.28)';
                    ctx.fillRect(-tileSize * 0.42, -tileSize * 0.42, tileSize * 0.84, tileSize * 0.84);
                    // Glowing crystal prism
                    ctx.fillStyle = '#C084FC';
                    ctx.beginPath();
                    ctx.moveTo(0, -9);
                    ctx.lineTo(8, 6);
                    ctx.lineTo(-8, 6);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            }
        }
    }

    renderLogistics(ctx, tileSize, dt) {
        const belts = this.grid.buildingList.filter(b => 
            b.type === 'belt' || b.type === 'fast_belt' || b.type === 'splitter' || b.type === 'merger' || b.type === 'underground_belt'
        );

        belts.forEach(belt => {
            const px = belt.x * tileSize;
            const py = belt.y * tileSize;
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(belt.direction * Math.PI / 2);

            const isFast = belt.type === 'fast_belt';
            const beltBg = isFast ? '#0A2540' : '#141822';
            const arrowColor = isFast ? '#22D3EE' : '#64748B';

            // Belt Bed
            ctx.fillStyle = beltBg;
            ctx.fillRect(-tileSize / 2 + 2, -tileSize / 2 + 2, tileSize - 4, tileSize - 4);
            ctx.strokeStyle = isFast ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-tileSize / 2 + 2, -tileSize / 2 + 2, tileSize - 4, tileSize - 4);

            // Animated Directional Chevrons
            const animOffset = (belt.animationTime * 18) % 16;
            ctx.strokeStyle = arrowColor;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';

            for (let y = -tileSize / 2 + animOffset - 16; y < tileSize / 2; y += 16) {
                if (y > -tileSize / 2 + 6 && y < tileSize / 2 - 6) {
                    ctx.beginPath();
                    ctx.moveTo(-9, y + 4);
                    ctx.lineTo(0, y - 4);
                    ctx.lineTo(9, y + 4);
                    ctx.stroke();
                }
            }

            // Splitter / Merger / Tunnel Special overlays
            if (belt.type === 'splitter') {
                ctx.fillStyle = '#A855F7';
                ctx.fillRect(-tileSize / 2 + 4, -4, tileSize - 8, 8);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '8px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('SPLIT', 0, 3);
            } else if (belt.type === 'merger') {
                ctx.fillStyle = '#F59E0B';
                ctx.fillRect(-tileSize / 2 + 4, -4, tileSize - 8, 8);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '8px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('MRG', 0, 3);
            } else if (belt.type === 'underground_belt') {
                ctx.fillStyle = '#3B82F6';
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#0F172A';
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // Render Items on Belt
            belt.items.forEach(item => {
                const offset = DIR_OFFSET[belt.direction];
                // Interpolated item position across tile
                const itemWorldX = px + tileSize / 2 + offset.dx * (item.pos - 0.5) * tileSize;
                const itemWorldY = py + tileSize / 2 + offset.dy * (item.pos - 0.5) * tileSize;

                this.renderItemPellet(ctx, item.type, itemWorldX, itemWorldY);
            });
        });
    }

    renderItemPellet(ctx, itemType, x, y) {
        const itemDef = ITEMS[itemType] || { color: '#FFFFFF' };
        ctx.save();
        ctx.translate(x, y);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 4, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Faceted Pellet
        ctx.fillStyle = itemDef.color;
        ctx.beginPath();
        ctx.roundRect(-7, -7, 14, 14, 4);
        ctx.fill();

        // Specular Top Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.roundRect(-6, -6, 12, 5, 2);
        ctx.fill();

        ctx.restore();
    }

    renderBuildings(ctx, tileSize, dt) {
        const nonBelts = this.grid.buildingList.filter(b => 
            b.type !== 'belt' && b.type !== 'fast_belt' && b.type !== 'splitter' && b.type !== 'merger' && b.type !== 'underground_belt'
        );

        nonBelts.forEach(b => {
            const px = b.x * tileSize;
            const py = b.y * tileSize;
            const sizePx = b.size * tileSize;
            const cx = px + sizePx / 2;
            const cy = py + sizePx / 2;

            ctx.save();
            ctx.translate(cx, cy);

            // Rotate based on machine direction (except symmetrical power poles)
            if (b.type !== 'power_pole' && b.type !== 'solar_panel') {
                ctx.rotate(b.direction * Math.PI / 2);
            }

            // 1. Miner
            if (b.type === 'miner') {
                this.drawMiner(ctx, sizePx, b);
            }
            // 2. Smelter
            else if (b.type === 'smelter') {
                this.drawSmelter(ctx, sizePx, b);
            }
            // 3. Assembler
            else if (b.type === 'assembler') {
                this.drawAssembler(ctx, sizePx, b);
            }
            // 4. Coal Power Plant
            else if (b.type === 'coal_generator') {
                this.drawCoalGenerator(ctx, sizePx, b);
            }
            // 5. Solar Panel
            else if (b.type === 'solar_panel') {
                this.drawSolarPanel(ctx, sizePx, b);
            }
            // 6. Power Pole
            else if (b.type === 'power_pole') {
                this.drawPowerPole(ctx, sizePx, b);
            }
            // 7. Storage Silo
            else if (b.type === 'storage_silo') {
                this.drawStorageSilo(ctx, sizePx, b);
            }
            // 8. Research Lab
            else if (b.type === 'research_lab') {
                this.drawResearchLab(ctx, sizePx, b);
            }
            // 9. Space Elevator
            else if (b.type === 'space_elevator') {
                this.drawSpaceElevator(ctx, sizePx, b);
            }

            ctx.restore();

            // Status Badge Overlay (No Power / Blocked)
            if (b.status === 'no_power' || b.powerRatio <= 0.05) {
                this.drawStatusPill(ctx, cx, cy - sizePx / 2 - 10, '⚡ NO POWER', '#EF4444');
            } else if (b.status === 'blocked') {
                this.drawStatusPill(ctx, cx, cy - sizePx / 2 - 10, '⚠️ BLOCKED', '#F59E0B');
            }
        });
    }

    drawMiner(ctx, size, b) {
        // Base plate
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 4, -size / 2 + 4, size - 8, size - 8, 8);
        ctx.fill();
        ctx.stroke();

        // Drill circle
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Rotating drill blades
        ctx.save();
        ctx.rotate(b.animationTime * 8);
        ctx.fillStyle = '#38BDF8';
        for (let i = 0; i < 3; i++) {
            ctx.rotate(Math.PI * 2 / 3);
            ctx.fillRect(-3, -size * 0.24, 6, size * 0.24);
        }
        ctx.restore();

        // Output nozzle arrow pointing forward (direction is rotated to North)
        ctx.fillStyle = '#22D3EE';
        ctx.beginPath();
        ctx.moveTo(0, -size / 2 + 2);
        ctx.lineTo(6, -size / 2 + 10);
        ctx.lineTo(-6, -size / 2 + 10);
        ctx.fill();
    }

    drawSmelter(ctx, size, b) {
        // Heavy industrial furnace block
        ctx.fillStyle = '#1C1917';
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 6, -size / 2 + 6, size - 12, size - 12, 12);
        ctx.fill();
        ctx.stroke();

        // Molten heat core
        const pulse = 0.8 + 0.2 * Math.sin(b.animationTime * 6);
        ctx.fillStyle = b.status === 'working' ? `rgba(249, 115, 22, ${pulse})` : '#44403C';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Golden fiery center
        if (b.status === 'working') {
            ctx.fillStyle = `rgba(254, 240, 138, ${pulse})`;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
            ctx.fill();
        }

        // Exhaust chimney vents
        ctx.fillStyle = '#292524';
        ctx.fillRect(-size / 2 + 10, -size / 2 + 10, 14, 14);
        ctx.fillRect(size / 2 - 24, -size / 2 + 10, 14, 14);
    }

    drawAssembler(ctx, size, b) {
        // High-tech assembly unit
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 6, -size / 2 + 6, size - 12, size - 12, 14);
        ctx.fill();
        ctx.stroke();

        // Robotic turntable
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Rotating robotic arms
        ctx.save();
        ctx.rotate(b.animationTime * 4);
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size * 0.22, 0);
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.22, 0);
        ctx.stroke();
        ctx.restore();

        // Status LED
        ctx.fillStyle = b.status === 'working' ? '#10B981' : '#F59E0B';
        ctx.beginPath();
        ctx.arc(size / 2 - 16, -size / 2 + 16, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCoalGenerator(ctx, size, b) {
        ctx.fillStyle = '#18181B';
        ctx.strokeStyle = '#EAB308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 6, -size / 2 + 6, size - 12, size - 12, 10);
        ctx.fill();
        ctx.stroke();

        // Boiler hatch
        ctx.fillStyle = b.fuelTime > 0 ? '#F97316' : '#27272A';
        ctx.fillRect(-12, 4, 24, 16);

        // Twin smoke stacks
        ctx.fillStyle = '#3F3F46';
        ctx.beginPath();
        ctx.arc(-size * 0.22, -size * 0.22, 10, 0, Math.PI * 2);
        ctx.arc(size * 0.22, -size * 0.22, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSolarPanel(ctx, size, b) {
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 4, -size / 2 + 4, size - 8, size - 8, 8);
        ctx.fill();
        ctx.stroke();

        // Grid of photovoltaic cells
        ctx.fillStyle = '#0369A1';
        const cellSize = (size - 24) / 3;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                ctx.fillRect(
                    -size / 2 + 8 + c * (cellSize + 4),
                    -size / 2 + 8 + r * (cellSize + 4),
                    cellSize,
                    cellSize
                );
            }
        }
    }

    drawPowerPole(ctx, size, b) {
        // High voltage pylon base
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
        ctx.fill();

        // Insulator crossbeams
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(14, 0);
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 14);
        ctx.stroke();
    }

    drawStorageSilo(ctx, size, b) {
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Silo dome lid
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Item count indicator
        let total = 0;
        Object.values(b.inventory.inputs).forEach(c => total += c);
        ctx.fillStyle = '#38BDF8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${total}`, 0, 4);
    }

    drawResearchLab(ctx, size, b) {
        ctx.fillStyle = '#1E1B4B';
        ctx.strokeStyle = '#818CF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 6, -size / 2 + 6, size - 12, size - 12, 16);
        ctx.fill();
        ctx.stroke();

        // Quantum science holographic sphere
        ctx.save();
        ctx.rotate(b.animationTime * 2);
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.28, size * 0.14, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#38BDF8';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.28, size * 0.14, Math.PI / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Glowing core
        ctx.fillStyle = '#C084FC';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSpaceElevator(ctx, size, b) {
        // Mega foundation
        ctx.fillStyle = '#09090B';
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-size / 2 + 8, -size / 2 + 8, size - 16, size - 16, 20);
        ctx.fill();
        ctx.stroke();

        // 4 Magnetic stabilizer rings
        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.3, 10, 0, Math.PI * 2);
        ctx.arc(size * 0.3, -size * 0.3, 10, 0, Math.PI * 2);
        ctx.arc(-size * 0.3, size * 0.3, 10, 0, Math.PI * 2);
        ctx.arc(size * 0.3, size * 0.3, 10, 0, Math.PI * 2);
        ctx.fill();

        // Tether energy beam ascending to orbit
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        // Blue beam pulse
        const pulse = 0.5 + 0.5 * Math.sin(b.animationTime * 8);
        ctx.fillStyle = `rgba(56, 189, 248, ${pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fill();
    }

    drawStatusPill(ctx, x, y, text, color) {
        ctx.save();
        ctx.font = 'bold 9px monospace';
        const width = ctx.measureText(text).width + 12;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - 8, width, 16, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y + 3);
        ctx.restore();
    }

    renderPowerCables(ctx, tileSize) {
        this.grid.powerNetworks.forEach(net => {
            const poles = net.poles;
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
            ctx.lineWidth = 1.5;

            for (let i = 0; i < poles.length; i++) {
                for (let j = i + 1; j < poles.length; j++) {
                    const p1 = poles[i];
                    const p2 = poles[j];
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                    if (dist <= (p1.def.wireMaxDist || 8)) {
                        const x1 = p1.x * tileSize + tileSize / 2;
                        const y1 = p1.y * tileSize + tileSize / 2;
                        const x2 = p2.x * tileSize + tileSize / 2;
                        const y2 = p2.y * tileSize + tileSize / 2;

                        // Sagging quadratic curve
                        const midX = (x1 + x2) / 2;
                        const midY = (y1 + y2) / 2 + dist * 1.5;

                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.quadraticCurveTo(midX, midY, x2, y2);
                        ctx.stroke();
                    }
                }
            }
        });
    }

    renderParticles(ctx, dt) {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }

            const alpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    renderGhost(ctx, tileSize) {
        const def = BUILDINGS[this.ghost.type];
        if (!def) return;

        const size = def.size || 1;
        const px = this.ghost.x * tileSize;
        const py = this.ghost.y * tileSize;
        const sizePx = size * tileSize;

        ctx.save();
        ctx.fillStyle = this.ghost.valid ? 'rgba(16, 185, 129, 0.28)' : 'rgba(239, 68, 68, 0.28)';
        ctx.strokeStyle = this.ghost.valid ? '#10B981' : '#EF4444';
        ctx.lineWidth = 2;
        ctx.fillRect(px, py, sizePx, sizePx);
        ctx.strokeRect(px, py, sizePx, sizePx);

        // Direction arrow
        const cx = px + sizePx / 2;
        const cy = py + sizePx / 2;
        ctx.translate(cx, cy);
        ctx.rotate(this.ghost.direction * Math.PI / 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(0, -sizePx * 0.35);
        ctx.lineTo(sizePx * 0.2, -sizePx * 0.1);
        ctx.lineTo(-sizePx * 0.2, -sizePx * 0.1);
        ctx.fill();

        // Coverage radius preview for power pole
        if (this.ghost.type === 'power_pole') {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, (def.coverageRadius || 5) * tileSize, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
}
