# Changelog

All notable changes to **Nexus Automata** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.6.0] - 2026-09-21

### Added
- **Authentic Open-Source 3D Model Integration (Kenney CC0 Public Domain)**:
  - Replaced procedural scratch-built primitive models with 180 imported open-source 3D GLB assets from Kenney CC0 Factory and Industrial Kits.
  - Built an asynchronous Three.js `GLTFLoader` pipeline with deep shadow casting and receiving, runtime geometry cloning, and instant mesh updates.
  - Fully upgraded all building and tool models:
    - `belt` & `fast_belt`: imported `conveyor.glb` & `conveyor-stripe.glb` with moving industrial chevron tread textures.
    - `splitter` & `merger`: imported `conveyor-cross.glb` and `conveyor-junction-t.glb`.
    - `smart_splitter`: imported `conveyor-cross.glb` combined with `scanner-low.glb`.
    - `inserter`, `fast_inserter`, and `long_inserter`: imported `robot-arm-a.glb` and `robot-arm-b.glb` with dynamic swinging and item container parenting.
    - `smelter`: imported `machine.glb` with `chimney-large.glb` and pulsating molten hearth.
    - `assembler`: imported `machine-bed.glb` and articulated `robot-arm-b.glb`.
    - `foundry`: imported `machine-fortified.glb` with dual `chimney-large.glb` and molten slag runner channel.
    - `manufacturer`: imported `machine-fortified.glb` with pneumatic `piston-round.glb` and industrial manifold pipes.
    - `chemical_plant`: imported `detail-tank-large.glb`, `chimney-medium.glb`, and bioluminescent fluid reaction column.
    - `coal_generator`: imported `building-a.glb` and `chimney-large.glb`.
    - `solar_panel`: imported `solar-panel-landscape-group.glb`.
    - `wind_turbine`: imported `windmill.glb` with spinning aerodynamic 3-blade rotor hub.
    - `nuclear_reactor`: imported `building-f.glb`, `detail-tank-large.glb`, and glowing Cherenkov radiation core pool.
    - `storage_silo` & `storage_silo_mk2`: imported `detail-tank-large.glb` and `hopper-high-round.glb`.
    - `research_lab`: imported `building-c.glb` with twin rotating holographic quantum rings.
    - `demolish`: 3D demolition drone with twin emitter lasers and plasma core.
- **Real 3D Tool & Building Forms in UI (Replaced Flat 2D Icons)**:
  - Eliminated flat 2D icons in the hotbar dock; slots now display the actual 3D model form of each tool and building rendered offscreen via Three.js with studio 3-point lighting and isometric camera framing.
  - Hotbar hover tooltips display a large high-resolution 3D model preview with subtle elevation and soft glow.
  - Technology tree research cards display 3D model previews of each technology's unlocked building.
- **Completed Machine Diagnostics & Inspector Controls**:
  - Machine Inspector modal now features an illuminated 3D hero model of the inspected facility.
  - Added complete diagnostics and recipe selection for `foundry`, `manufacturer`, and `greenhouse` with live input/output buffers and crafting cycle progress meters.
  - Added programmable Left and Right sorting filter selectors for `smart_splitter`.
  - Added battery reserve gauge meter (`XXXX / 5000 kJ`) and grid transfer status for `accumulator`.
  - Added uranium fuel rod burn timer and +280 kW power output meter for `nuclear_reactor`.
  - Added coal fuel burn timer and +50 kW power output meter for `coal_generator`.
  - Added itemized storage breakdown and capacity tracking for `storage_silo` and `storage_silo_mk2`.
- **Precision Pipette Tool (`Q`)**:
  - Fixed cursor coordinate sampling so pressing `Q` samples the exact building directly beneath the mouse pointer.
  - Automatically synchronizes active category tabs and highlights the selected tool in the hotbar dock.
- **Cache Invalidation & Version Bump**:
  - Bumped to `v=32` across CSS and ES module imports, package version 1.6.0.

---

## [1.5.0] - 2026-09-21

### Fixed
- **Catastrophic Giant Toast SVG Icon Bug**:
  - Eliminated unconstrained SVGs inside toast notifications that expanded to 100% viewport width, blocking the entire screen with giant checkmarks and circles.
  - Enforced strict CSS constraints in `css/components.css` (`.toast-container svg, .toast-card svg, .glass-toast svg { width: 18px !important; height: 18px !important; }`), bound toast icons inside 20x20px rigid flex containers, and added inline `width="18" height="18"` directly onto SVG elements.
  - Fixed erroneous "Locked" warning on `Inspect / Select` and `Deconstruct / Demolish` tools by adding `unlocked: true` and bypassing unlock checks for tool-category items (`!b.unlocked && !b.isTool`).

### Added
- **Major Industrial Variants Expansion (11 New Buildings)**:
  - **Logistics**:
    - `smart_splitter`: 3-way sorting junction with programmable optical filter scanner for Left, Right, and Straight lanes.
    - `long_inserter`: Long-reach articulated robotic arm spanning 2 grid tiles with crimson steel chassis.
    - `conveyor_lift`: Vertical pneumatic lift tower transporting items across elevation planes at 2.6 tiles/sec.
    - `belt_crossing`: 4-way grade intersection allowing perpendicular conveyor lines to cross seamlessly without mingling.
  - **Advanced Production**:
    - `foundry`: Dual-furnace 3x3 heavy blast alloy foundry with molten slag channel and dual exhaust stacks for smelting titanium and high-strength steel alloys.
    - `manufacturer`: 4-feeder heavy industrial plant (3x3) with reciprocating hydraulic stamping ram producing microprocessors, heavy frames, and quantum cubes.
    - `greenhouse`: Geodesic bio-dome (2x2) with circular growth bed and central violet UV grow lamp cultivating algae and biomass for renewable hydrocarbons.
  - **Power & Energy Storage**:
    - `wind_turbine`: 5.5m slender composite mast with spinning 3-blade aerodynamic rotor generating continuous 15 kW clean power anywhere on terrain.
    - `nuclear_reactor`: Colossal 3x3 fission plant featuring a massive cooling tower with Cherenkov radiation core pool, pressure containment vessel, control rod actuators, and billowing white steam puffs, generating 280 kW from refined uranium fuel rods.
    - `accumulator`: High-voltage battery bank (2x2) with 4 power capacitors and a 5-stage LED charge level meter that automatically absorbs surplus energy and discharges up to 75 kW during grid deficits.
  - **Bulk Storage**:
    - `storage_silo_mk2`: Reinforced cylindrical silo (2x2) boasting an 800-item buffer capacity.
- **New Materials, Items & Recipes**:
  - Items: `titanium_ore`, `uranium_ore`, `titanium_plate`, `microprocessor`, `heavy_frame`, `fuel_rod`, `quantum_cube`, `biomass`.
  - Recipes: `smelt_titanium`, `smelt_steel_alloy`, `craft_heavy_frame`, `craft_microprocessor`, `craft_quantum_cube`, `refine_fuel_rod`, `cultivate_biomass`.
  - Physical Conveyor Meshes: Added physical 3D meshes for all 8 new items on moving conveyor belts.
- **Expanded Technology Tree (7 New Researches)**:
  - `renewable_energy` (Aero Kinetic Generation)
  - `smart_logistics` (Intelligent Sorting & Routing)
  - `advanced_metallurgy` (Heavy Blast Metallurgy)
  - `energy_storage` (Grid Accumulators)
  - `heavy_industry` (Precision Heavy Manufacturing)
  - `synthetic_biofuel` (Hydroponic Cultivation)
  - `nuclear_power` (Nuclear Fission Power)
- **Browser Cache Invalidation**:
  - Bumped asset versioning across `index.html` and ES module imports in `js/main.js` to `?v=31`.

---

## [1.4.0] - 2026-09-21

### Added
- **Tactical CAD Industrial HUD Overhaul (Anti-Glassmorphism)**:
  - Complete elimination of blurry glassmorphism, transparent bubble filters, and unconstrained text inside slots in favor of a gritty, precision-engineered industrial CAD interface inspired by *Satisfactory*, *Factorio*, and *Shapez 2*.
  - **Clean Hotbar Slots**: Compact 48×48px matte carbon slots with crisp SVG building icons and corner hotkey indicators `[1-8]`.
  - **Precision Hover Tooltips**: Floating technical info cards rendered *above* the hotbar showing building name, hotkey, resource cost (e.g. `1× iron ingot`), power demand/generation (`kW`), speed, and operational description with zero text spill or overlapping.
  - **Docked Industrial Category Tabs**: Flush category tabs (`LOGISTICS`, `PRODUCTION`, `POWER GRID`, `SPECIALIZED`, `TOOLS`) docked directly on top of the hotbar dock, with full keyboard `Tab` cycle navigation.
  - **Collapsible Survey Radar**: Added a minimize toggle (`_` / `+`) to the 80x80 survey radar header to collapse the minimap canvas and free up top-right screen real estate on demand.
  - **Docked Bottom-Right Status Controls**: Converted floating controls panel into a sleek, non-intrusive 24px docked status strip with click-to-collapse functionality.
  - **Full Cinematic HUD Toggle**: Added an Eye icon button to the top HUD and keyboard shortcut `H` to toggle minimal HUD mode, hiding all interface elements for 100% unobstructed 3D megafactory observation with a subtle restore banner.

### Fixed
- **Blank Screen Root Cause**: Restored essential `libs/three.core.js` module dependency required by `three.module.js`, guaranteeing reliable scene initialization and preventing 404 module import failures.
- **Three.js Shadow Map Deprecation**: Upgraded shadow map configuration from deprecated `PCFSoftShadowMap` to `PCFShadowMap`, eliminating WebGL console warnings.
- **Aggressive Browser Cache Invalidation**: Synchronized all CSS stylesheets and ES module imports to `?v=30`, ensuring instant update propagation across all browser sessions without stale cached script collisions.

---

## [1.3.0] - 2026-09-21

### Added
- **Space Elevator Orbital Launch Cinematic**:
  - Procedural 3D Orbital Transport Capsule pod docked at the elevator platform, complete with aerodynamic hull, stabilizer fins, cockpit sensor dome, and ion propulsion thruster.
  - Dynamic launch ascent sequence upon milestone delivery completion: pod accelerates up the orbital tether beam into the stratosphere with glowing ion plume and exhaust smoke.
  - Tower summit aviation warning beacons with pulsing red emissive illumination.
- **Procedural Sound Engine Expansion**:
  - Synthesized deep `playRocketLaunch()` audio sequence combining sub-bass sawtooth engine rumble with dynamically filtered aerodynamic white noise rush.
- **Holographic Building Placement System**:
  - Directional output indicators dynamically positioned according to machine footprint.
  - Real-time validity tinting (emerald valid / crimson invalid) with snap-grid alignment.
- **Simulation & Engine Orchestration**:
  - Implemented `handleSimEvent()` to coordinate milestone launch events, research unlocks, and live toast notifications.
  - Robust exception recovery in main 60 FPS animation loop.
  - Added `preserveDrawingBuffer` to Three.js WebGL renderer for buffer persistence and canvas compositing.
  - Fixed camera coordinate math on the 80x80 survey radar minimap.

---

## [1.2.0] - 2026-09-21

### Added
- **Public GitHub Repository Setup**: Configured repository, version control, automated static asset hosting compatibility, and structured semantic release workflow.
- **Factory Telemetry & Analytics Dashboard**:
  - Live production rate metrics per minute.
  - Energy consumption vs. generation breakdown and brownout alerts.
  - Interactive machine overclocking sliders with power draw scaling.
- **Advanced 3D Industrial Machine Models**:
  - Procedural 3D animated mining drills with spinning drill bits and ore pulverizer bays.
  - Smelters with interior molten glow emissive maps, chimney heat distortion, and smoke particles.
  - Automated Workshops (Assemblers) with multi-axis mechanical articulated arms, robotic welding sparks, and indicator beacons.
  - Space Elevator with colossal 4-pillar foundation, glowing energy core, and vertical orbital tether beam reaching into the stratosphere.
  - Storage Silos with transparent acrylic viewing windows displaying stored item fill levels in real time.
- **Atmospheric Lighting & Environment Enhancements**:
  - Dynamic astronomical sun sphere with realistic day/sunset/night orbital lighting.
  - Instanced lush grass field with wind sway animation.
  - Volumetric clouds drifting across mountain peaks.
  - Twinkling night sky starfield with northern aurora borealis ribbons.
- **Cache-Busting Pipeline**: Automated script versioning preventing stale browser module caching.

### Changed
- Refactored `models3d.js` to utilize reusable buffer geometries and instanced meshes for optimal 60 FPS performance under dense factory layouts.
- Updated `package.json` with comprehensive metadata and run scripts.
- Streamlined `libs/` directory to retain pure modern ES module builds (`three.module.js`), reducing bundle size.

---

## [1.1.0] - 2026-09-20

### Added
- **Three.js WebGL 3D Engine Migration**:
  - Full conversion from 2D canvas to 3D perspective world.
  - Free-floating isometric orbit camera with WASD pan, edge scroll, and smooth zoom.
  - Real-time soft shadows (`PCFSoftShadowMap`) and tone mapping (`ACESFilmicToneMapping`).
- **Procedural 3D Terrain & Voxel Relief**:
  - Height-mapped undulating terrain with plateaus, ore vein outcrops, water shores, and mountain ridges.
  - 3D trees (conifers and broadleafs) and boulder formations dynamically populating wilderness zones.
- **3D Conveyor Belts & Real-Time Item Transport**:
  - Roller belts with animated tread textures and mechanical directional arrows.
  - 3D ore and component models (Iron Ore, Copper Ore, Coal, Ingots, Circuits, Gear wheels) moving seamlessly along belts.
  - Underground conveyor tunnel portals with glowing entryways.
  - 3D physical splitters and mergers with directional flippers.
- **Catenary Power Grid**:
  - 3D electrical substation transmission towers.
  - Physics-curved 3D catenary hanging electrical cables connecting power poles across the factory.

---

## [1.0.0] - 2026-09-20

### Added
- **Core Factory Simulation**:
  - Grid-based logistics and production loop inspired by Factorio, Satisfactory, and Builderment.
  - Mining Drills for Iron, Copper, Coal, Stone, and Crystals.
  - Smelters for Iron & Copper Ingots and Steel Plates.
  - Assemblers for basic and advanced components (Gears, Wires, Circuits, Motors, Science Packs).
- **Power Grid Management**:
  - Coal Generators and Solar Arrays.
  - Power grid connectivity network with brownout slowdown mechanics.
- **Tech Tree Research System**:
  - Multi-tier scientific progression unlocking advanced logistics and automation.
- **Orbital Space Elevator Milestone Progression**:
  - Phased planetary export objectives for industrial victory.
- **Procedural Audio Engine**:
  - Zero-dependency Web Audio API synthesizer for machine hums, conveyor clatter, and placement sounds.
- **Save & Load System**:
  - Automatic persistent save to `localStorage` and JSON export/import.
