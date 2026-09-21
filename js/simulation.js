/**
 * Discrete Simulation Engine: Belts, Machines, Crafting, and Research
 * Nexus Automata
 */

import { DIR_OFFSET, RECIPES, ITEMS, DIRECTIONS, TECH_TREE, MILESTONES } from './data.js';
import { sound } from './audio.js';

export class SimulationEngine {
    constructor(worldGrid, onEventCallback) {
        this.grid = worldGrid;
        this.onEvent = onEventCallback || (() => {});
        this.gameSpeed = 1.0; // 0: pause, 1: 1x, 2: 2x, 5: 5x
        this.activeTech = null; // Currently researching tech
        this.techProgress = 0; // Number of science packs delivered
        this.currentMilestoneIdx = 0;
        this.milestoneDelivered = 0;

        // Telemetry & Historical Graph Data
        this.itemsProducedWindow = []; // { time, count }
        this.productionPerMin = 0;
        this.totalDelivered = 0;
        this.gameTime = 0;
        this.telemetryHistory = []; // [{ time, capacity, demand, satisfaction, productionRate }]
        this.lastTelemetrySampleTime = 0;
    }

    setGameSpeed(speed) {
        this.gameSpeed = speed;
    }

    setActiveTech(techId) {
        const tech = TECH_TREE.find(t => t.id === techId);
        if (tech && !tech.unlocked) {
            this.activeTech = tech;
            this.techProgress = 0;
            this.onEvent('tech_selected', tech);
        }
    }

    update(dt) {
        if (this.gameSpeed <= 0) return;
        const effectiveDt = dt * this.gameSpeed;
        this.gameTime += effectiveDt;

        // 1. Update power grid ticks & fuel
        this.updatePowerGenerators(effectiveDt);

        // 2. Update miners
        this.updateMiners(effectiveDt);

        // 3. Update belts and logistics
        this.updateBelts(effectiveDt);

        // 4. Update robotic inserters
        this.updateInserters(effectiveDt);

        // 5. Update manufacturing machines (smelters, assemblers, chemical plants)
        this.updateManufacturers(effectiveDt);

        // 6. Update research labs
        this.updateResearchLabs(effectiveDt);

        // 7. Update space elevator milestones
        this.updateSpaceElevator(effectiveDt);

        // 8. Update production rate & time-series telemetry
        this.updateTelemetry();
    }

    updatePowerGenerators(dt) {
        let gridNeedsRefresh = false;

        this.grid.buildingList.forEach(b => {
            if (b.type === 'coal_generator') {
                if (b.fuelTime > 0) {
                    b.fuelTime -= dt;
                    b.status = 'working';
                } else {
                    // Try to consume coal from inputs
                    if (b.inventory.inputs['coal'] && b.inventory.inputs['coal'] > 0) {
                        b.inventory.inputs['coal']--;
                        b.fuelTime = 8.0; // 8 seconds per coal piece
                        b.status = 'working';
                    } else {
                        b.status = 'no_fuel';
                        gridNeedsRefresh = true;
                    }
                }
            } else if (b.type === 'solar_panel') {
                b.status = 'working';
            }
        });

        if (gridNeedsRefresh) {
            this.grid.updatePowerGrid();
        }
    }

    updateMiners(dt) {
        this.grid.buildingList.forEach(b => {
            if (b.type !== 'miner') return;

            // Check power
            if (b.powerRatio <= 0.05) {
                b.status = 'no_power';
                return;
            }

            const tile = this.grid.getTile(b.x, b.y);
            if (!tile || !tile.type) {
                b.status = 'no_ore';
                return;
            }

            b.status = 'working';
            b.animationTime += dt * b.powerRatio;
            b.progress += (dt * b.powerRatio * (b.clockSpeed || 1.0)) / (b.def.mineInterval || 1.8);

            if (b.progress >= 1.0) {
                b.progress = 0;
                // Eject mined ore to the tile facing miner's direction
                const offset = DIR_OFFSET[b.direction];
                const targetX = b.x + offset.dx;
                const targetY = b.y + offset.dy;
                
                const targetBuilding = this.grid.getBuilding(targetX, targetY);
                if (targetBuilding) {
                    this.tryFeedItem(targetBuilding, tile.type, targetX, targetY);
                }
            }
        });
    }

    updateBelts(dt) {
        // Collect all belts
        const belts = this.grid.buildingList.filter(b => 
            b.type === 'belt' || b.type === 'fast_belt' || b.type === 'splitter' || b.type === 'merger' || b.type === 'underground_belt'
        );

        // Process belts in reverse item order
        belts.forEach(belt => {
            const speed = (belt.def.speed || 1.6);
            belt.animationTime += dt * speed;

            // Sort items so furthest item along belt (highest pos) is processed first
            belt.items.sort((a, b) => b.pos - a.pos);

            for (let i = 0; i < belt.items.length; i++) {
                const item = belt.items[i];
                const ahead = belt.items[i - 1]; // item immediately ahead

                // Determine maximum position this item can advance
                const maxPos = ahead ? (ahead.pos - 0.42) : 1.0;

                if (item.pos < maxPos) {
                    item.pos = Math.min(maxPos, item.pos + speed * dt);
                }

                // If item reached end of belt (pos >= 1.0), attempt transfer to next tile
                if (item.pos >= 0.98) {
                    if (this.transferBeltItem(belt, item, i)) {
                        // Successfully transferred, remove from current belt
                        belt.items.splice(i, 1);
                        i--;
                    }
                }
            }
        });
    }

    transferBeltItem(belt, item, itemIndex) {
        let targetX, targetY, targetDir = belt.direction;

        // Splitter logic: alternates left and right
        if (belt.type === 'splitter') {
            const splitLeftDir = (belt.direction + 3) % 4;
            const splitRightDir = (belt.direction + 1) % 4;
            const chosenDir = belt.beltSplitSide === 0 ? splitLeftDir : splitRightDir;
            belt.beltSplitSide = 1 - belt.beltSplitSide; // Alternate
            const offset = DIR_OFFSET[chosenDir];
            targetX = belt.x + offset.dx;
            targetY = belt.y + offset.dy;
        } else if (belt.type === 'underground_belt' && belt.undergroundTarget) {
            // Tunnel teleport directly to exit underground belt!
            const exitBelt = belt.undergroundTarget;
            if (exitBelt.items.length < 2) {
                exitBelt.items.push({
                    id: item.id,
                    type: item.type,
                    pos: 0.1
                });
                return true;
            }
            return false;
        } else {
            const offset = DIR_OFFSET[belt.direction];
            targetX = belt.x + offset.dx;
            targetY = belt.y + offset.dy;
        }

        const targetBuilding = this.grid.getBuilding(targetX, targetY);
        if (!targetBuilding) return false;

        return this.tryFeedItem(targetBuilding, item.type, targetX, targetY);
    }

    tryFeedItem(targetBuilding, itemType, tileX, tileY) {
        // Case 1: Target is a Conveyor Belt
        if (targetBuilding.type === 'belt' || targetBuilding.type === 'fast_belt' || targetBuilding.type === 'splitter' || targetBuilding.type === 'merger' || targetBuilding.type === 'underground_belt') {
            if (targetBuilding.items.length < 2) {
                // Check if entry space is free
                const hasBlockAtEntry = targetBuilding.items.some(it => it.pos < 0.35);
                if (!hasBlockAtEntry) {
                    targetBuilding.items.push({
                        id: Math.random(),
                        type: itemType,
                        pos: 0.05
                    });
                    return true;
                }
            }
            return false;
        }

        // Case 2: Target is a Machine (Smelter, Assembler, Silo, Lab, Coal Gen, Space Elevator)
        const inputs = targetBuilding.inventory.inputs;
        const currentCount = inputs[itemType] || 0;

        // Buffer limit per slot
        const maxInputBuffer = targetBuilding.type === 'storage_silo' ? 250 : 20;

        if (currentCount < maxInputBuffer) {
            inputs[itemType] = currentCount + 1;
            return true;
        }

        return false;
    }

    updateInserters(dt) {
        const inserters = this.grid.buildingList.filter(b => b.type === 'inserter' || b.type === 'fast_inserter');

        inserters.forEach(b => {
            if (b.powerRatio <= 0.05) {
                b.status = 'no_power';
                return;
            }

            b.status = 'working';
            const speed = (b.def.speed || 1.5) * b.powerRatio * (b.clockSpeed || 1.0);

            // Inserter geometry: pickup tile is behind (opposite of direction), dropoff is in front
            const dropOffset = DIR_OFFSET[b.direction];
            const pickOffset = DIR_OFFSET[(b.direction + 2) % 4];

            const pickX = b.x + pickOffset.dx;
            const pickY = b.y + pickOffset.dy;
            const dropX = b.x + dropOffset.dx;
            const dropY = b.y + dropOffset.dy;

            if (!b.heldItem) {
                // Swing arm back to pickup position (0 radians)
                if (b.armAngle > 0.04) {
                    b.armAngle = Math.max(0, b.armAngle - speed * Math.PI * dt);
                } else {
                    b.armAngle = 0;
                    // Attempt pickup
                    const pickBuilding = this.grid.getBuilding(pickX, pickY);
                    if (pickBuilding) {
                        // 1. Pick from conveyor belt
                        if (pickBuilding.items && pickBuilding.items.length > 0) {
                            let idx = -1;
                            if (b.filterItem) {
                                idx = pickBuilding.items.findIndex(it => it.type === b.filterItem);
                            } else {
                                idx = 0;
                            }

                            if (idx !== -1) {
                                const grabbed = pickBuilding.items.splice(idx, 1)[0];
                                b.heldItem = grabbed.type;
                                sound.playInserterSwing();
                            }
                        }
                        // 2. Pick from machine outputs or storage
                        else if (pickBuilding.inventory && pickBuilding.inventory.outputs) {
                            for (const [outItem, qty] of Object.entries(pickBuilding.inventory.outputs)) {
                                if (qty > 0 && (!b.filterItem || b.filterItem === outItem)) {
                                    pickBuilding.inventory.outputs[outItem]--;
                                    b.heldItem = outItem;
                                    sound.playInserterSwing();
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                // Swing arm forward to dropoff position (PI radians)
                if (b.armAngle < Math.PI - 0.04) {
                    b.armAngle = Math.min(Math.PI, b.armAngle + speed * Math.PI * dt);
                } else {
                    b.armAngle = Math.PI;
                    // Attempt dropoff
                    const dropBuilding = this.grid.getBuilding(dropX, dropY);
                    if (dropBuilding) {
                        // 1. Drop onto conveyor belt
                        if (dropBuilding.items) {
                            const hasSpace = dropBuilding.items.every(it => it.pos > 0.28);
                            if (hasSpace) {
                                dropBuilding.items.push({ id: Math.random(), type: b.heldItem, pos: 0.0 });
                                b.heldItem = null;
                            }
                        }
                        // 2. Drop into machine or silo inputs
                        else if (dropBuilding.inventory && dropBuilding.inventory.inputs) {
                            const current = dropBuilding.inventory.inputs[b.heldItem] || 0;
                            const maxBuffer = dropBuilding.type === 'storage_silo' ? 250 : 25;
                            if (current < maxBuffer) {
                                dropBuilding.inventory.inputs[b.heldItem] = current + 1;
                                b.heldItem = null;
                            }
                        }
                    }
                }
            }
        });
    }

    updateManufacturers(dt) {
        this.grid.buildingList.forEach(b => {
            if (b.type !== 'smelter' && b.type !== 'assembler' && b.type !== 'chemical_plant') return;

            // Power check
            if (b.powerRatio <= 0.05) {
                b.status = 'no_power';
                return;
            }

            const recipe = RECIPES[b.recipe];
            if (!recipe) {
                b.status = 'no_recipe';
                return;
            }

            // Output ejection to forward tile
            this.ejectMachineOutputs(b);

            // Check if outputs buffer is congested
            let outputTotal = 0;
            Object.values(b.inventory.outputs).forEach(cnt => outputTotal += cnt);
            if (outputTotal >= 20) {
                b.status = 'blocked';
                return;
            }

            // Check if inputs are available
            let hasAllInputs = true;
            for (const [inItem, needed] of Object.entries(recipe.inputs)) {
                if ((b.inventory.inputs[inItem] || 0) < needed) {
                    hasAllInputs = false;
                    break;
                }
            }

            if (!hasAllInputs) {
                b.status = 'waiting_inputs';
                return;
            }

            // Active crafting with overclock scaling
            b.status = 'working';
            b.animationTime += dt * b.powerRatio;
            b.progress += (dt * b.powerRatio * (b.clockSpeed || 1.0)) / recipe.duration;

            if (b.progress >= 1.0) {
                b.progress = 0;

                // Deduct inputs
                for (const [inItem, needed] of Object.entries(recipe.inputs)) {
                    b.inventory.inputs[inItem] -= needed;
                }

                // Add outputs
                for (const [outItem, qty] of Object.entries(recipe.outputs)) {
                    b.inventory.outputs[outItem] = (b.inventory.outputs[outItem] || 0) + qty;
                    this.recordProduction(qty);
                }
            }
        });
    }

    ejectMachineOutputs(machine) {
        const offset = DIR_OFFSET[machine.direction];
        // Calculate output ejection point in front of machine
        let ejectX = machine.x;
        let ejectY = machine.y;

        if (machine.direction === DIRECTIONS.NORTH) {
            ejectX = machine.x;
            ejectY = machine.y - 1;
        } else if (machine.direction === DIRECTIONS.EAST) {
            ejectX = machine.x + machine.size;
            ejectY = machine.y;
        } else if (machine.direction === DIRECTIONS.SOUTH) {
            ejectX = machine.x;
            ejectY = machine.y + machine.size;
        } else if (machine.direction === DIRECTIONS.WEST) {
            ejectX = machine.x - 1;
            ejectY = machine.y;
        }

        const targetBuilding = this.grid.getBuilding(ejectX, ejectY);
        if (!targetBuilding) return;

        for (const [itemType, count] of Object.entries(machine.inventory.outputs)) {
            if (count > 0) {
                if (this.tryFeedItem(targetBuilding, itemType, ejectX, ejectY)) {
                    machine.inventory.outputs[itemType]--;
                    break;
                }
            }
        }
    }

    updateResearchLabs(dt) {
        this.grid.buildingList.forEach(b => {
            if (b.type !== 'research_lab') return;

            if (b.powerRatio <= 0.05) {
                b.status = 'no_power';
                return;
            }

            if (!this.activeTech) {
                b.status = 'idle';
                return;
            }

            b.status = 'working';
            b.animationTime += dt * b.powerRatio;

            // Check required science packs for activeTech
            let neededItem = null;
            let neededTotal = 1;
            for (const [item, count] of Object.entries(this.activeTech.cost)) {
                neededItem = item;
                neededTotal = count;
                break;
            }

            // If tech doesn't need science (like starting tech), auto unlock
            if (!neededItem) {
                this.unlockTech(this.activeTech);
                return;
            }

            // Consume science pack from lab inputs
            if ((b.inventory.inputs[neededItem] || 0) > 0) {
                b.progress += dt * 0.4 * b.powerRatio;
                if (b.progress >= 1.0) {
                    b.progress = 0;
                    b.inventory.inputs[neededItem]--;
                    this.techProgress++;

                    this.onEvent('research_progress', {
                        tech: this.activeTech,
                        progress: this.techProgress,
                        total: neededTotal
                    });

                    if (this.techProgress >= neededTotal) {
                        this.unlockTech(this.activeTech);
                    }
                }
            } else {
                b.status = 'waiting_inputs';
            }
        });
    }

    unlockTech(tech) {
        tech.unlocked = true;
        sound.playResearchUnlock();
        this.onEvent('tech_unlocked', tech);
        this.activeTech = null;
        this.techProgress = 0;
    }

    updateSpaceElevator(dt) {
        this.grid.buildingList.forEach(b => {
            if (b.type !== 'space_elevator') return;

            if (b.powerRatio <= 0.05) {
                b.status = 'no_power';
                return;
            }

            b.animationTime += dt * b.powerRatio;

            const milestone = MILESTONES[this.currentMilestoneIdx];
            if (!milestone) {
                b.status = 'victory';
                return;
            }

            const targetItem = milestone.requirementItem;
            const targetAmount = milestone.targetAmount;

            if ((b.inventory.inputs[targetItem] || 0) > 0) {
                b.inventory.inputs[targetItem]--;
                this.milestoneDelivered++;
                this.totalDelivered++;

                this.onEvent('milestone_progress', {
                    milestone,
                    delivered: this.milestoneDelivered,
                    target: targetAmount
                });

                if (this.milestoneDelivered >= targetAmount) {
                    this.currentMilestoneIdx++;
                    this.milestoneDelivered = 0;
                    sound.playResearchUnlock();
                    this.onEvent('milestone_complete', milestone);
                }
            }
        });
    }

    recordProduction(count) {
        const now = Date.now();
        this.itemsProducedWindow.push({ time: now, count });
    }

    updateTelemetry() {
        const now = Date.now();
        // Keep 60 seconds sliding window
        this.itemsProducedWindow = this.itemsProducedWindow.filter(e => now - e.time <= 60000);
        const sum = this.itemsProducedWindow.reduce((acc, curr) => acc + curr.count, 0);
        this.productionPerMin = sum;

        // Sample time-series every 1 second for live analytics graphs
        if (now - this.lastTelemetrySampleTime >= 1000) {
            this.lastTelemetrySampleTime = now;
            const power = this.grid.getGlobalPowerTelemetry();
            this.telemetryHistory.push({
                time: now,
                capacity: Math.round(power.capacity),
                demand: Math.round(power.demand),
                satisfaction: power.satisfaction,
                productionRate: this.productionPerMin
            });
            if (this.telemetryHistory.length > 60) {
                this.telemetryHistory.shift();
            }
        }
    }
}
