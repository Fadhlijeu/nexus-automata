# Changelog

All notable changes to **Nexus Automata** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
