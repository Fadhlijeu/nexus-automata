/**
 * Grid, World Map, Resource Distribution, and Power Network
 * Nexus Automata
 */

import { BUILDINGS, DIR_OFFSET, DIRECTIONS, ITEMS } from './data.js';

export class WorldGrid {
    constructor(width = 80, height = 80) {
        this.width = width;
        this.height = height;
        this.tileSize = 48; // Base pixel size per tile

        // 2D Array of tile data: { resource: null | 'iron_ore' | 'copper_ore' | ... }
        this.terrain = Array(height).fill(null).map(() => Array(width).fill(null));

        // Map of key "x,y" -> BuildingInstance
        this.buildings = new Map();
        
        // List of all unique building instances
        this.buildingList = [];
        this.nextBuildingId = 1;

        // Power networks
        this.powerNetworks = [];

        this.generateResources();
    }

    generateResources() {
        // Seed distinct organic clusters around the spawn area
        const clusters = [
            // Iron Veins (near center)
            { type: 'iron_ore', cx: Math.floor(this.width / 2) - 6, cy: Math.floor(this.height / 2) - 4, count: 28, radius: 4 },
            { type: 'iron_ore', cx: Math.floor(this.width / 2) + 12, cy: Math.floor(this.height / 2) - 10, count: 32, radius: 4.5 },
            
            // Copper Veins
            { type: 'copper_ore', cx: Math.floor(this.width / 2) + 6, cy: Math.floor(this.height / 2) + 5, count: 24, radius: 3.5 },
            { type: 'copper_ore', cx: Math.floor(this.width / 2) - 14, cy: Math.floor(this.height / 2) + 12, count: 30, radius: 4 },

            // Coal Deposits
            { type: 'coal', cx: Math.floor(this.width / 2) - 10, cy: Math.floor(this.height / 2) - 12, count: 26, radius: 3.8 },
            { type: 'coal', cx: Math.floor(this.width / 2) + 16, cy: Math.floor(this.height / 2) + 14, count: 34, radius: 4.5 },

            // Stone Quarries
            { type: 'stone', cx: Math.floor(this.width / 2) + 8, cy: Math.floor(this.height / 2) - 14, count: 22, radius: 3.2 },
            { type: 'stone', cx: Math.floor(this.width / 2) - 16, cy: Math.floor(this.height / 2) - 8, count: 25, radius: 3.5 },

            // Rare Crystals
            { type: 'crystal', cx: Math.floor(this.width / 2) + 20, cy: Math.floor(this.height / 2) - 4, count: 18, radius: 3.0 },
            { type: 'crystal', cx: Math.floor(this.width / 2) - 22, cy: Math.floor(this.height / 2) + 8, count: 18, radius: 3.0 }
        ];

        clusters.forEach(c => {
            let placed = 0;
            for (let i = 0; i < c.count * 3 && placed < c.count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.pow(Math.random(), 0.8) * c.radius;
                const x = Math.round(c.cx + Math.cos(angle) * dist);
                const y = Math.round(c.cy + Math.sin(angle) * dist);

                if (this.isInBounds(x, y) && !this.terrain[y][x]) {
                    this.terrain[y][x] = {
                        type: c.type,
                        richness: Math.floor(1000 + Math.random() * 4000)
                    };
                    placed++;
                }
            }
        });
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    getTile(x, y) {
        if (!this.isInBounds(x, y)) return null;
        return this.terrain[y][x];
    }

    getBuilding(x, y) {
        return this.buildings.get(`${x},${y}`) || null;
    }

    canPlace(typeId, startX, startY, direction = DIRECTIONS.NORTH) {
        const def = BUILDINGS[typeId];
        if (!def || def.isTool) return false;

        const size = def.size || 1;

        // Check bounds & occupancy for footprint
        for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
                const x = startX + dx;
                const y = startY + dy;
                if (!this.isInBounds(x, y)) return false;
                if (this.buildings.has(`${x},${y}`)) return false;
            }
        }

        // Special check: Miner requires resource deposit underneath
        if (typeId === 'miner') {
            const tile = this.getTile(startX, startY);
            if (!tile || !tile.type) return false;
        }

        return true;
    }

    placeBuilding(typeId, startX, startY, direction = DIRECTIONS.NORTH) {
        if (!this.canPlace(typeId, startX, startY, direction)) return null;

        const def = BUILDINGS[typeId];
        const size = def.size || 1;
        const id = this.nextBuildingId++;

        const building = {
            id,
            type: typeId,
            def,
            x: startX,
            y: startY,
            direction,
            size,
            // Machine state
            progress: 0,
            recipe: def.defaultRecipe || null,
            inventory: {
                inputs: {},
                outputs: {}
            },
            status: 'idle', // 'working', 'idle', 'no_power', 'blocked'
            powerRatio: 1.0,
            clockSpeed: 1.0, // 0.5x -> 2.0x overclock multiplier
            // Inserter specific
            heldItem: null, // item type currently gripped by robotic arm
            armAngle: 0, // current rotational angle in radians
            armTargetAngle: 0,
            filterItem: null, // optional smart filter item id
            // Belt specific
            items: [], // [{ id, type, pos: 0.0 -> 1.0 }]
            beltSplitSide: 0, // 0: left, 1: right for splitter
            undergroundTarget: null,
            // Power specific
            fuelTime: 0,
            animationTime: Math.random() * 10
        };

        // Link underground tunnels if placing underground_belt
        if (typeId === 'underground_belt') {
            this.linkUndergroundTunnel(building);
        }

        // Register footprint
        for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
                this.buildings.set(`${startX + dx},${startY + dy}`, building);
            }
        }

        this.buildingList.push(building);
        this.updatePowerGrid();

        return building;
    }

    linkUndergroundTunnel(building) {
        const offset = DIR_OFFSET[building.direction];
        // Look up to 4 tiles forward or backward
        for (let dist = 1; dist <= 4; dist++) {
            const targetX = building.x + offset.dx * dist;
            const targetY = building.y + offset.dy * dist;
            const other = this.getBuilding(targetX, targetY);
            if (other && other.type === 'underground_belt' && other.direction === building.direction) {
                building.undergroundTarget = other;
                other.undergroundTarget = building;
                break;
            }
        }
    }

    removeBuilding(x, y) {
        const building = this.getBuilding(x, y);
        if (!building) return null;

        // Clear footprint
        const size = building.size || 1;
        for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
                this.buildings.delete(`${building.x + dx},${building.y + dy}`);
            }
        }

        // Unlink underground tunnel
        if (building.undergroundTarget) {
            building.undergroundTarget.undergroundTarget = null;
        }

        // Remove from list
        this.buildingList = this.buildingList.filter(b => b.id !== building.id);

        this.updatePowerGrid();
        return building;
    }

    updatePowerGrid() {
        const poles = this.buildingList.filter(b => b.type === 'power_pole');
        const generators = this.buildingList.filter(b => b.def.powerGen);
        const consumers = this.buildingList.filter(b => b.def.powerNeed);

        // Reset all power ratios
        this.buildingList.forEach(b => {
            if (b.def.powerNeed) b.powerRatio = 0;
        });

        if (poles.length === 0 && generators.length === 0) {
            return;
        }

        // Graph clustering for power poles
        const visited = new Set();
        const networks = [];

        poles.forEach(pole => {
            if (visited.has(pole.id)) return;

            const network = { poles: [], generators: [], consumers: [], capacity: 0, demand: 0, ratio: 0 };
            const queue = [pole];
            visited.add(pole.id);

            while (queue.length > 0) {
                const current = queue.shift();
                network.poles.push(current);

                // Find neighbor poles within max wire dist (8 tiles)
                poles.forEach(other => {
                    if (!visited.has(other.id)) {
                        const dist = Math.hypot(current.x - other.x, current.y - other.y);
                        if (dist <= (current.def.wireMaxDist || 8)) {
                            visited.add(other.id);
                            queue.push(other);
                        }
                    }
                });
            }

            // Find all generators & consumers within coverage radius of any pole in this network
            const poleCoverage = (pole.def.coverageRadius || 5);
            
            generators.forEach(gen => {
                const connected = network.poles.some(p => Math.hypot(p.x - gen.x, p.y - gen.y) <= poleCoverage + gen.size);
                if (connected && !network.generators.includes(gen)) {
                    network.generators.push(gen);
                    let activeGen = gen.def.powerGen || 0;
                    if ((gen.type === 'coal_generator' || gen.type === 'nuclear_reactor') && gen.fuelTime <= 0) {
                        activeGen = 0;
                    }
                    network.capacity += activeGen;
                }
            });

            // Accumulator battery banks
            network.accumulators = [];
            const accumulators = this.buildingList.filter(b => b.type === 'accumulator');
            accumulators.forEach(acc => {
                const connected = network.poles.some(p => Math.hypot(p.x - acc.x, p.y - acc.y) <= poleCoverage + acc.size);
                if (connected && !network.accumulators.includes(acc)) {
                    network.accumulators.push(acc);
                    if (acc.storedEnergy === undefined) acc.storedEnergy = 2500;
                }
            });

            consumers.forEach(cons => {
                const connected = network.poles.some(p => Math.hypot(p.x - cons.x, p.y - cons.y) <= poleCoverage + cons.size);
                if (connected && !network.consumers.includes(cons)) {
                    network.consumers.push(cons);
                    const powerMult = cons.clockSpeed ? Math.pow(cons.clockSpeed, 1.6) : 1.0;
                    network.demand += (cons.def.powerNeed || 0) * powerMult;
                }
            });

            // Handle accumulator battery support during deficits or surpluses
            if (network.capacity < network.demand) {
                let dischargeTotal = 0;
                network.accumulators.forEach(acc => {
                    if (acc.storedEnergy > 10) {
                        const canProvide = Math.min(acc.def.chargeRate || 75, acc.storedEnergy / 10);
                        dischargeTotal += canProvide;
                        acc.status = 'discharging';
                    } else {
                        acc.status = 'idle';
                    }
                });
                network.capacity += dischargeTotal;
            } else if (network.capacity > network.demand) {
                network.accumulators.forEach(acc => {
                    if (acc.storedEnergy < (acc.def.powerCapacity || 5000)) {
                        acc.status = 'charging';
                    } else {
                        acc.status = 'idle';
                    }
                });
            }

            // Calculate satisfaction ratio
            if (network.demand === 0) {
                network.ratio = 1.0;
            } else if (network.capacity >= network.demand) {
                network.ratio = 1.0;
            } else {
                network.ratio = network.capacity / network.demand;
            }

            // Apply ratio to consumers
            network.consumers.forEach(cons => {
                cons.powerRatio = network.ratio;
            });

            networks.push(network);
        });

        this.powerNetworks = networks;
    }

    getGlobalPowerTelemetry() {
        let totalCapacity = 0;
        let totalDemand = 0;

        this.powerNetworks.forEach(net => {
            totalCapacity += net.capacity;
            totalDemand += net.demand;
        });

        return {
            capacity: totalCapacity,
            demand: totalDemand,
            satisfaction: totalDemand === 0 ? 1.0 : Math.min(1.0, totalCapacity / totalDemand)
        };
    }
}
