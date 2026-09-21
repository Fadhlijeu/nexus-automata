/**
 * Game Database: Items, Recipes, Buildings, and Tech Tree
 * Nexus Automata (100% Zero-Emoji Industrial Standard)
 */

export const DIRECTIONS = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};

export const DIR_OFFSET = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: 0 },  // East
    { dx: 0, dy: 1 },  // South
    { dx: -1, dy: 0 }  // West
];

export const ITEMS = {
    iron_ore: { id: 'iron_ore', name: 'Iron Ore', color: '#94A3B8', raw: true, iconCode: 'ore-iron' },
    copper_ore: { id: 'copper_ore', name: 'Copper Ore', color: '#FB923C', raw: true, iconCode: 'ore-copper' },
    coal: { id: 'coal', name: 'Coal Deposit', color: '#475569', raw: true, fuelValue: 40, iconCode: 'coal' },
    stone: { id: 'stone', name: 'Raw Stone', color: '#A8A29E', raw: true, iconCode: 'stone' },
    crystal: { id: 'crystal', name: 'Rare Crystal', color: '#C084FC', raw: true, iconCode: 'crystal' },
    titanium_ore: { id: 'titanium_ore', name: 'Titanium Ore', color: '#38BDF8', raw: true, iconCode: 'ore-titanium' },
    uranium_ore: { id: 'uranium_ore', name: 'Uranium Ore', color: '#84CC16', raw: true, iconCode: 'ore-uranium' },
    
    iron_ingot: { id: 'iron_ingot', name: 'Iron Ingot', color: '#CBD5E1', iconCode: 'ingot-iron' },
    copper_ingot: { id: 'copper_ingot', name: 'Copper Ingot', color: '#F97316', iconCode: 'ingot-copper' },
    stone_brick: { id: 'stone_brick', name: 'Stone Brick', color: '#D6D3D1', iconCode: 'brick' },
    steel_plate: { id: 'steel_plate', name: 'Steel Plate', color: '#64748B', iconCode: 'plate-steel' },
    titanium_plate: { id: 'titanium_plate', name: 'Titanium Plate', color: '#0284C7', iconCode: 'plate-titanium' },

    copper_wire: { id: 'copper_wire', name: 'Copper Wire', color: '#FDBA74', iconCode: 'wire-copper' },
    iron_gear: { id: 'iron_gear', name: 'Iron Gear', color: '#E2E8F0', iconCode: 'gear' },
    circuit: { id: 'circuit', name: 'Electronic Circuit', color: '#34D399', iconCode: 'circuit' },
    microprocessor: { id: 'microprocessor', name: 'Microprocessor', color: '#06B6D4', iconCode: 'microprocessor' },
    rotor: { id: 'rotor', name: 'Electric Motor', color: '#60A5FA', iconCode: 'motor' },
    heavy_frame: { id: 'heavy_frame', name: 'Heavy Modular Frame', color: '#475569', iconCode: 'heavy-frame' },

    science_pack_1: { id: 'science_pack_1', name: 'Automation Science', color: '#38BDF8', iconCode: 'science-1' },
    science_pack_2: { id: 'science_pack_2', name: 'Logistics Science', color: '#A855F7', iconCode: 'science-2' },
    plastic: { id: 'plastic', name: 'Polymer Plastic', color: '#F1F5F9', iconCode: 'plastic' },
    battery: { id: 'battery', name: 'High-Capacity Battery', color: '#10B981', iconCode: 'battery' },
    biomass: { id: 'biomass', name: 'Bio-Organic Fuel', color: '#15803D', fuelValue: 60, iconCode: 'biomass' },
    fuel_rod: { id: 'fuel_rod', name: 'Uranium Fuel Rod', color: '#22C55E', fuelValue: 400, iconCode: 'fuel-rod' },
    space_capsule: { id: 'space_capsule', name: 'Orbital Payload', color: '#F43F5E', iconCode: 'payload' },
    quantum_cube: { id: 'quantum_cube', name: 'Quantum Processor Cube', color: '#E11D48', iconCode: 'quantum-cube' }
};

export const RECIPES = {
    // Smelter Recipes
    smelt_iron: {
        id: 'smelt_iron',
        name: 'Smelt Iron Ingot',
        machine: 'smelter',
        inputs: { iron_ore: 1 },
        outputs: { iron_ingot: 1 },
        duration: 1.8 // seconds
    },
    smelt_copper: {
        id: 'smelt_copper',
        name: 'Smelt Copper Ingot',
        machine: 'smelter',
        inputs: { copper_ore: 1 },
        outputs: { copper_ingot: 1 },
        duration: 1.8
    },
    smelt_stone: {
        id: 'smelt_stone',
        name: 'Smelt Stone Brick',
        machine: 'smelter',
        inputs: { stone: 1 },
        outputs: { stone_brick: 1 },
        duration: 2.0
    },
    smelt_steel: {
        id: 'smelt_steel',
        name: 'Smelt Steel Plate',
        machine: 'smelter',
        inputs: { iron_ingot: 2, coal: 1 },
        outputs: { steel_plate: 1 },
        duration: 3.5
    },

    // Assembler Recipes
    craft_wire: {
        id: 'craft_wire',
        name: 'Copper Wire (x2)',
        machine: 'assembler',
        inputs: { copper_ingot: 1 },
        outputs: { copper_wire: 2 },
        duration: 1.0
    },
    craft_gear: {
        id: 'craft_gear',
        name: 'Iron Gear',
        machine: 'assembler',
        inputs: { iron_ingot: 2 },
        outputs: { iron_gear: 1 },
        duration: 1.5
    },
    craft_circuit: {
        id: 'craft_circuit',
        name: 'Electronic Circuit',
        machine: 'assembler',
        inputs: { iron_ingot: 1, copper_wire: 3 },
        outputs: { circuit: 1 },
        duration: 2.0
    },
    craft_rotor: {
        id: 'craft_rotor',
        name: 'Electric Motor',
        machine: 'assembler',
        inputs: { steel_plate: 1, iron_gear: 2 },
        outputs: { rotor: 1 },
        duration: 2.8
    },
    craft_science_1: {
        id: 'craft_science_1',
        name: 'Automation Science',
        machine: 'assembler',
        inputs: { iron_gear: 1, copper_wire: 2 },
        outputs: { science_pack_1: 1 },
        duration: 3.0
    },
    craft_science_2: {
        id: 'craft_science_2',
        name: 'Logistics Science',
        machine: 'assembler',
        inputs: { circuit: 1, rotor: 1 },
        outputs: { science_pack_2: 1 },
        duration: 4.5
    },
    craft_space_capsule: {
        id: 'craft_space_capsule',
        name: 'Orbital Payload',
        machine: 'assembler',
        inputs: { steel_plate: 4, circuit: 3, crystal: 2 },
        outputs: { space_capsule: 1 },
        duration: 8.0
    },
    // Chemical Plant Recipes
    refine_oil: {
        id: 'refine_oil',
        name: 'Synthesize Polymer Plastic',
        machine: 'chemical_plant',
        inputs: { coal: 2, stone: 1 },
        outputs: { plastic: 2 },
        duration: 2.5
    },
    craft_battery: {
        id: 'craft_battery',
        name: 'Chemical Energy Battery',
        machine: 'chemical_plant',
        inputs: { copper_ingot: 2, plastic: 1 },
        outputs: { battery: 1 },
        duration: 3.2
    },
    // Foundry Recipes
    smelt_titanium: {
        id: 'smelt_titanium',
        name: 'Smelt Titanium Plate',
        machine: 'foundry',
        inputs: { titanium_ore: 2 },
        outputs: { titanium_plate: 1 },
        duration: 2.2
    },
    smelt_steel_alloy: {
        id: 'smelt_steel_alloy',
        name: 'High-Strength Steel Alloy (x2)',
        machine: 'foundry',
        inputs: { iron_ingot: 2, coal: 1 },
        outputs: { steel_plate: 2 },
        duration: 2.5
    },
    // Manufacturer Recipes
    craft_heavy_frame: {
        id: 'craft_heavy_frame',
        name: 'Heavy Modular Frame',
        machine: 'manufacturer',
        inputs: { steel_plate: 4, iron_gear: 4, rotor: 2 },
        outputs: { heavy_frame: 1 },
        duration: 4.5
    },
    craft_microprocessor: {
        id: 'craft_microprocessor',
        name: 'Precision Microprocessor',
        machine: 'manufacturer',
        inputs: { circuit: 2, plastic: 2, copper_wire: 4 },
        outputs: { microprocessor: 1 },
        duration: 3.8
    },
    craft_quantum_cube: {
        id: 'craft_quantum_cube',
        name: 'Quantum Processing Cube',
        machine: 'manufacturer',
        inputs: { microprocessor: 2, crystal: 3, space_capsule: 1 },
        outputs: { quantum_cube: 1 },
        duration: 8.0
    },
    // Nuclear & Bio Recipes
    refine_fuel_rod: {
        id: 'refine_fuel_rod',
        name: 'Enriched Uranium Fuel Rod',
        machine: 'chemical_plant',
        inputs: { uranium_ore: 2, steel_plate: 1, battery: 1 },
        outputs: { fuel_rod: 1 },
        duration: 5.5
    },
    cultivate_biomass: {
        id: 'cultivate_biomass',
        name: 'Hydroponic Biomass Synthesis (x2)',
        machine: 'greenhouse',
        inputs: { stone: 1 },
        outputs: { biomass: 2 },
        duration: 2.8
    }
};

export const BUILDINGS = {
    // Tools
    select: {
        id: 'select',
        name: 'Inspect / Select',
        category: 'tools',
        isTool: true,
        unlocked: true,
        icon: 'cursor',
        description: 'Inspect machine diagnostics, live telemetry, overclocking, and recipe settings.'
    },
    demolish: {
        id: 'demolish',
        name: 'Deconstruct / Demolish',
        category: 'tools',
        isTool: true,
        unlocked: true,
        icon: 'trash',
        description: 'Dismantle buildings to instantly reclaim full construction materials.'
    },

    // Logistics
    belt: {
        id: 'belt',
        name: 'Conveyor Belt',
        category: 'logistics',
        size: 1,
        speed: 1.6, // tiles per second
        unlocked: true,
        cost: { iron_ingot: 1 },
        description: 'Transports items across tiles directionally.'
    },
    fast_belt: {
        id: 'fast_belt',
        name: 'High-Speed Belt',
        category: 'logistics',
        size: 1,
        speed: 3.2,
        unlocked: false,
        cost: { iron_gear: 1 },
        description: 'Twice as fast as standard conveyor belt.'
    },
    splitter: {
        id: 'splitter',
        name: 'Conveyor Splitter',
        category: 'logistics',
        size: 1,
        speed: 1.6,
        unlocked: false,
        cost: { iron_gear: 2, circuit: 1 },
        description: 'Alternates incoming items evenly into two forward/side outputs.'
    },
    merger: {
        id: 'merger',
        name: 'Conveyor Merger',
        category: 'logistics',
        size: 1,
        speed: 1.6,
        unlocked: false,
        cost: { iron_gear: 2, circuit: 1 },
        description: 'Combines multiple incoming belt lines into one.'
    },
    underground_belt: {
        id: 'underground_belt',
        name: 'Belt Tunnel (Underground)',
        category: 'logistics',
        size: 1,
        speed: 2.0,
        maxSpan: 4,
        unlocked: false,
        cost: { steel_plate: 2, iron_gear: 2 },
        description: 'Dives underground to cross other belt lines.'
    },
    inserter: {
        id: 'inserter',
        name: 'Robotic Inserter',
        category: 'logistics',
        size: 1,
        powerNeed: 4,
        speed: 1.5,
        unlocked: false,
        cost: { iron_ingot: 2, copper_wire: 4 },
        description: 'Picks items up from behind and drops them into forward machine or belt.'
    },
    fast_inserter: {
        id: 'fast_inserter',
        name: 'High-Speed Inserter',
        category: 'logistics',
        size: 1,
        powerNeed: 8,
        speed: 3.2,
        unlocked: false,
        cost: { steel_plate: 2, circuit: 2 },
        description: 'Rapid pneumatic robotic arm for maximum transfer rate.'
    },
    conveyor_bridge: {
        id: 'conveyor_bridge',
        name: 'Conveyor Overpass',
        category: 'logistics',
        size: 1,
        speed: 2.2,
        unlocked: false,
        cost: { iron_ingot: 4, iron_gear: 2 },
        description: 'Elevated conveyor gantry allowing items to pass above intersecting lines.'
    },
    smart_splitter: {
        id: 'smart_splitter',
        name: 'Smart Filter Splitter',
        category: 'logistics',
        size: 1,
        speed: 2.0,
        unlocked: false,
        cost: { steel_plate: 2, circuit: 2 },
        filterLeft: null,
        filterRight: null,
        description: 'Sorts incoming items into left, center, or right outputs based on programmable filters.'
    },
    long_inserter: {
        id: 'long_inserter',
        name: 'Long-Handed Inserter',
        category: 'logistics',
        size: 1,
        powerNeed: 6,
        reach: 2,
        speed: 1.8,
        unlocked: false,
        cost: { iron_gear: 3, copper_wire: 6 },
        description: 'Extended red robotic arm reaching 2 tiles to bridge dual conveyor corridors.'
    },
    conveyor_lift: {
        id: 'conveyor_lift',
        name: 'Conveyor Lift Tower',
        category: 'logistics',
        size: 1,
        speed: 2.6,
        unlocked: false,
        cost: { iron_ingot: 4, iron_gear: 2 },
        description: 'Vertical pneumatic lift transporting materials between elevation layers.'
    },
    belt_crossing: {
        id: 'belt_crossing',
        name: 'Belt Crossing Junction',
        category: 'logistics',
        size: 1,
        speed: 1.8,
        unlocked: false,
        cost: { iron_ingot: 2, steel_plate: 1 },
        description: '4-way intersection allowing North-South and East-West conveyor lines to cross seamlessly.'
    },

    // Extraction & Production
    miner: {
        id: 'miner',
        name: 'Mining Drill',
        category: 'production',
        size: 1,
        powerNeed: 5, // kW
        mineInterval: 1.8, // seconds
        unlocked: true,
        cost: { iron_ingot: 3 },
        description: 'Extracts raw ore when placed directly over resource nodes.'
    },
    smelter: {
        id: 'smelter',
        name: 'Electric Smelter',
        category: 'production',
        size: 2,
        powerNeed: 15,
        defaultRecipe: 'smelt_iron',
        unlocked: true,
        cost: { iron_ingot: 5, stone: 5 },
        description: 'Smelts raw ores into ingots and plates.'
    },
    foundry: {
        id: 'foundry',
        name: 'Heavy Alloy Foundry',
        category: 'production',
        size: 3,
        powerNeed: 35,
        defaultRecipe: 'smelt_steel_alloy',
        unlocked: false,
        cost: { steel_plate: 15, stone_brick: 15, circuit: 6 },
        description: 'High-temperature dual-furnace smelting advanced steel and composite alloys.'
    },
    assembler: {
        id: 'assembler',
        name: 'Automated Workshop',
        category: 'production',
        size: 2,
        powerNeed: 22,
        defaultRecipe: 'craft_gear',
        unlocked: false,
        cost: { iron_ingot: 8, iron_gear: 4 },
        description: 'Assembles components, wires, circuits, and science packs.'
    },
    manufacturer: {
        id: 'manufacturer',
        name: 'Precision Manufacturer',
        category: 'production',
        size: 3,
        powerNeed: 55,
        defaultRecipe: 'craft_heavy_frame',
        unlocked: false,
        cost: { steel_plate: 24, circuit: 16, rotor: 12 },
        description: 'Heavy 4-feeder industrial plant producing microprocessors, heavy frames, and quantum cubes.'
    },
    chemical_plant: {
        id: 'chemical_plant',
        name: 'Chemical Refinery',
        category: 'production',
        size: 3,
        powerNeed: 40,
        defaultRecipe: 'refine_oil',
        unlocked: false,
        cost: { steel_plate: 12, circuit: 8, stone_brick: 10 },
        description: 'Petrochemical synthesis reactor producing plastics, energy cells, and nuclear fuel.'
    },
    greenhouse: {
        id: 'greenhouse',
        name: 'Hydroponic Bio-Dome',
        category: 'production',
        size: 2,
        powerNeed: 14,
        defaultRecipe: 'cultivate_biomass',
        unlocked: false,
        cost: { iron_ingot: 8, copper_wire: 12, crystal: 4 },
        description: 'UV-accelerated algae and biomass reactor producing synthetic fuels and organic carbon.'
    },

    // Power & Grid
    wind_turbine: {
        id: 'wind_turbine',
        name: 'Aero Wind Turbine',
        category: 'power',
        size: 1,
        powerGen: 15, // kW continuous clean
        unlocked: false,
        cost: { iron_ingot: 4, copper_wire: 6 },
        description: 'Generates continuous kinetic wind electricity anywhere on the terrain.'
    },
    coal_generator: {
        id: 'coal_generator',
        name: 'Coal Power Plant',
        category: 'power',
        size: 2,
        powerGen: 50, // kW generated
        unlocked: false,
        cost: { iron_ingot: 6, stone: 8 },
        description: 'Generates 50 kW power by burning coal fuel.'
    },
    solar_panel: {
        id: 'solar_panel',
        name: 'Solar Array',
        category: 'power',
        size: 2,
        powerGen: 20, // kW
        unlocked: false,
        cost: { steel_plate: 4, circuit: 4 },
        description: 'Generates 20 kW clean continuous electrical energy.'
    },
    nuclear_reactor: {
        id: 'nuclear_reactor',
        name: 'Nuclear Fission Reactor',
        category: 'power',
        size: 3,
        powerGen: 280, // kW
        unlocked: false,
        cost: { steel_plate: 30, circuit: 20, battery: 15 },
        description: 'Harnesses uranium fuel rods inside a heavy containment dome to generate colossal 280 kW power.'
    },
    accumulator: {
        id: 'accumulator',
        name: 'Grid Battery Accumulator',
        category: 'power',
        size: 2,
        powerCapacity: 5000, // kJ stored
        chargeRate: 75, // kW max charge/discharge
        unlocked: false,
        cost: { steel_plate: 8, battery: 6, circuit: 4 },
        description: 'Stores surplus factory power and discharges automatically during peak demand or deficits.'
    },
    power_pole: {
        id: 'power_pole',
        name: 'Power Substation Pole',
        category: 'power',
        size: 1,
        coverageRadius: 5, // tiles
        wireMaxDist: 8,
        unlocked: false,
        cost: { copper_wire: 4, iron_ingot: 2 },
        description: 'Distributes electricity to all nearby factories.'
    },

    // Special
    storage_silo: {
        id: 'storage_silo',
        name: 'Storage Silo',
        category: 'special',
        size: 2,
        capacity: 250,
        unlocked: true,
        cost: { iron_ingot: 8 },
        description: 'High-capacity buffer storage for any item.'
    },
    storage_silo_mk2: {
        id: 'storage_silo_mk2',
        name: 'Heavy Industrial Silo Mk.2',
        category: 'special',
        size: 2,
        capacity: 800,
        unlocked: false,
        cost: { steel_plate: 14, circuit: 6 },
        description: 'Reinforced logistics silo with 800-item bulk buffer capacity.'
    },
    research_lab: {
        id: 'research_lab',
        name: 'Nexus Research Lab',
        category: 'special',
        size: 2,
        powerNeed: 18,
        unlocked: true,
        cost: { iron_gear: 4, copper_wire: 6 },
        description: 'Consumes Science Packs to unlock advanced technologies.'
    },
    space_elevator: {
        id: 'space_elevator',
        name: 'Orbital Space Elevator',
        category: 'special',
        size: 3,
        powerNeed: 60,
        unlocked: false,
        cost: { steel_plate: 20, circuit: 15, rotor: 10 },
        description: 'Launches orbital payloads to fulfill planetary milestones.'
    }
};

export const TECH_TREE = [
    {
        id: 'basic_smelting',
        name: 'Thermal Smelting',
        description: 'Unlocks the Electric Smelter and basic ingot production.',
        cost: {},
        unlocked: true,
        iconCode: 'smelter',
        unlocks: ['smelter']
    },
    {
        id: 'automation_1',
        name: 'Automated Workshop',
        description: 'Enables automated manufacturing of gears and copper wires.',
        cost: { iron_ingot: 12 },
        unlocked: false,
        requires: ['basic_smelting'],
        iconCode: 'assembler',
        unlocks: ['assembler', 'craft_gear', 'craft_wire']
    },
    {
        id: 'electric_grid',
        name: 'Power Distribution',
        description: 'Unlocks Coal Power Plants and Substation Poles for factory power.',
        cost: { iron_ingot: 15, copper_ingot: 10 },
        unlocked: false,
        requires: ['automation_1'],
        iconCode: 'power_pole',
        unlocks: ['coal_generator', 'power_pole']
    },
    {
        id: 'logistics_mastery',
        name: 'Advanced Logistics',
        description: 'Unlocks Conveyor Splitters, Mergers, and High-Speed Belts.',
        cost: { iron_gear: 12, copper_wire: 15 },
        unlocked: false,
        requires: ['automation_1'],
        iconCode: 'splitter',
        unlocks: ['splitter', 'merger', 'fast_belt']
    },
    {
        id: 'electronics',
        name: 'Integrated Circuits',
        description: 'Produces Microchips and unlocks Automation Science Packs.',
        cost: { iron_ingot: 18, copper_wire: 24 },
        unlocked: false,
        requires: ['electric_grid'],
        iconCode: 'circuit',
        unlocks: ['craft_circuit', 'craft_science_1']
    },
    {
        id: 'robotics_logistics',
        name: 'Robotic Automation',
        description: 'Unlocks articulated Inserter Arms to transfer items between belts and machines.',
        cost: { iron_gear: 12, circuit: 8 },
        unlocked: false,
        requires: ['electronics'],
        iconCode: 'inserter',
        unlocks: ['inserter', 'fast_inserter']
    },
    {
        id: 'petrochemistry',
        name: 'Industrial Chemistry',
        description: 'Unlocks Chemical Plants to refine coal and stone into plastics and batteries.',
        cost: { circuit: 14, science_pack_1: 14 },
        unlocked: false,
        requires: ['robotics_logistics'],
        iconCode: 'refinery',
        unlocks: ['chemical_plant', 'conveyor_bridge', 'refine_oil', 'craft_battery']
    },
    {
        id: 'steel_metallurgy',
        name: 'Steel Metallurgy',
        description: 'Alloys Iron and Coal into high-strength Steel Plates and Underground Tunnels.',
        cost: { science_pack_1: 15 },
        unlocked: false,
        requires: ['electronics'],
        iconCode: 'steel_plate',
        unlocks: ['smelt_steel', 'underground_belt']
    },
    {
        id: 'motors_robotics',
        name: 'Electromechanical Motors',
        description: 'Assembles Rotors and unlocks Logistics Science Pack 2.',
        cost: { science_pack_1: 25 },
        unlocked: false,
        requires: ['steel_metallurgy'],
        iconCode: 'rotor',
        unlocks: ['craft_rotor', 'craft_science_2']
    },
    {
        id: 'solar_energy',
        name: 'Photovoltaic Solar Arrays',
        description: 'Silent and infinite renewable electrical energy.',
        cost: { science_pack_2: 15 },
        unlocked: false,
        requires: ['motors_robotics'],
        iconCode: 'solar_panel',
        unlocks: ['solar_panel']
    },
    {
        id: 'space_elevator_tech',
        name: 'Orbital Expansion Program',
        description: 'Build the monumental Space Elevator to ship payloads to orbit.',
        cost: { science_pack_2: 30 },
        unlocked: false,
        requires: ['solar_energy'],
        iconCode: 'space_elevator',
        unlocks: ['space_elevator', 'craft_space_capsule']
    },
    {
        id: 'renewable_energy',
        name: 'Aero Kinetic Generation',
        description: 'Deploy omni-directional wind turbines for baseline renewable electricity anywhere on the terrain.',
        cost: { science_pack_1: 10 },
        unlocked: false,
        requires: ['electric_grid'],
        iconCode: 'wind_turbine',
        unlocks: ['wind_turbine']
    },
    {
        id: 'smart_logistics',
        name: 'Intelligent Sorting & Routing',
        description: 'Unlocks Smart Filter Splitters, 4-Way Crossing Junctions, and Vertical Conveyor Lifts.',
        cost: { science_pack_2: 18 },
        unlocked: false,
        requires: ['logistics_mastery', 'robotics_logistics'],
        iconCode: 'smart_splitter',
        unlocks: ['smart_splitter', 'long_inserter', 'conveyor_lift', 'belt_crossing']
    },
    {
        id: 'advanced_metallurgy',
        name: 'Heavy Blast Metallurgy',
        description: 'Construct Heavy Alloy Foundries for multi-material smelting of high-strength steel and titanium plates.',
        cost: { science_pack_2: 22 },
        unlocked: false,
        requires: ['steel_metallurgy'],
        iconCode: 'foundry',
        unlocks: ['foundry', 'smelt_titanium', 'smelt_steel_alloy']
    },
    {
        id: 'energy_storage',
        name: 'Grid Accumulators',
        description: 'High-capacity battery banks that store surplus power and smooth out peak factory energy loads.',
        cost: { science_pack_2: 20 },
        unlocked: false,
        requires: ['petrochemistry', 'solar_energy'],
        iconCode: 'accumulator',
        unlocks: ['accumulator']
    },
    {
        id: 'heavy_industry',
        name: 'Precision Heavy Manufacturing',
        description: 'Construct 4-input Precision Manufacturers for Microprocessors, Heavy Modular Frames, and Bulk Silos.',
        cost: { science_pack_2: 35 },
        unlocked: false,
        requires: ['advanced_metallurgy', 'motors_robotics'],
        iconCode: 'manufacturer',
        unlocks: ['manufacturer', 'craft_heavy_frame', 'craft_microprocessor', 'craft_quantum_cube', 'storage_silo_mk2']
    },
    {
        id: 'synthetic_biofuel',
        name: 'Hydroponic Cultivation',
        description: 'Construct Geodesic Bio-Domes cultivating algae and biomass for renewable hydrocarbons.',
        cost: { science_pack_2: 25 },
        unlocked: false,
        requires: ['petrochemistry'],
        iconCode: 'greenhouse',
        unlocks: ['greenhouse', 'cultivate_biomass']
    },
    {
        id: 'nuclear_power',
        name: 'Nuclear Fission Power',
        description: 'Harness refined Uranium Fuel Rods to power gargantuan 280 kW Nuclear Fission Reactors.',
        cost: { science_pack_2: 45 },
        unlocked: false,
        requires: ['heavy_industry', 'energy_storage'],
        iconCode: 'nuclear_reactor',
        unlocks: ['nuclear_reactor', 'refine_fuel_rod']
    }
];

export const MILESTONES = [
    {
        tier: 1,
        title: 'Phase I: Foundational Foundry',
        requirementItem: 'iron_ingot',
        targetAmount: 20,
        reward: 'Unlocks basic logistics boost'
    },
    {
        tier: 2,
        title: 'Phase II: Electronic Awakening',
        requirementItem: 'circuit',
        targetAmount: 30,
        reward: 'Unlocks industrial overclocking'
    },
    {
        tier: 3,
        title: 'Phase III: Heavy Industry',
        requirementItem: 'rotor',
        targetAmount: 40,
        reward: 'Unlocks planetary logistics'
    },
    {
        tier: 4,
        title: 'Phase IV: Space Elevator Launch',
        requirementItem: 'space_capsule',
        targetAmount: 10,
        reward: 'Planetary Automation Victory!'
    }
];
