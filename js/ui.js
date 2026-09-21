/**
 * UI Controller & Glass Component Interactivity
 * Nexus Automata
 */

import { BUILDINGS, DIRECTIONS, RECIPES, ITEMS, TECH_TREE, MILESTONES } from './data.js';
import { sound } from './audio.js';

export class UIController {
    constructor(worldGrid, simulation, renderer) {
        this.grid = worldGrid;
        this.sim = simulation;
        this.renderer = renderer;

        this.selectedTool = 'belt'; // default selected building
        this.selectedCategory = 'logistics';
        this.inspectingBuilding = null;
        this.inspectModalOpen = false;
        this.analyticsModalOpen = false;

        // Minimap
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

        this.initEventListeners();
        this.renderDock();
        this.renderTechTree();
    }

    initEventListeners() {
        // Category Pills
        const categoryPills = document.querySelectorAll('.dock-pill-btn');
        categoryPills.forEach(btn => {
            btn.addEventListener('click', () => {
                sound.playClick();
                categoryPills.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.dataset.category;
                this.renderDock();
            });
        });

        // Top HUD Buttons
        const analyticsBtn = document.getElementById('hud-analytics-btn');
        if (analyticsBtn) {
            analyticsBtn.addEventListener('click', () => {
                sound.playClick();
                this.openAnalyticsModal();
            });
        }

        const techBtn = document.getElementById('hud-tech-btn');
        if (techBtn) {
            techBtn.addEventListener('click', () => {
                sound.playClick();
                this.openModal('tech-modal');
                this.renderTechTree();
            });
        }

        const settingsBtn = document.getElementById('hud-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                sound.playClick();
                this.openModal('settings-modal');
            });
        }

        const atmoBtn = document.getElementById('hud-atmo-btn');
        if (atmoBtn) {
            const modes = ['day', 'sunset', 'night', 'cycle'];
            let atmoIdx = 0;
            atmoBtn.addEventListener('click', () => {
                sound.playClick();
                atmoIdx = (atmoIdx + 1) % modes.length;
                const mode = modes[atmoIdx];
                this.renderer.setAtmosphere(mode);
                const label = mode === 'cycle' ? 'AUTO DAY/NIGHT CYCLE' : mode.toUpperCase();
                this.showToast('Atmosphere Mode', `Lighting: ${label}`, 'info');
            });
        }

        const cinemaBtn = document.getElementById('hud-cinema-btn');
        if (cinemaBtn) {
            cinemaBtn.addEventListener('click', () => {
                sound.playClick();
                if (window.game) window.game.toggleCinematicMode();
            });
        }

        const audioBtn = document.getElementById('hud-audio-btn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const muted = sound.toggleMute();
                audioBtn.classList.toggle('active', !muted);
                this.showToast('Audio', muted ? 'Sound muted' : 'Sound unmuted', 'info');
            });
        }

        // Speed Buttons
        const speedButtons = document.querySelectorAll('.speed-btn');
        speedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                sound.playClick();
                speedButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const speed = parseFloat(btn.dataset.speed);
                this.sim.setGameSpeed(speed);
                this.showToast('Time Warp', `Game speed set to ${speed}x`, 'info');
            });
        });

        // Modal Close Buttons
        document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || el.classList.contains('modal-close-btn')) {
                    sound.playClick();
                    this.closeAllModals();
                }
            });
        });

        // Stop propagation inside modal card
        document.querySelectorAll('.modal-card').forEach(card => {
            card.addEventListener('click', e => e.stopPropagation());
        });

        // Save & Load buttons
        const saveBtn = document.getElementById('btn-save-game');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveGame());
        }

        const exportBtn = document.getElementById('btn-export-save');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSave());
        }

        const importBtn = document.getElementById('btn-import-save');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importSave());
        }

        const resetBtn = document.getElementById('btn-reset-game');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        const megafactoryBtn = document.getElementById('btn-load-megafactory');
        if (megafactoryBtn) {
            megafactoryBtn.addEventListener('click', () => {
                sound.playResearchUnlock();
                this.closeAllModals();
                if (window.game) {
                    window.game.loadMegafactoryDemo();
                }
                this.showToast('Megafactory Deployed', 'Full-scale automated industrial complex online!', 'success');
            });
        }

        // Space Elevator Milestone Banner click
        const milestoneBanner = document.getElementById('milestone-banner');
        if (milestoneBanner) {
            milestoneBanner.addEventListener('click', () => {
                sound.playClick();
                this.openModal('milestone-modal');
                this.renderMilestones();
            });
        }
    }

    renderDock() {
        const dockSlotsContainer = document.getElementById('dock-slots');
        if (!dockSlotsContainer) return;

        dockSlotsContainer.innerHTML = '';

        // Filter buildings matching selected category
        const available = Object.values(BUILDINGS).filter(b => b.category === this.selectedCategory);

        available.forEach((b, index) => {
            const slot = document.createElement('div');
            slot.className = `dock-slot ${this.selectedTool === b.id ? 'active' : ''} ${!b.unlocked ? 'locked' : ''}`;
            slot.dataset.tool = b.id;

            const keyNumber = index + 1;
            slot.innerHTML = `
                <span class="slot-key">${keyNumber <= 9 ? keyNumber : ''}</span>
                <div class="slot-icon">${this.getBuildingIconSVG(b.id)}</div>
                <span class="slot-name">${b.name}</span>
            `;

            slot.addEventListener('click', () => {
                if (!b.unlocked) {
                    this.showToast('Locked', `${b.name} requires further technological research!`, 'warning');
                    return;
                }
                sound.playClick();
                document.querySelectorAll('.dock-slot').forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
                this.selectedTool = b.id;
            });

            dockSlotsContainer.appendChild(slot);
        });
    }

    getBuildingIconSVG(toolId) {
        switch (toolId) {
            case 'select':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7 18 3-7 7-3L3 3z"/></svg>`;
            case 'demolish':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`;
            case 'belt':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 14l5-5 5 5"/></svg>`;
            case 'fast_belt':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 16l5-5 5 5M7 11l5-5 5 5"/></svg>`;
            case 'splitter':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#C084FC" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 18V6M7 9l5-3 5 3"/></svg>`;
            case 'merger':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 6l5 5 5-5M12 11v7"/></svg>`;
            case 'underground_belt':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>`;
            case 'miner':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2"><path d="M14 2l-4 4 4 4M4 14l4-4 4 4M2 22l8-8"/></svg>`;
            case 'smelter':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="12" r="4"/></svg>`;
            case 'assembler':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`;
            case 'coal_generator':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
            case 'solar_panel':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`;
            case 'power_pole':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M12 2v20M4 7h16M7 12h10"/></svg>`;
            case 'storage_silo':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="4"/><path d="M4 9h16M4 15h16"/></svg>`;
            case 'research_lab':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2"><path d="M10 2v7.31L4.5 19a2 2 0 001.72 3h15.56a2 2 0 001.72-3L14 9.31V2"/></svg>`;
            case 'space_elevator':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2"><path d="M12 2v20M8 8l4-6 4 6M6 18l6 4 6-4"/></svg>`;
            case 'inserter':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="18" r="3"/><path d="M12 15l4-7-3-4M16 8l3-1M13 4l-1-2"/></svg>`;
            case 'fast_inserter':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2"><circle cx="12" cy="18" r="3"/><path d="M12 15l-4-7 3-4M8 8l-3-1M11 4l1-2"/></svg>`;
            case 'conveyor_bridge':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2"><path d="M4 19V9h16v10M2 9h20M7 19v-4M17 19v-4"/></svg>`;
            case 'chemical_plant':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2"><path d="M6 2v6l-3 10a2 2 0 002 2h14a2 2 0 002-2L18 8V2M6 2h12M9 13h6"/></svg>`;
            default:
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8"/></svg>`;
        }
    }

    openModal(modalId) {
        this.closeAllModals();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
        this.inspectModalOpen = false;
        this.inspectingBuilding = null;
        this.analyticsModalOpen = false;
    }

    openInspector(building) {
        this.inspectingBuilding = building;
        this.inspectModalOpen = true;

        const modal = document.getElementById('inspector-modal');
        const titleEl = document.getElementById('inspector-title');
        const subtitleEl = document.getElementById('inspector-subtitle');
        const bodyEl = document.getElementById('inspector-body');

        if (!modal || !titleEl || !bodyEl) return;

        titleEl.textContent = building.def.name;
        subtitleEl.textContent = `Coordinates: (${building.x}, ${building.y}) • Tier ${building.size}x${building.size}`;

        this.updateInspectorContent();
        modal.classList.add('open');
    }

    updateInspectorContent() {
        if (!this.inspectingBuilding || !this.inspectModalOpen) return;
        const b = this.inspectingBuilding;
        const bodyEl = document.getElementById('inspector-body');
        if (!bodyEl) return;

        // Machine status label
        let statusBadge = `<span style="color: #10B981;">● Operational</span>`;
        if (b.status === 'no_power') statusBadge = `<span style="color: #EF4444;">● No Power (Connect to Grid)</span>`;
        else if (b.status === 'waiting_inputs') statusBadge = `<span style="color: #F59E0B;">● Waiting for Recipe Inputs</span>`;
        else if (b.status === 'blocked') statusBadge = `<span style="color: #F59E0B;">● Output Obstructed</span>`;
        else if (b.status === 'no_fuel') statusBadge = `<span style="color: #EF4444;">● Out of Coal Fuel</span>`;

        let html = `
            <div class="inspector-grid">
                <div class="inspector-card">
                    <span class="card-label">Current Status</span>
                    <span class="card-val" style="font-size: 13px;">${statusBadge}</span>
                </div>
                <div class="inspector-card">
                    <span class="card-label">Power Supply</span>
                    <span class="card-val">${Math.round(b.powerRatio * 100)}%</span>
                </div>
            </div>
        `;

        // If Smelter, Assembler, or Chemical Plant: show recipe selector and progress
        if (b.type === 'smelter' || b.type === 'assembler' || b.type === 'chemical_plant') {
            const applicableRecipes = Object.values(RECIPES).filter(r => r.machine === b.type);
            
            html += `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <span class="card-label">Select Active Recipe</span>
                    <select id="recipe-select" style="background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border-side); color: #fff; padding: 8px 12px; border-radius: 8px; font-family: var(--font-sans);">
                        ${applicableRecipes.map(r => `
                            <option value="${r.id}" ${b.recipe === r.id ? 'selected' : ''}>${r.name}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="glass-progress-wrapper">
                    <div class="glass-progress-label">
                        <span>Crafting Cycle Progress</span>
                        <span>${Math.round(b.progress * 100)}%</span>
                    </div>
                    <div class="glass-progress-track">
                        <div class="glass-progress-fill" style="width: ${Math.round(b.progress * 100)}%"></div>
                    </div>
                </div>

                <div style="display: flex; gap: 14px;">
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <span class="card-label">Input Buffer</span>
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            ${Object.entries(b.inventory.inputs).length === 0 ? '<span style="font-size: 11px; color: var(--text-dim);">Empty</span>' : ''}
                            ${Object.entries(b.inventory.inputs).map(([item, count]) => `
                                <div class="item-slot-display">
                                    <span class="item-slot-name">${ITEMS[item]?.name || item}</span>
                                    <span class="item-slot-count">x${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <span class="card-label">Output Buffer</span>
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            ${Object.entries(b.inventory.outputs).length === 0 ? '<span style="font-size: 11px; color: var(--text-dim);">Empty</span>' : ''}
                            ${Object.entries(b.inventory.outputs).map(([item, count]) => `
                                <div class="item-slot-display">
                                    <span class="item-slot-name">${ITEMS[item]?.name || item}</span>
                                    <span class="item-slot-count">x${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (b.type === 'inserter' || b.type === 'fast_inserter') {
            html += `
                <div class="inspector-card" style="margin-top: 8px;">
                    <span class="card-label">Gripper Arm Status</span>
                    <span class="card-val" style="font-size: 13px; color: ${b.heldItem ? '#38BDF8' : '#94A3B8'};">
                        ${b.heldItem ? ('Gripping ' + (ITEMS[b.heldItem]?.name || b.heldItem)) : 'Empty (Searching pickup tile)'}
                    </span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                    <span class="card-label">Smart Filter Item</span>
                    <select id="inserter-filter-select" style="background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border-side); color: #fff; padding: 8px 12px; border-radius: 8px; font-family: var(--font-sans);">
                        <option value="" ${!b.filterItem ? 'selected' : ''}>All Items (No Filter)</option>
                        ${Object.values(ITEMS).map(it => `
                            <option value="${it.id}" ${b.filterItem === it.id ? 'selected' : ''}>${it.name}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        } else if (b.type === 'storage_silo') {
            html += `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <span class="card-label">Silo Contents (Capacity 250)</span>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${Object.entries(b.inventory.inputs).length === 0 ? '<span style="font-size: 11px; color: var(--text-dim);">Empty</span>' : ''}
                        ${Object.entries(b.inventory.inputs).map(([item, count]) => `
                            <div class="item-slot-display">
                                <span class="item-slot-name">${ITEMS[item]?.name || item}</span>
                                <span class="item-slot-count">x${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Satisfactory-Style Machine Overclocking Control
        if (b.def.powerNeed !== undefined || b.type === 'miner' || b.type === 'smelter' || b.type === 'assembler' || b.type === 'chemical_plant' || b.type === 'inserter' || b.type === 'fast_inserter') {
            const basePower = b.def.powerNeed || 0;
            const clock = b.clockSpeed || 1.0;
            const currentPower = Math.round(basePower * Math.pow(clock, 1.6) * 10) / 10;

            html += `
                <div class="overclock-container" style="margin-top: 10px;">
                    <div class="overclock-header">
                        <span class="card-label" style="color: #F59E0B; font-weight: 700;">OVERCLOCK TUNING</span>
                        <span id="overclock-val-display" style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: #F59E0B;">
                            ${Math.round(clock * 100)}% (${clock.toFixed(1)}x Speed)
                        </span>
                    </div>
                    <input type="range" id="overclock-slider" class="overclock-slider" min="50" max="200" step="5" value="${Math.round(clock * 100)}">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">
                        <span>Power: ${currentPower} kW (Base: ${basePower} kW)</span>
                        <span>Formula: P ∝ Clock^1.6</span>
                    </div>
                    <div class="overclock-presets">
                        <button class="overclock-preset-btn ${clock === 0.5 ? 'active' : ''}" data-preset="0.5">50%</button>
                        <button class="overclock-preset-btn ${clock === 1.0 ? 'active' : ''}" data-preset="1.0">100%</button>
                        <button class="overclock-preset-btn ${clock === 1.5 ? 'active' : ''}" data-preset="1.5">150%</button>
                        <button class="overclock-preset-btn ${clock === 2.0 ? 'active' : ''}" data-preset="2.0">200%</button>
                    </div>
                </div>
            `;
        }

        // Action Demolish
        html += `
            <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                <button id="btn-inspector-demolish" class="btn-glass btn-danger">Deconstruct Machine</button>
            </div>
        `;

        bodyEl.innerHTML = html;

        // Recipe change listener
        const recipeSelect = document.getElementById('recipe-select');
        if (recipeSelect) {
            recipeSelect.addEventListener('change', (e) => {
                sound.playClick();
                b.recipe = e.target.value;
                b.progress = 0;
            });
        }

        // Filter item change listener
        const filterSelect = document.getElementById('inserter-filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                sound.playClick();
                b.filterItem = e.target.value || null;
            });
        }

        // Overclock slider listener
        const ocSlider = document.getElementById('overclock-slider');
        if (ocSlider) {
            ocSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                b.clockSpeed = val / 100;
                sound.playOverclockBeep();
                this.grid.updatePowerGrid();
                const disp = document.getElementById('overclock-val-display');
                if (disp) disp.textContent = `${val}% (${(val/100).toFixed(1)}x Speed)`;
            });
        }

        // Overclock preset buttons
        document.querySelectorAll('.overclock-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetClock = parseFloat(btn.dataset.preset);
                b.clockSpeed = targetClock;
                sound.playOverclockBeep();
                this.grid.updatePowerGrid();
                this.updateInspectorContent();
            });
        });

        // Demolish from inspector
        const demolishBtn = document.getElementById('btn-inspector-demolish');
        if (demolishBtn) {
            demolishBtn.addEventListener('click', () => {
                sound.playDemolish();
                this.grid.removeBuilding(b.x, b.y);
                this.closeAllModals();
                this.showToast('Deconstructed', 'Building was dismantled successfully.', 'info');
            });
        }
    }

    renderTechTree() {
        const container = document.getElementById('tech-tree-nodes');
        if (!container) return;

        container.innerHTML = '';

        TECH_TREE.forEach(tech => {
            const isUnlocked = tech.unlocked;
            const isResearching = this.sim.activeTech?.id === tech.id;
            
            // Check prerequisites
            const reqsMet = !tech.requires || tech.requires.every(reqId => {
                const reqTech = TECH_TREE.find(t => t.id === reqId);
                return reqTech && reqTech.unlocked;
            });

            const card = document.createElement('div');
            card.className = `tech-node-card ${isUnlocked ? 'unlocked' : ''} ${isResearching ? 'researching' : ''} ${!reqsMet && !isUnlocked ? 'locked' : ''}`;

            const costText = Object.entries(tech.cost).map(([item, count]) => `${count}x ${ITEMS[item]?.name || item}`).join(', ') || 'Free';

            card.innerHTML = `
                <div class="tech-info">
                    <div class="tech-icon-box">${this.getBuildingIconSVG(tech.iconCode || 'assembler')}</div>
                    <div class="tech-texts">
                        <span class="tech-name">${tech.name} ${isUnlocked ? '[RESEARCHED]' : ''}</span>
                        <span class="tech-desc">${tech.description}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="tech-cost-badge">${isUnlocked ? 'Completed' : costText}</span>
                    ${!isUnlocked && reqsMet ? `
                        <button class="btn-glass ${isResearching ? 'btn-secondary' : 'btn-primary'}" style="padding: 6px 14px; font-size: 11px;">
                            ${isResearching ? 'Active' : 'Initiate'}
                        </button>
                    ` : ''}
                </div>
            `;

            if (!isUnlocked && reqsMet) {
                card.addEventListener('click', () => {
                    sound.playClick();
                    this.sim.setActiveTech(tech.id);
                    this.renderTechTree();
                    this.showToast('Research Initiated', `Active project: ${tech.name}`, 'info');
                });
            }

            container.appendChild(card);
        });
    }

    renderMilestones() {
        const body = document.getElementById('milestone-body');
        if (!body) return;

        const currentIdx = this.sim.currentMilestoneIdx;
        let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';

        MILESTONES.forEach((m, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const delivered = isCurrent ? this.sim.milestoneDelivered : (isDone ? m.targetAmount : 0);
            const percent = Math.min(100, Math.round((delivered / m.targetAmount) * 100));

            html += `
                <div style="background: var(--glass-card); border: 1px solid ${isCurrent ? 'var(--glass-border-accent)' : 'var(--glass-border-side)'}; border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; font-size: 14px;">${m.title} ${isDone ? '[COMPLETED]' : ''}</span>
                        <span style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan);">${delivered} / ${m.targetAmount} ${ITEMS[m.requirementItem]?.name || m.requirementItem}</span>
                    </div>
                    <div class="glass-progress-track">
                        <div class="glass-progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <span style="font-size: 11px; color: var(--text-secondary);">Colony Reward: ${m.reward}</span>
                </div>
            `;
        });

        html += '</div>';
        body.innerHTML = html;
    }

    updateHUD() {
        // Power Telemetry
        const power = this.grid.getGlobalPowerTelemetry();
        const powerBadgeVal = document.getElementById('hud-power-val');
        if (powerBadgeVal) {
            powerBadgeVal.textContent = `${Math.round(power.capacity)} / ${Math.round(power.demand)} kW`;
        }

        // Production Per Min
        const prodVal = document.getElementById('hud-prod-val');
        if (prodVal) {
            prodVal.textContent = `${this.sim.productionPerMin}/min`;
        }

        // Active Tech Header
        const activeTechText = document.getElementById('hud-active-tech-text');
        if (activeTechText) {
            if (this.sim.activeTech) {
                let neededTotal = 1;
                for (const cnt of Object.values(this.sim.activeTech.cost)) neededTotal = cnt;
                activeTechText.textContent = `LAB: ${this.sim.activeTech.name} (${this.sim.techProgress}/${neededTotal})`;
            } else {
                activeTechText.textContent = `LAB: Standing By`;
            }
        }

        // Milestone Banner
        const milestoneTargetText = document.getElementById('milestone-target-text');
        const milestone = MILESTONES[this.sim.currentMilestoneIdx];
        if (milestoneTargetText && milestone) {
            milestoneTargetText.textContent = `${milestone.title}: ${this.sim.milestoneDelivered} / ${milestone.targetAmount} ${ITEMS[milestone.requirementItem]?.name || milestone.requirementItem}`;
        }

        // Update inspector content if open
        if (this.inspectModalOpen) {
            this.updateInspectorContent();
        }

        // Update analytics modal if open
        if (this.analyticsModalOpen) {
            this.updateAnalyticsContent();
        }

        // Minimap render
        this.renderMinimap();
    }

    openAnalyticsModal() {
        this.closeAllModals();
        this.analyticsModalOpen = true;
        const modal = document.getElementById('analytics-modal');
        if (modal) {
            modal.classList.add('open');
            this.updateAnalyticsContent();
        }
    }

    updateAnalyticsContent() {
        if (!this.analyticsModalOpen) return;

        const power = this.grid.getGlobalPowerTelemetry();
        const capEl = document.getElementById('analytics-cap-val');
        const demEl = document.getElementById('analytics-demand-val');
        const satEl = document.getElementById('analytics-satisfaction-val');
        const prodEl = document.getElementById('analytics-prod-val');

        if (capEl) capEl.textContent = `${Math.round(power.capacity)} kW`;
        if (demEl) demEl.textContent = `${Math.round(power.demand)} kW`;
        if (satEl) {
            const pct = Math.round(power.satisfaction * 100);
            satEl.textContent = `${pct}%`;
            satEl.style.color = pct >= 100 ? '#10B981' : (pct >= 50 ? '#F59E0B' : '#EF4444');
        }
        if (prodEl) prodEl.textContent = `${this.sim.productionPerMin} / min`;

        // Render Power Grid Time-Series Canvas
        this.renderPowerChart();

        // Render Commodity Throughput Breakdown Canvas
        this.renderThroughputChart();
    }

    renderPowerChart() {
        const canvas = document.getElementById('power-chart-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const history = this.sim.telemetryHistory;
        if (!history || history.length < 2) {
            ctx.fillStyle = '#64748B';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Accumulating telemetry samples... (sampling every 1s)', w / 2, h / 2);
            return;
        }

        const padding = { top: 20, right: 30, bottom: 25, left: 50 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        // Find max power in window
        let maxVal = 60;
        history.forEach(pt => {
            if (pt.capacity > maxVal) maxVal = pt.capacity;
            if (pt.demand > maxVal) maxVal = pt.demand;
        });
        maxVal = Math.ceil(maxVal * 1.25);

        // Draw horizontal grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#64748B';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';

        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            const yVal = (maxVal / steps) * i;
            const yPos = padding.top + chartH - (i / steps) * chartH;
            ctx.beginPath();
            ctx.moveTo(padding.left, yPos);
            ctx.lineTo(w - padding.right, yPos);
            ctx.stroke();
            ctx.fillText(`${Math.round(yVal)} kW`, padding.left - 8, yPos + 3);
        }

        const getX = (idx) => padding.left + (idx / (history.length - 1)) * chartW;
        const getY = (val) => padding.top + chartH - (val / maxVal) * chartH;

        // Draw Capacity Area & Line (Orange)
        ctx.beginPath();
        history.forEach((pt, i) => {
            const x = getX(i);
            const y = getY(pt.capacity);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw Demand Line (Red/Pink)
        ctx.beginPath();
        history.forEach((pt, i) => {
            const x = getX(i);
            const y = getY(pt.demand);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Time axis labels
        ctx.fillStyle = '#64748B';
        ctx.textAlign = 'left';
        ctx.fillText('-60s ago', padding.left, h - 6);
        ctx.textAlign = 'right';
        ctx.fillText('Live (Now)', w - padding.right, h - 6);
    }

    renderThroughputChart() {
        const canvas = document.getElementById('throughput-chart-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Calculate machine production rates
        const itemRates = {};
        this.grid.buildingList.forEach(b => {
            if (b.status === 'working') {
                if (b.recipe && RECIPES[b.recipe]) {
                    const r = RECIPES[b.recipe];
                    const speedMult = (b.clockSpeed || 1.0) * (b.powerRatio || 1.0);
                    for (const [outItem, qty] of Object.entries(r.outputs)) {
                        const ratePerMin = (qty / r.duration) * 60 * speedMult;
                        itemRates[outItem] = (itemRates[outItem] || 0) + ratePerMin;
                    }
                } else if (b.type === 'miner') {
                    const tile = this.grid.getTile(b.x, b.y);
                    if (tile && tile.type) {
                        const ratePerMin = (b.def.speed || 1.0) * 60 * (b.clockSpeed || 1.0) * (b.powerRatio || 1.0);
                        itemRates[tile.type] = (itemRates[tile.type] || 0) + ratePerMin;
                    }
                }
            }
        });

        const commodities = [
            { id: 'iron_ingot', color: '#CBD5E1', name: 'Iron Ingot' },
            { id: 'copper_ingot', color: '#EA580C', name: 'Copper Ingot' },
            { id: 'iron_gear', color: '#94A3B8', name: 'Gear' },
            { id: 'copper_wire', color: '#F97316', name: 'Wire' },
            { id: 'circuit', color: '#10B981', name: 'Circuit' },
            { id: 'plastic', color: '#F1F5F9', name: 'Plastic' },
            { id: 'battery', color: '#EAB308', name: 'Battery' },
            { id: 'science_pack_1', color: '#38BDF8', name: 'Science 1' }
        ];

        let maxRate = 40;
        commodities.forEach(c => {
            const r = itemRates[c.id] || 0;
            if (r > maxRate) maxRate = r;
        });

        const padding = { left: 85, right: 40, top: 12, bottom: 8 };
        const barHeight = 11;
        const barSpacing = (h - padding.top - padding.bottom) / commodities.length;

        commodities.forEach((c, idx) => {
            const rate = itemRates[c.id] || 0;
            const y = padding.top + idx * barSpacing;

            ctx.fillStyle = '#94A3B8';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(c.name, padding.left - 10, y + 9);

            const trackW = w - padding.left - padding.right - 45;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.fillRect(padding.left, y, trackW, barHeight);

            const fillW = Math.min(trackW, (rate / maxRate) * trackW);
            if (fillW > 0) {
                ctx.fillStyle = c.color;
                ctx.fillRect(padding.left, y, fillW, barHeight);
            }

            ctx.fillStyle = '#F8FAFC';
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`${Math.round(rate)}/m`, padding.left + trackW + 8, y + 9);
        });
    }

    renderMinimap() {
        if (!this.minimapCtx) return;
        const ctx = this.minimapCtx;
        const w = this.minimapCanvas.width;
        const h = this.minimapCanvas.height;

        ctx.fillStyle = '#06070B';
        ctx.fillRect(0, 0, w, h);

        const scaleX = w / this.grid.width;
        const scaleY = h / this.grid.height;

        // Draw ore deposits
        for (let y = 0; y < this.grid.height; y += 2) {
            for (let x = 0; x < this.grid.width; x += 2) {
                const t = this.grid.terrain[y][x];
                if (t) {
                    ctx.fillStyle = ITEMS[t.type]?.color || '#FFFFFF';
                    ctx.fillRect(x * scaleX, y * scaleY, scaleX * 2, scaleY * 2);
                }
            }
        }

        // Draw buildings
        this.grid.buildingList.forEach(b => {
            ctx.fillStyle = b.type === 'power_pole' ? '#F59E0B' : '#38BDF8';
            ctx.fillRect(b.x * scaleX, b.y * scaleY, Math.max(2, b.size * scaleX), Math.max(2, b.size * scaleY));
        });

        // Viewport camera rectangle
        const camTileX = (this.renderer.camera.x / this.grid.tileSize);
        const camTileY = (this.renderer.camera.y / this.grid.tileSize);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect((camTileX - 10) * scaleX, (camTileY - 8) * scaleY, 20 * scaleX, 16 * scaleY);
    }

    showToast(title, msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'glass-toast';

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
        } else if (type === 'warning') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>`;
        } else {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
        }

        toast.innerHTML = `
            <div class="toast-icon ${type}">${iconSvg}</div>
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-msg">${msg}</span>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    saveGame() {
        const data = {
            buildings: this.grid.buildingList.map(b => ({
                type: b.type,
                x: b.x,
                y: b.y,
                direction: b.direction,
                recipe: b.recipe,
                inventory: b.inventory
            })),
            tech: TECH_TREE.map(t => ({ id: t.id, unlocked: t.unlocked })),
            activeTechId: this.sim.activeTech?.id || null,
            techProgress: this.sim.techProgress,
            milestoneIdx: this.sim.currentMilestoneIdx,
            milestoneDelivered: this.sim.milestoneDelivered
        };

        localStorage.setItem('nexus_automata_save', JSON.stringify(data));
        sound.playClick();
        this.showToast('Game Saved', 'Factory state saved to local storage.', 'success');
    }

    loadGame() {
        const saved = localStorage.getItem('nexus_automata_save');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            
            // Clear current buildings
            this.grid.buildings.clear();
            this.grid.buildingList = [];

            // Restore buildings
            data.buildings.forEach(b => {
                const created = this.grid.placeBuilding(b.type, b.x, b.y, b.direction);
                if (created) {
                    if (b.recipe) created.recipe = b.recipe;
                    if (b.inventory) created.inventory = b.inventory;
                }
            });

            // Restore tech
            if (data.tech) {
                data.tech.forEach(t => {
                    const found = TECH_TREE.find(item => item.id === t.id);
                    if (found) found.unlocked = t.unlocked;
                });
            }

            if (data.activeTechId) {
                this.sim.setActiveTech(data.activeTechId);
                this.sim.techProgress = data.techProgress || 0;
            }

            this.sim.currentMilestoneIdx = data.milestoneIdx || 0;
            this.sim.milestoneDelivered = data.milestoneDelivered || 0;

            this.renderDock();
            this.renderTechTree();
            return true;
        } catch (e) {
            console.error("Failed to load save", e);
            return false;
        }
    }

    exportSave() {
        this.saveGame();
        const saved = localStorage.getItem('nexus_automata_save');
        if (saved) {
            navigator.clipboard.writeText(saved);
            this.showToast('Copied to Clipboard', 'Save string copied! You can share or back it up.', 'success');
        }
    }

    importSave() {
        const code = prompt("Paste your save string JSON here:");
        if (code) {
            try {
                localStorage.setItem('nexus_automata_save', code);
                this.loadGame();
                this.showToast('Imported', 'Save game imported successfully!', 'success');
            } catch (e) {
                this.showToast('Error', 'Invalid save code provided.', 'warning');
            }
        }
    }

    resetGame() {
        if (confirm("Are you sure you want to reset your entire factory and restart?")) {
            localStorage.removeItem('nexus_automata_save');
            window.location.reload();
        }
    }
}
