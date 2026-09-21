# NEXUS AUTOMATA — MASTER DEVELOPMENT DIRECTIVE

## 0. IDENTITAS PROYEK

Kamu adalah lead game developer, systems designer, technical artist, UI/UX designer, gameplay programmer, technical researcher, QA engineer, dan content designer untuk proyek:

**Nexus Automata**

Repository:
`https://github.com/Fadhlijeu/nexus-automata`

Platform saat ini:
**Website / browser desktop**

Technology saat ini:

- JavaScript
- HTML
- CSS
- Three.js
- WebGL
- GLB/glTF assets

Jangan memigrasikan proyek ke Unity, Godot, Unreal, Capacitor, APK, atau native Android pada tahap ini.

Android akan menjadi fase terpisah setelah versi web matang.

---

# 1. VISI GAME

Nexus Automata harus berkembang menjadi game industrial automation berskala besar yang memiliki kedalaman dan replayability jangka sangat panjang.

Referensi desain:

- Factorio
- Satisfactory
- Mindustry
- Builderment
- Industrialist

Namun:

**JANGAN MENJADI CLONE DARI GAME-GAME TERSEBUT.**

Gunakan game referensi untuk memahami:

- factory progression
- automation
- production chains
- logistics
- resource extraction
- technology progression
- factory optimization
- expansion
- player motivation
- long-term progression

Tetapi buat identitas Nexus Automata sendiri.

Konsep inti:

> “Build an industrial civilization, not merely a factory.”

Pemain harus merasa bahwa mereka membangun sistem industri yang makin lama makin kompleks dan hidup.

---

# 2. PRINSIP DESAIN UTAMA

Seluruh development harus mengikuti prinsip berikut.

### 2.1 Systems Before Content

Jangan sekadar menambahkan 100 building yang sebenarnya hanya berbeda nama.

Setiap sistem harus menghasilkan gameplay baru.

Contoh:

Miner
→ Drill
→ Conveyor
→ Smelter
→ Foundry
→ Assembly
→ Logistics
→ Power
→ Research

Kemudian kompleksitas meningkat:

Power instability
→ production slowdown
→ logistics redesign
→ expansion
→ automation
→ remote outpost
→ advanced materials
→ robotics
→ megafactory

---

### 2.2 Every New Tier Introduces New Decisions

Technology tier baru tidak boleh hanya:

`Iron Machine → Better Iron Machine`

Harus memberikan mekanisme baru.

Contoh:

Tier awal:

- basic conveyor
- manually connected machines

Tier menengah:

- splitters
- filters
- inserters
- buffer
- logistics priority

Tier lanjut:

- programmable routing
- drones
- robotic logistics
- rail
- fluid network
- modular production cells

Endgame:

- orbital logistics
- autonomous factories
- megastructure
- planetary-scale production

---

### 2.3 Complexity Must Be Layered

Pemain baru tidak boleh melihat 100 sistem sekaligus.

Early game:
simple

Mid game:
complex

Late game:
deep

Endgame:
highly systemic

Tutorial harus memperkenalkan sistem satu per satu.

---

### 2.4 The Factory Should Feel Alive

Bangunan bukan sekadar mesh yang berdiri diam.

Mesin harus memiliki:

- idle animation
- startup animation
- working animation
- processing animation
- shutdown animation
- overload state
- no-power state
- blocked state
- maintenance state
- damaged/degraded state apabila sistem tersebut sudah ditambahkan
- completion feedback

Conveyor harus mempunyai:

- moving items
- speed differences
- congestion
- backed-up state
- directional flow
- junction behavior

Power harus terlihat aktif:

- cable pulses
- generator activity
- voltage/load indicators
- warning effects
- overload effects

World harus memiliki aktivitas.

---

# 3. IDENTITAS UNIK NEXUS AUTOMATA

Gunakan kombinasi berikut sebagai identitas khusus game.

## A. Industrial Infrastructure

Factory bukan kumpulan mesin.

Factory adalah network:

- power
- logistics
- materials
- processing
- storage
- communication
- transportation

Pemain membangun infrastructure layer.

---

## B. Industrial Feedback Systems

Sistem harus saling memengaruhi.

Contoh:

Coal shortage
→ power decreases
→ smelters slow
→ ingot shortage
→ assembler starvation
→ product shortage
→ research slows

Jangan selalu menyelesaikan masalah dengan “tambah mesin”.

Kadang solusi harus berupa:

- redesign logistics
- rerouting
- buffer
- alternate recipe
- power expansion
- efficiency upgrade
- automation
- geographic relocation

---

## C. Living Industrial World

World tidak boleh terasa seperti papan kosong.

Tambahkan secara bertahap:

- resource regions
- industrial zones
- environmental variation
- remote deposits
- abandoned facilities
- research sites
- trade locations
- NPC settlements
- logistics routes
- landmarks
- dangerous/high-value areas
- special resource regions

---

## D. Emergent Factory Problems

Game harus mampu menghasilkan masalah baru ketika factory membesar.

Contoh:

small factory:
iron shortage

medium factory:
belt congestion

large factory:
power imbalance

huge factory:
logistics bottleneck

megafactory:
regional infrastructure bottleneck

late game:
multi-site coordination

endgame:
planetary logistics

---

# 4. 1000-HOUR DESIGN PHILOSOPHY

Jangan membuat game “1000 jam” dengan grind buatan.

Jangan:

- hanya membuat recipe mahal
- hanya membuat resource lebih langka
- hanya memperpanjang research timer
- hanya membuat unlock tree panjang

Sebaliknya, replayability harus berasal dari:

### Factory optimization

Pemain ingin terus memperbaiki factory.

### Scaling

Factory kecil → besar → megafactory.

### Multiple solutions

Satu produk dapat memiliki beberapa jalur produksi.

### Alternative logistics

Belt, pipe, vehicle, drone, rail, dll.

### Geographic expansion

Factory utama tidak cukup.

### Specialization

Wilayah berbeda memiliki fungsi berbeda.

### Efficiency engineering

Pemain dapat mengejar:

- throughput
- energy efficiency
- space efficiency
- transport efficiency
- material efficiency

### Automation depth

Manual → semi-auto → full-auto → autonomous.

### Sandbox

Pemain tetap memiliki alasan untuk terus membangun setelah milestone utama selesai.

### Long-term projects

Megastructure, orbital network, planetary logistics, industrial complexes, dll.

---

# 5. ART DIRECTION

Visual Nexus Automata harus berkembang dari prototype saat ini menuju:

**Premium Stylized Industrial Sci-Fi**

Bukan:

- generic low-poly
- realistic military
- cartoon children
- overly photorealistic

Target:

clean industrial forms

- strong silhouettes
- dark premium interface
- credible machinery
- subtle futuristic technology

Gunakan:

- metal
- glass
- concrete
- cables
- pipes
- vents
- panels
- warning markings
- emissive screens
- rotating parts
- mechanical joints
- pistons
- motors
- fans
- robotic arms
- containers
- structural modules

Bangunan harus dapat dikenali hanya dari silhouette.

---

# 6. ASSET POLICY

Cari asset open-source secara aktif.

Prioritas sumber:

1. Kenney
2. Quaternius
3. Poly Haven
4. OpenGameArt
5. sumber Creative Commons lain yang lisensinya jelas
6. asset individual hanya jika lisensinya dapat diverifikasi

Jangan menggunakan:

- ripped game assets
- asset dari Satisfactory
- asset dari Factorio
- asset dari Mindustry
- asset dari Industrialist
- asset berlogo/merek pihak lain
- asset dengan lisensi tidak jelas

Setiap asset yang ditemukan harus dicatat:

```text
asset:
source:
creator:
url:
license:
commercial-use:
modification-allowed:
redistribution-restriction:
attribution-required:
download-format:
intended-use:
```

Jangan menganggap “free download” berarti open-source atau bebas digunakan.

Kenney memiliki banyak asset 3D CC0; misalnya Factory Kit menyediakan 140+ objek, termasuk animasi dan variasi. City Kit Industrial juga CC0.

Quaternius menyatakan asset mereka dapat dipakai untuk proyek komersial tanpa atribusi, dengan ketentuan lisensi yang diperbarui pada 28 Agustus 2026; perhatikan larangan redistribusi asset sebagai asset mentah.

Poly Haven menyediakan model, texture, dan HDRI di bawah CC0.

OpenGameArt juga dapat digunakan sebagai discovery source, tetapi lisensi setiap asset harus diperiksa individual. Contohnya Factory Kit Kenney tercatat sebagai CC0.

---

# 7. CODING PRINCIPLES

Jangan mengubah seluruh proyek menjadi satu file.

Pertahankan modularitas.

Core simulation harus dipisahkan dari rendering.

Konsep:

```text
DATA
 ↓
SIMULATION
 ↓
WORLD STATE
 ↓
RENDERING
 ↓
UI
```

Simulation tidak boleh bergantung pada DOM.

Renderer tidak boleh mengandung aturan gameplay yang fundamental.

UI tidak boleh menjadi source of truth.

---

# 8. BACKWARD COMPATIBILITY

Jangan merusak fitur lama tanpa alasan.

Sebelum mengubah sistem:

1. baca implementasi saat ini
2. pahami dependensinya
3. buat migration strategy
4. implement
5. test existing behavior
6. baru refactor jika dibutuhkan

Prototype saat ini harus diperlakukan sebagai reference implementation.

---

# 9. AGENT DEVELOPMENT RULE

Sebelum mengedit:

- inspect repository
- inspect relevant files
- trace data flow
- identify dependencies
- identify current implementation
- identify limitations
- make a concrete change plan

Setelah mengedit:

- test
- inspect console/runtime errors
- test relevant interactions
- test save/load
- test simulation
- test rendering
- test performance where relevant

Jangan membuat dummy feature yang hanya terlihat bekerja tetapi tidak benar-benar terhubung ke simulation.

---

# 10. STAGED DEVELOPMENT

Ikuti fase berikut secara berurutan.

Jangan melompat ke fase berikutnya sebelum fase sebelumnya stabil.

---

# PHASE 01 — COMPLETE REPOSITORY AUDIT

PROMPT:

> Audit seluruh repository Nexus Automata sebagai lead game engineer.
>
> Jangan melakukan perubahan besar terlebih dahulu.
>
> Baca:
>
> - README
> - CHANGELOG
> - data.js
> - grid.js
> - simulation.js
> - renderer3d.js
> - renderer.js
> - environment3d.js
> - models3d.js
> - ui.js
> - audio.js
> - index.html
> - seluruh CSS
>
> Petakan seluruh fitur yang sudah benar-benar ada.
>
> Pisahkan:
>
> 1. implemented
> 2. partially implemented
> 3. visual-only
> 4. simulation-only
> 5. placeholder
> 6. broken
> 7. architecture debt
>
> Identifikasi seluruh gameplay systems yang sudah ada.
>
> Identifikasi semua building, item, recipe, tech, milestone, logistics system, power system, save system, rendering system, audio system, camera system, UI system.
>
> Buat:
>
> `docs/GAME_AUDIT.md`
>
> yang berisi:
>
> - current architecture
> - gameplay systems
> - existing content
> - missing systems
> - technical debt
> - performance risks
> - scalability risks
> - UX problems
> - visual consistency problems
> - long-term architecture requirements
>
> Jangan mengganti engine.
> Jangan menambahkan fitur besar.
> Tujuan fase ini adalah memahami proyek dengan benar.

---

# PHASE 02 — GAME DESIGN BIBLE

PROMPT:

> Berdasarkan hasil audit, buat Game Design Bible resmi untuk Nexus Automata.
>
> Buat:
>
> `docs/GAME_DESIGN_BIBLE.md`
>
> Isinya harus mencakup:
>
> - game pillars
> - target player experience
> - core gameplay loop
> - minute-to-minute loop
> - hour-to-hour loop
> - long-term loop
> - progression philosophy
> - industrial fantasy
> - world structure
> - building taxonomy
> - logistics taxonomy
> - resource taxonomy
> - production taxonomy
> - power taxonomy
> - research taxonomy
> - expansion philosophy
> - NPC philosophy
> - exploration philosophy
> - endgame philosophy
> - sandbox philosophy
>
> Bandingkan secara konseptual:
> Factorio
> Satisfactory
> Mindustry
> Builderment
> Industrialist
>
> Jangan menyalin mechanic unik mereka secara langsung.
>
> Cari ruang desain yang dapat menjadi identitas Nexus Automata.
>
> Buat minimal 10 differentiators.
>
> Pilih 4–6 differentiators utama yang menjadi DNA Nexus Automata.

---

# PHASE 03 — LONG-TERM PROGRESSION

PROMPT:

> Desain progression Nexus Automata untuk game jangka sangat panjang.
>
> Jangan memakai sekadar “technology tree yang sangat panjang”.
>
> Buat progression berlapis:
>
> Tier 0 — survival/basic industry
> Tier 1 — mechanized industry
> Tier 2 — electrical industry
> Tier 3 — advanced manufacturing
> Tier 4 — chemical industry
> Tier 5 — robotics
> Tier 6 — autonomous logistics
> Tier 7 — advanced materials
> Tier 8 — orbital industry
> Tier 9 — planetary infrastructure
> Tier 10 — endgame megastructure
>
> Nama dan jumlah tier boleh berubah setelah analisis.
>
> Setiap tier harus:
>
> - memperkenalkan mechanic baru
> - memperkenalkan new building classes
> - memperkenalkan new resources
> - memperkenalkan new logistical challenge
> - memperkenalkan new power demand
> - memperkenalkan new optimization problem
> - membuka area baru atau kemungkinan baru
>
> Buat progression graph dan dependency graph.
>
> Jangan membuat progression terasa seperti grind.

---

# PHASE 04 — INDUSTRIAL SYSTEM EXPANSION

PROMPT:

> Kembangkan sistem industri Nexus Automata.
>
> Bangun desain lengkap untuk:
>
> ## Extraction
>
> - mining
> - drilling
> - quarry
> - harvesting
> - fluid extraction
> - rare resources
>
> ## Processing
>
> - crushing
> - smelting
> - casting
> - refining
> - chemical processing
> - separation
> - treatment
>
> ## Manufacturing
>
> - assembler
> - precision assembler
> - manufacturer
> - fabrication cell
> - robotic assembly
>
> ## Storage
>
> - chest
> - warehouse
> - silo
> - fluid tank
> - buffer
> - smart storage
> - logistics hub
>
> ## Logistics
>
> - conveyor
> - fast conveyor
> - underground conveyor
> - splitter
> - merger
> - filter
> - inserter
> - smart inserter
> - bridge
> - lift
> - pipe
> - pump
> - vehicle
> - drone
> - rail
>
> ## Power
>
> - combustion
> - solar
> - wind
> - geothermal
> - hydro
> - nuclear
> - advanced energy
> - battery
> - capacitor
> - transformers
>
> Jangan hanya menambahkan daftar.
>
> Tentukan:
>
> - purpose
> - inputs
> - outputs
> - throughput
> - power usage
> - footprint
> - animation requirements
> - unlock condition
> - gameplay role
> - interaction rules
>
> Setelah desain selesai, implementasikan secara modular.

---

# PHASE 05 — BUILDING VARIETY

PROMPT:

> Tingkatkan variasi building secara besar-besaran.
>
> Jangan menambahkan building yang hanya merupakan skin alternatif.
>
> Buat kategori:
>
> Resource
> Logistics
> Processing
> Manufacturing
> Storage
> Power
> Infrastructure
> Research
> Robotics
> Transportation
> Defense/safety
> Environmental
> Utility
> Special
> Endgame
>
> Targetkan ratusan building yang dapat muncul secara bertahap sepanjang progression, tetapi implementasikan dalam batches kecil yang stabil.
>
> Setiap building harus memiliki:
>
> - unique purpose
> - unique visual identity
> - footprint
> - input
> - output
> - throughput
> - power requirement
> - operating states
> - animation concept
> - audio concept
> - UI inspector
> - unlock requirement
> - upgrade opportunities
>
> Jangan membuat building hanya demi memenuhi angka.

---

# PHASE 06 — 3D ASSET DISCOVERY + ASSET PIPELINE

PROMPT:

> Bertindak sebagai technical artist dan asset researcher.
>
> Cari model 3D open-source yang relevan untuk Nexus Automata.
>
> Cari berdasarkan kategori:
>
> - industrial building
> - factory machinery
> - conveyor
> - warehouse
> - pipes
> - tanks
> - generators
> - turbines
> - robotic arms
> - mining machinery
> - trucks
> - containers
> - laboratory
> - refinery
> - nuclear equipment
> - solar panels
> - wind turbines
> - industrial props
> - workers
> - drones
> - vehicles
> - infrastructure
> - sci-fi industrial modules
>
> Prioritaskan:
>
> CC0
> public domain
> explicit commercial-use license
> explicit modification permission
>
> Untuk setiap asset:
>
> source
> creator
> URL
> license
> commercial-use
> modification permission
> attribution
> format
> animation availability
> polycount/optimization concerns
>
> Jangan mengambil asset dengan lisensi ambigu.
>
> Jangan mengambil ripped assets.
>
> Jangan mengambil asset dari game komersial lain.
>
> Buat:
>
> `docs/ASSET_REGISTRY.md`
>
> dan:
>
> `docs/ASSET_GAPS.md`
>
> ASSET_GAPS harus berisi asset apa saja yang belum tersedia sehingga perlu:
>
> - procedural modeling
> - Blender modification
> - kitbashing dari asset open-source
> - custom creation
>
> Jangan mengganti asset secara sembarang.
>
> Pertahankan style consistency.

---

# PHASE 07 — MACHINE ANIMATION SYSTEM

PROMPT:

> Bangun animation philosophy dan animation system untuk Nexus Automata.
>
> Mesin tidak boleh terlihat seperti static 3D props.
>
> Setiap machine harus mendukung state:
>
> IDLE
> STARTING
> WORKING
> OUTPUTTING
> STARVED
> BLOCKED
> NO_POWER
> OVERLOADED
> STOPPING
> DISABLED
>
> Apabila sistem maintenance diterapkan:
>
> MAINTENANCE
> DEGRADED
> BROKEN
>
> Buat reusable animation architecture.
>
> Animations minimal:
>
> - rotating parts
> - piston movement
> - belts
> - fans
> - robotic arms
> - valves
> - lights
> - screens
> - smoke/steam
> - sparks
> - liquid flow
> - power indicators
>
> Animation harus dikendalikan oleh simulation state.
>
> Jangan membuat animation yang hanya berjalan secara visual tanpa hubungan dengan state game.

---

# PHASE 08 — PLAYER INTERACTION + INSPECTION

PROMPT:

> Bangun sistem interaksi pemain seperti game simulation modern.
>
> Pemain harus dapat:
>
> - inspect building
> - inspect belt
> - inspect item
> - inspect power pole
> - inspect storage
> - inspect production chain
> - inspect blocked logistics
> - inspect resource node
>
> Inspector harus menjawab:
>
> “Apa yang terjadi?”
>
> dan:
>
> “Mengapa terjadi?”
>
> Contoh:
>
> Smelter tidak bekerja.
>
> Jangan hanya tampilkan:
>
> `STOPPED`
>
> Tetapi:
>
> `STOPPED`
> `Cause: Iron Ore Input Starved`
> `Expected: 30/min`
> `Received: 17/min`
> `Upstream Bottleneck: Belt B-014`
>
> Tambahkan visual diagnostic:
>
> - input/output highlights
> - arrows
> - bottleneck highlighting
> - power flow
> - item flow
> - production chain
>
> Buat sistem ini reusable.

---

# PHASE 09 — TUTORIAL AWAL

PROMPT:

> Buat tutorial awal Nexus Automata seperti game komersial modern.
>
> Jangan membuat tutorial berupa halaman teks panjang.
>
> Tutorial harus menjadi gameplay.
>
> Struktur:
>
> INTRO
> ↓
> PLAYER ARRIVES
> ↓
> RESOURCE DISCOVERY
> ↓
> FIRST MINER
> ↓
> FIRST CONVEYOR
> ↓
> FIRST PROCESSOR
> ↓
> FIRST STORAGE
> ↓
> POWER
> ↓
> FIRST AUTOMATION
> ↓
> FIRST RESEARCH
> ↓
> FIRST EXPANSION
>
> Gunakan:
>
> - contextual hints
> - camera guidance
> - highlighted tiles
> - ghost previews
> - objective markers
> - animated demonstrations
> - progressive UI disclosure
>
> Jangan membuat pemain membuka seluruh UI di menit pertama.
>
> Tutorial harus mengajarkan mental model game:
>
> resource
> → logistics
> → processing
> → power
> → storage
> → automation
> → optimization
>
> Buat tutorial yang dapat selesai secara natural dalam sesi pertama.

---

# PHASE 10 — UI/UX GAME DESIGN

PROMPT:

> Redesign UI Nexus Automata agar terasa seperti game simulation premium.
>
> Pertahankan identitas Glass Dark Premium yang sudah ada, tetapi tingkatkan usability.
>
> UI harus memiliki hierarchy:
>
> World
> ↓
> Build Dock
> ↓
> Quick Information
> ↓
> Inspector
> ↓
> Deep Management Panels
>
> Tambahkan:
>
> - build categories
> - search
> - favorites
> - recently used
> - recipe browser
> - production graph
> - logistics graph
> - power graph
> - technology tree
> - objectives
> - notifications
> - diagnostics
> - statistics
> - map
> - resource overview
>
> Jangan membuat semua informasi tampil sekaligus.
>
> Advanced information harus tersedia saat pemain membutuhkannya.

---

# PHASE 11 — NPC / WORKERS / DRONES

PROMPT:

> Rancang sistem NPC untuk Nexus Automata.
>
> NPC jangan menjadi dekorasi semata.
>
> Pertimbangkan:
>
> Workers
> Engineers
> Operators
> Researchers
> Logistics crews
> Maintenance crews
> Autonomous drones
>
> Namun automation tetap harus menjadi fokus utama game.
>
> NPC harus memperkuat industrial fantasy, bukan menggantikan automation.
>
> NPC dapat digunakan untuk:
>
> - inspection
> - maintenance
> - construction
> - exploration
> - logistics support
> - research
> - remote outposts
>
> Buat perilaku sederhana tetapi meaningful.
>
> NPC harus memiliki:
>
> - pathfinding
> - task assignment
> - idle behavior
> - work behavior
> - transport behavior
> - failure handling
>
> Hindari simulasi NPC yang terlalu berat pada browser.

---

# PHASE 12 — EXPLORATION + WORLD EXPANSION

PROMPT:

> Kembangkan world simulation sehingga pemain memiliki alasan untuk meninggalkan factory utama.
>
> Tambahkan secara bertahap:
>
> - resource deposits
> - distant deposits
> - rare resources
> - special locations
> - abandoned industrial sites
> - research sites
> - hazardous zones
> - geological regions
> - special production areas
>
> Buat:
>
> Main Factory
>
> - Remote Outposts
> - Logistics Network
>
> Outpost harus mempunyai gameplay value nyata.
>
> Jangan membuat map hanya lebih besar.
>
> Map harus menciptakan keputusan strategis.

---

# PHASE 13 — LOGISTICS DEPTH

PROMPT:

> Jadikan logistics salah satu sistem terdalam di Nexus Automata.
>
> Implementasikan secara bertahap:
>
> belt
> underground
> splitter
> merger
> smart splitter
> filters
> buffers
> priority
> inserters
> bridges
> lifts
> pipes
> pumps
> warehouses
> vehicle logistics
> drone logistics
> rail logistics
>
> Setiap logistics tier harus memberikan trade-off.
>
> Contoh:
>
> belt:
> cheap / simple / limited throughput
>
> rail:
> high throughput / infrastructure cost
>
> drone:
> flexible / energy intensive
>
> vehicle:
> flexible / traffic planning
>
> Jangan membuat tier baru sekadar “lebih cepat”.

---

# PHASE 14 — POWER & INDUSTRIAL ENGINEERING

PROMPT:

> Kembangkan power system menjadi sistem engineering yang meaningful.
>
> Power harus meliputi:
>
> generation
> transmission
> distribution
> storage
> demand
> load balancing
> peak demand
> brownout
> overload
> backup
> renewable variability
>
> Generator harus memiliki operational state.
>
> Power network harus dapat divisualisasikan.
>
> Tambahkan:
>
> - power graph
> - network diagnostic
> - production vs consumption
> - peak demand
> - generator status
> - grid bottleneck
>
> Pemain harus dapat memahami:
>
> “Mengapa factory saya kehabisan power?”
>
> tanpa membaca source code.

---

# PHASE 15 — PRODUCTION CHAINS

PROMPT:

> Expand production into deep multi-stage industrial chains.
>
> Jangan hanya:
>
> ore → ingot → product.
>
> Buat:
>
> raw resource
> → preprocessing
> → refined material
> → intermediate
> → component
> → subsystem
> → machine/module
> → research/endgame product
>
> Buat alternative recipes.
>
> Beberapa product harus dapat dibuat melalui beberapa jalur.
>
> Alternative recipes harus menciptakan:
>
> - efficiency choices
> - logistics choices
> - power choices
> - resource choices
>
> Bukan hanya mengganti angka.

---

# PHASE 16 — RESEARCH SYSTEM 2.0

PROMPT:

> Redesign research menjadi meaningful progression system.
>
> Research jangan hanya:
>
> “Collect X science pack.”
>
> Gabungkan:
>
> science
>
> - industrial milestones
> - engineering achievements
> - world discovery
> - special projects
>
> Contoh:
>
> Research requires:
> science production
>
> - stable power
> - specific industrial capacity
>
> Buat research branches:
>
> Logistics
> Manufacturing
> Power
> Materials
> Robotics
> Automation
> Exploration
> Orbital
> Advanced Engineering
>
> Research harus memberikan perubahan nyata terhadap cara pemain bermain.

---

# PHASE 17 — MISSIONS / CONTRACTS / PROJECTS

PROMPT:

> Tambahkan long-term objectives agar pemain memiliki target selain tech tree.
>
> Buat:
>
> contracts
> industrial orders
> infrastructure projects
> research projects
> exploration objectives
> regional development
> megaprojects
>
> Objective harus mendorong pemain membangun sesuatu.
>
> Hindari quest yang hanya:
>
> “Collect 500 iron.”
>
> Sebagai gantinya:
>
> “Establish a remote steel outpost capable of supplying 600 steel/min to the central industrial zone.”
>
> Objectives harus menguji sistem game.

---

# PHASE 18 — FACTORY ANALYTICS

PROMPT:

> Jadikan analytics sebagai bagian inti permainan.
>
> Tambahkan:
>
> throughput
> bottleneck analysis
> production/min
> consumption/min
> stock trends
> power trends
> logistics utilization
> machine utilization
> idle percentage
> storage saturation
> transport latency
>
> Berikan visual explanation.
>
> Pemain harus dapat melakukan engineering berdasarkan data.

---

# PHASE 19 — SAVE / BLUEPRINT / REPLICATION

PROMPT:

> Perkuat save system.
>
> Tambahkan:
>
> multiple saves
> save versioning
> backup
> import/export
> corruption protection
> migration
>
> Kemudian buat blueprint system:
>
> select factory section
> ↓
> capture
> ↓
> save blueprint
> ↓
> preview
> ↓
> resource cost calculation
> ↓
> deploy blueprint
>
> Blueprint harus menjadi bagian penting untuk factory scaling.

---

# PHASE 20 — PROCEDURAL / VARIED WORLD

PROMPT:

> Tingkatkan replayability world generation.
>
> Jangan membuat setiap playthrough identik.
>
> Variasikan:
>
> resource distribution
> terrain
> strategic regions
> rare deposits
> exploration sites
> expansion opportunities
>
> Namun pastikan generation tetap playable.
>
> Buat deterministic seed.
>
> Save game harus menyimpan seed dan state dengan aman.

---

# PHASE 21 — VISUAL POLISH

PROMPT:

> Audit seluruh visual game.
>
> Fokus:
>
> lighting
> shadows
> materials
> atmosphere
> fog
> environment
> terrain
> vegetation
> water
> machines
> particles
> animation
> emissive effects
> UI
>
> Hilangkan:
>
> placeholder-looking visuals
> inconsistent scale
> inconsistent materials
> random colors
> generic silhouettes
> broken shadows
> floating assets
> clipping
> incorrect origins
>
> Semua object harus memiliki:
>
> consistent scale
> consistent orientation
> consistent industrial design language
>
> Tetap pertahankan web performance.

---

# PHASE 22 — SOUND DESIGN

PROMPT:

> Kembangkan audio system dari procedural sound prototype menjadi systemic industrial audio.
>
> Setiap machine class harus memiliki sonic identity.
>
> Tambahkan:
>
> startup
> operating loop
> shutdown
> overload
> warning
> completion
> interaction
>
> Environment:
>
> wind
> machinery
> distant factories
> power networks
> industrial ambience
>
> Audio harus berubah berdasarkan factory density dan machine activity.
>
> Jangan membuat semua machine mengeluarkan suara yang sama.

---

# PHASE 23 — PERFORMANCE / SCALABILITY

PROMPT:

> Uji Nexus Automata sebagai factory simulator berskala besar.
>
> Simulasikan:
>
> 100 buildings
> 500 buildings
> 1000 buildings
> 5000 buildings
>
> dan jumlah item/logistics yang besar.
>
> Ukur:
>
> simulation time
> render time
> memory
> draw calls
> object count
> DOM cost
> texture usage
>
> Optimalkan menggunakan:
>
> object pooling
> instancing
> culling
> LOD
> spatial partitioning
> batched updates
> fixed timestep simulation
>
> Jangan melakukan premature optimization.
>
> Profiling harus menentukan bagian mana yang dioptimalkan.

---

# PHASE 24 — MOBILE-READINESS PASIF

PROMPT:

> Game masih tetap website.
>
> Jangan membuat APK.
>
> Tetapi lakukan audit agar architecture tidak terlalu bergantung pada mouse/keyboard atau desktop-only assumptions.
>
> Pisahkan:
>
> gameplay action
> input method
> rendering
>
> Buat abstraction:
>
> InputAction
> CameraAction
> BuildAction
> InspectAction
> RotateAction
> SelectionAction
>
> Desktop input menjadi salah satu implementation.
>
> Jangan membuat mobile UI final dulu.

---

# PHASE 25 — QA / GAMEPLAY AUDIT

PROMPT:

> Bertindak sebagai QA lead dan senior gameplay engineer.
>
> Jangan hanya mencari JavaScript errors.
>
> Test:
>
> - new game
> - tutorial
> - build
> - demolish
> - rotate
> - logistics
> - power
> - production
> - research
> - milestone
> - save
> - load
> - reset
> - import/export
> - large factory
> - blocked logistics
> - insufficient power
> - missing resources
> - edge-of-map
> - invalid placement
>
> Cari:
>
> soft-lock
> progression deadlock
> infinite loops
> impossible recipes
> unreachable buildings
> visual desync
> simulation/render desync
> corrupted save
>
> Fix root causes.

---

# PHASE 26 — CONTENT PASS

PROMPT:

> Lakukan content expansion berdasarkan sistem yang sekarang benar-benar stabil.
>
> Tambahkan content secara batch:
>
> resources
> buildings
> recipes
> technologies
> milestones
> world locations
> contracts
> projects
>
> Setiap content baru harus benar-benar menggunakan existing systems.
>
> Jangan membuat placeholder content hanya untuk meningkatkan jumlah.

---

# PHASE 27 — RETENTION / LONG-TERM LOOP

PROMPT:

> Audit game untuk sesi:
>
> 10 menit
> 30 menit
> 1 jam
> 5 jam
> 20 jam
> 50 jam
> 100 jam
> 500 jam
> 1000 jam
>
> Untuk setiap horizon, jawab:
>
> - Apa yang sedang dikerjakan pemain?
> - Mengapa mereka ingin melanjutkan?
> - Masalah apa yang sedang mereka pecahkan?
> - Sistem apa yang sudah mereka kuasai?
> - Sistem apa yang baru diperkenalkan?
> - Apa target jangka pendek?
> - Apa target jangka panjang?
>
> Jangan membuat artificial grind.
>
> Pastikan long-term engagement berasal dari:
>
> optimization
> expansion
> mastery
> experimentation
> specialization
> construction
> engineering
> exploration
> automation.

---

# PHASE 28 — DIFFERENTIATION AUDIT

PROMPT:

> Bandingkan Nexus Automata secara sistematis dengan:
>
> Factorio
> Satisfactory
> Mindustry
> Builderment
> Industrialist
>
> Jangan memberi ranking.
>
> Cari bagian yang terlalu mirip.
>
> Untuk setiap kemiripan:
>
> explain why
> assess whether it is generic genre convention or distinctive mechanic
> propose differentiation
>
> Pastikan Nexus memiliki:
>
> distinctive progression
> distinctive logistics
> distinctive world
> distinctive industrial simulation
> distinctive visual identity
> distinctive player interactions
> distinctive long-term projects
>
> Jangan menghapus genre conventions yang memang diperlukan.
>
> Diferensiasi harus datang dari systems, bukan sekadar UI skin.

---

# PHASE 29 — FINAL GAME COHESION

PROMPT:

> Audit Nexus Automata sebagai game utuh, bukan sebagai kumpulan feature.
>
> Periksa:
>
> Does extraction connect to logistics?
> Does logistics connect to production?
> Does production connect to power?
> Does power influence expansion?
> Does expansion unlock new resource chains?
> Do resources create new engineering problems?
> Does research change gameplay?
> Does exploration matter?
> Do NPCs matter?
> Do blueprints matter?
> Do analytics matter?
> Does late game remain meaningful?
>
> Identifikasi feature yang:
>
> - redundant
> - disconnected
> - superficial
> - too complex for its value
> - too simple
> - exploitable
>
> Refactor game loop agar seluruh sistem saling mendukung.

---

# PHASE 30 — WEB RELEASE CANDIDATE

PROMPT:

> Prepare Nexus Automata as a polished web game release candidate.
>
> Jangan memindahkan engine.
>
> Pastikan:
>
> - clean boot
> - stable loading
> - asset loading fallback
> - save integrity
> - gameplay tutorial
> - responsive UI
> - performance
> - browser compatibility
> - error handling
> - accessibility basics
> - no broken references
> - no console errors
>
> Buat:
>
> `docs/RELEASE_READINESS.md`
>
> dengan:
>
> PASS
> FAIL
> BLOCKED
> untuk setiap subsystem.
>
> Jangan menyatakan siap release jika subsystem penting belum benar-benar berfungsi.

---

# ATURAN TAMBAHAN UNTUK SELURUH FASE

1. Jangan menambahkan feature hanya karena ada di game referensi.

2. Jangan meniru nama, UI, iconography, art style, asset, lore, atau proprietary content milik game lain.

3. Jangan membuat 50 feature setengah jadi ketika 5 feature dapat dibuat benar-benar bagus.

4. Jangan membuat placeholder permanent.

5. Jangan mengorbankan simulation correctness demi visual.

6. Jangan mengorbankan readability demi visual.

7. Jangan mengorbankan performance demi particle/effect berlebihan.

8. Jangan memasukkan mobile implementation sampai website gameplay sudah matang.

9. Jangan menghapus sistem lama tanpa migration.

10. Setiap feature harus memiliki:

- gameplay purpose
- state model
- UI interaction
- visual feedback
- audio feedback bila relevan
- save/load implications
- performance implications
- test plan

11. Selalu prefer reusable systems daripada hardcoded exceptions.

12. Jangan membuat game terasa “besar” hanya karena memiliki banyak menu. Kedalaman harus berasal dari interaksi antar-system.

13. Saat menemukan bug arsitektur, perbaiki root cause, bukan symptom.

14. Saat menemukan asset bagus, jangan langsung memasukkannya. Periksa style, scale, polygon count, material complexity, license, dan compatibility dengan asset lain.

15. Semua perubahan besar harus didokumentasikan.

# PRIORITAS UTAMA

Urutan prioritas:

GAMEPLAY CORRECTNESS

>

SYSTEM DEPTH

>

PLAYER FEEDBACK

>

CONTENT

>

VISUAL POLISH

>

AUDIO POLISH

>

MICRO-OPTIMIZATION

Tujuan akhir:

Nexus Automata harus terasa seperti sebuah game yang benar-benar dirancang dan dikembangkan sebagai industrial simulation game penuh — bukan prototype Three.js yang terus diberi feature tambahan.

Satu hal penting: jangan langsung pakai 30 fase itu sekaligus

Untuk workflow AI lu, gue justru akan menjalankannya sebagai pipeline:

AUDIT
↓
GAME DESIGN BIBLE
↓
PROGRESSION
↓
CORE SYSTEMS
↓
BUILDINGS
↓
ASSETS
↓
ANIMATION
↓
INSPECTION
↓
TUTORIAL
↓
UI/UX
↓
NPC
↓
WORLD
↓
LOGISTICS
↓
POWER
↓
PRODUCTION
↓
RESEARCH
↓
PROJECTS
↓
ANALYTICS
↓
BLUEPRINT
↓
PROCEDURAL WORLD
↓
POLISH
↓
PERFORMANCE
↓
QA
↓
LONG-TERM LOOP
↓
DIFFERENTIATION
↓
RELEASE CANDIDATE

Dan ada satu keputusan desain yang menurut gue sangat penting untuk Nexus:

Jangan bikin pemain mengejar "unlock berikutnya". Bikin pemain mengejar factory yang lebih baik.

Contohnya:

Jam 1
"Bagaimana bikin iron ingot?"

Jam 5
"Kenapa smelter gue kekurangan ore?"

Jam 20
"Kenapa jalur produksi circuit bottleneck?"

Jam 50
"Gue butuh remote copper outpost."

Jam 100
"Rail atau drone?"

Jam 300
"Gimana gue supply tiga factory sekaligus?"

Jam 500
"Gue harus redesign seluruh power infrastructure."

Jam 1000
"Gue punya industrial civilization."

READ THIS BEFORE IMPROVEMENT:

# NEXUS AUTOMATA — CURRENT BASELINE STABILIZATION

Repository:
`https://github.com/Fadhlijeu/nexus-automata`

## STATUS

Kamu TIDAK sedang memulai proyek baru.

Nexus Automata sudah merupakan prototype game 3D factory simulator yang berjalan menggunakan:

- HTML
- CSS
- JavaScript ES Modules
- Three.js/WebGL
- GLB/glTF assets

Current architecture sudah memiliki:

```text
WorldGrid
SimulationEngine
Renderer3D
ModelFactory3D
WorldEnvironment3D
UIController
Audio
Data:
  ITEMS
  RECIPES
  BUILDINGS
  TECH_TREE
  MILESTONES
```

Current version:
`1.6.0`

JANGAN:

- mengganti engine
- memindahkan ke Unity
- memindahkan ke Godot
- membuat APK
- mengganti architecture secara total
- menghapus prototype lalu membangun ulang dari nol
- mengganti seluruh renderer
- membuat sistem baru hanya karena menurutmu architecture ideal berbeda

Gunakan repository yang sekarang sebagai baseline.

Tujuan fase ini:

> Membuat implementasi saat ini stabil, konsisten, performant, dan benar secara simulation sebelum dilakukan content expansion besar-besaran.

---

# 1. ATURAN KERJA

Sebelum mengubah kode:

1. Baca implementation saat ini.
2. Trace dependency.
3. Pahami flow:
   `input → grid → simulation → renderer → UI`.
4. Jangan memperbaiki symptom dengan workaround.
5. Perbaiki root cause.
6. Setelah setiap kelompok perubahan, lakukan regression test.
7. Jangan melakukan refactor besar jika belum diperlukan.

Jaga API internal yang sudah digunakan file lain.

Jangan mengubah semua file sekaligus.

Kerjakan secara batch dan stabil.

---

# 2. KONDISI YANG SUDAH DIVERIFIKASI

Audit saat ini menemukan bahwa:

- repository aktif dan source utama berada di branch `main`
- game menggunakan Three.js
- world grid saat ini 80×80
- simulation dipisahkan dari renderer
- `simulation.js`, `grid.js`, `renderer3d.js`, `models3d.js`, `environment3d.js`, dan `ui.js` sudah modular
- repository memiliki banyak GLB assets
- seluruh GLB path yang direferensikan oleh `models3d.js` saat ini ditemukan di repository
- seluruh building definition saat ini mempunyai case `createBuildingMesh()` yang sesuai
- seluruh recipe input/output yang terdaftar merujuk ke item yang valid
- seluruh tech unlock reference merujuk ke building atau recipe yang valid

JANGAN menghabiskan fase ini untuk memperbaiki masalah yang sebenarnya tidak ada.

Fokus pada masalah berikut.

---

# 3. P0 — DUPLICATE `handleSimEvent()` DI `main.js`

File:

`js/main.js`

Saat ini terdapat dua method:

sekitar line 60:

```js
handleSimEvent(evt, data) {
    ...
}
```

dan lagi sekitar line 338:

```js
handleSimEvent(evt, data) {
    ...
}
```

Pada class JavaScript, definisi kedua menimpa definisi pertama.

Akibatnya implementasi pertama tidak pernah menjadi implementation aktif.

Implementation pertama berisi:

- `sound.playResearchUnlock()`
- launch sound
- `triggerSpaceElevatorLaunch()`

Implementation kedua berisi:

- unlock building berdasarkan `data.unlocks`
- toast
- render ulang UI

Gabungkan menjadi SATU `handleSimEvent()`.

Pastikan event:

```text
tech_selected
research_progress
tech_unlocked
milestone_progress
milestone_complete
```

ditangani secara konsisten.

Saat `tech_unlocked`:

- unlock building yang benar
- trigger UI update
- trigger audio
- tidak duplicate audio
- tidak duplicate toast

Saat `milestone_complete`:

- trigger toast
- trigger audio
- trigger `renderer.triggerSpaceElevatorLaunch()`

Jangan menghapus fungsi yang sebelumnya bekerja.

---

# 4. P0 — POWER GRID: COAL/NUECLEAR GENERATOR STALE CAPACITY

Files:

`js/grid.js`
`js/simulation.js`

Masalah:

`WorldGrid.updatePowerGrid()` menentukan kapasitas generator berdasarkan:

```js
gen.fuelTime;
```

tetapi `SimulationEngine.updatePowerGenerators()` mengubah:

```js
fuelTime;
```

setelah generator mulai membakar fuel tanpa selalu memanggil:

```js
grid.updatePowerGrid();
```

Flow sekarang bisa menjadi:

```text
Place coal generator
↓
fuelTime = 0
↓
power capacity = 0
↓
simulation tick
↓
consume coal
↓
fuelTime = 8
↓
generator status = working
↓
GRID CAPACITY TETAP 0
```

Dengan demikian generator dapat terlihat bekerja tetapi grid belum menghitung output generator.

Perbaiki state synchronization.

Buat power simulation memiliki source of truth yang jelas.

Setelah generator fuel state berubah dari:

```text
inactive/no fuel
→ active
```

grid harus diperbarui.

Begitu juga:

```text
active
→ no fuel
```

grid harus diperbarui.

Jangan memanggil `updatePowerGrid()` secara brutal di setiap frame.

Gunakan dirty flag atau mekanisme event-driven.

Contoh:

```text
power topology changed
→ refresh

generator fuel state changed
→ refresh

clock speed changed
→ refresh

building added
→ refresh

building removed
→ refresh

pole network changed
→ refresh
```

Jangan membuat power-grid calculation O(N) setiap frame jika topology tidak berubah.

---

# 5. P0 — RECIPE RESEARCH PROGRESSION BISA DIBYPASS

Files:

`js/data.js`
`js/ui.js`
`js/simulation.js`

Masalah:

Tech tree memiliki:

```js
unlocks: ['craft_circuit', ...]
```

tetapi UI recipe selector melakukan:

```js
Object.values(RECIPES).filter((r) => r.machine === b.type);
```

sehingga seluruh recipe machine tersedia sekaligus.

Contoh:

Smelter dapat melihat recipe advanced walaupun research belum selesai.

Assembler juga dapat menggunakan recipe yang seharusnya belum unlock.

Research progression menjadi tidak meaningful.

Perbaiki architecture.

Recipe harus mempunyai unlock state yang benar.

Gunakan satu source of truth:

```text
recipe unlocked?
```

Bukan hanya building unlocked.

Recipe selector hanya boleh menampilkan:

```text
unlocked recipes
+
default recipe
```

Recipe yang belum unlocked harus:

```text
hidden
```

atau:

```text
visible but locked
```

Pilih salah satu dengan UX yang konsisten.

Simulation juga harus memvalidasi recipe unlock.

JANGAN hanya mengandalkan UI.

Jika recipe locked tetapi JavaScript mencoba menjalankannya:

```text
reject
```

Bukan tetap menjalankannya.

---

# 6. P0 — MULTI-RESOURCE RESEARCH COST SALAH

File:

`js/simulation.js`

Function:

`updateResearchLabs()`

Masalah:

Tech dapat memiliki cost:

```js
{
    iron_ingot: 15,
    copper_ingot: 10
}
```

Tetapi implementation sekarang hanya mengambil resource pertama:

```js
for (const [item, count] of Object.entries(this.activeTech.cost)) {
  neededItem = item;
  neededTotal = count;
  break;
}
```

Ini berarti tech dengan multi-resource cost sebenarnya hanya membutuhkan resource pertama.

Selain itu HUD/UI menghitung total cost dengan logic yang juga salah.

Perbaiki research system sehingga:

```text
Tech Cost
{
  itemA: 15,
  itemB: 10
}
```

benar-benar berarti:

```text
15 × itemA
+
10 × itemB
```

Jangan menganggap object cost sebagai satu item.

Gunakan progress yang benar.

Misalnya:

```text
Cost:
Iron Ingot     15/15
Copper Ingot   7/10

Overall:
22/25
```

Research hanya selesai setelah seluruh requirement terpenuhi.

Pastikan consumption tersinkron.

---

# 7. P0 — BUILDING COST SAAT INI TIDAK PERNAH DIGUNAKAN

Files:

`js/data.js`
`js/grid.js`
`js/main.js`

Building definitions memiliki:

```js
cost: {
    iron_ingot: 5,
    ...
}
```

Tetapi saat placement:

```js
handleTileClick()
→ grid.canPlace()
→ grid.placeBuilding()
```

tidak ada player construction inventory/economy yang memverifikasi atau mengurangi resource.

Artinya building saat ini essentially FREE.

Ini menyebabkan economy game tidak meaningful.

Implementasikan minimal construction economy tanpa merombak architecture besar.

Tambahkan konsep:

```text
PlayerInventory / PlayerResources
```

atau struktur state yang ekuivalen.

Harus mendukung:

```text
canAfford(building)
consumeConstructionCost(building)
refundConstructionCost(building)
```

Flow:

```text
Select building
↓
Preview
↓
Can afford?
↓
Can place?
↓
Build
↓
Consume resources
```

Jika tidak cukup:

```text
DO NOT BUILD
```

Tampilkan feedback:

```text
INSUFFICIENT MATERIALS
Iron Ingot: 2 / 5
```

Demolish harus mengikuti policy yang konsisten.

Karena UI/data saat ini mengatakan:

```text
full construction material refund
```

maka implementasikan refund sesuai policy tersebut.

Jangan membuat UI mengatakan refund tetapi simulation tidak melakukan refund.

Simpan player resources dalam save.

---

# 8. P0 — `conveyor_bridge` VISUAL ADA, SIMULATION BELUM

Files:

`js/data.js`
`js/models3d.js`
`js/simulation.js`

Building:

```text
conveyor_bridge
```

sudah ada di data dan mempunyai model 3D.

Tetapi `updateBelts()` tidak memasukkannya ke daftar belt simulation.

`tryFeedItem()` juga tidak memasukkannya ke `isBeltType`.

Akibatnya bridge tidak benar-benar menjadi logistics device.

Perbaiki.

Bridge harus memiliki:

```text
input
→ elevated transport
→ output
```

Minimal:

```text
items
pos
direction
speed
capacity
```

Simulation harus memahami bridge.

Renderer hanya merepresentasikan state simulation.

Jangan membuat bridge “terlihat aktif” tetapi item tidak benar-benar bergerak melalui sistemnya.

---

# 9. P0 — MILESTONE SPACE ELEVATOR TERLALU CEPAT

File:

`js/simulation.js`

Function:

`updateSpaceElevator()`

Sekarang elevator melakukan:

```js
if ((b.inventory.inputs[targetItem] || 0) > 0) {
  b.inventory.inputs[targetItem]--;
  this.milestoneDelivered++;
}
```

setiap simulation update.

Simulation berjalan puluhan kali per detik.

Akibatnya elevator dapat mengonsumsi item dalam jumlah sangat besar dalam waktu sangat singkat.

Implementasikan throughput/transfer rate yang explicit.

Contoh:

```text
Space Elevator input throughput:
X items/sec
```

Transfer harus menggunakan `dt`.

Jangan mengambil satu item per frame.

Buat state:

```text
input buffer
transfer rate
current transfer progress
```

Contoh:

```text
dt = 0.1 sec
rate = 2 items/sec
transfer = 0.2 item-equivalent
```

Gunakan accumulator/fractional progress.

Milestone progress harus time-based, bukan frame-rate-based.

---

# 10. P0 — OUT-OF-BOUNDS TILE RETURN SELALU `(0,0)`

File:

`js/renderer3d.js`

Function:

`screenToTile()`

Saat ray hit ground plane tetapi berada di luar map:

```js
return { tileX: 0, tileY: 0 };
```

Ini menyebabkan cursor/ghost dapat tiba-tiba berpindah ke tile `(0,0)` saat mouse berada di luar map.

Ini adalah bug UX.

Ganti return state menjadi sesuatu yang dapat menyatakan:

```text
valid: false
```

Contoh:

```js
{
    valid: false,
    tileX: null,
    tileY: null
}
```

Callers harus memeriksa `valid`.

Jangan menggunakan `(0,0)` sebagai sentinel.

Pastikan:

- ghost hilang jika out of bounds
- building tidak ditempatkan
- hover badge hilang
- pipette tidak membaca `(0,0)`

---

# 11. P0 — CAMERA BISA KELUAR JAUH DARI MAP

Files:

`js/main.js`
`js/renderer3d.js`

Camera target dapat dipan/di-move tanpa clamp yang terlihat terhadap world bounds.

Pastikan camera tetap memiliki sensible bounds.

Berikan margin agar pemain tetap dapat melihat edge map.

Contoh konsep:

```text
world bounds
+
camera margin
```

Jangan membuat camera terkunci terlalu ketat.

---

# 12. P0 — GLOBAL KEYDOWN TRIGGER DAPAT REPEAT

File:

`js/main.js`

Action seperti:

```text
R
Q
C
E
H
Delete
Backspace
Space
```

diproses dalam global `keydown`.

Jika keyboard repeat aktif:

```text
holding R
```

dapat memutar building berkali-kali.

Begitu juga:

```text
holding C
```

dapat toggle cinematic mode secara berulang.

Perbaiki dengan:

```js
if (e.repeat) return;
```

untuk discrete actions.

Jangan memblok `WASD` continuous movement.

Bedakan:

```text
continuous input
```

vs:

```text
discrete action
```

Selain itu jangan memproses hotkeys tertentu ketika focus berada pada:

```text
input
textarea
select
button
```

kecuali memang diperlukan.

---

# 13. P0 — CLICK RESEARCH YANG SEDANG ACTIVE DAPAT RESET PROGRESS

File:

`js/ui.js`

Sekarang research card yang sedang active masih memiliki click handler:

```js
this.sim.setActiveTech(tech.id);
```

sedangkan:

```js
setActiveTech();
```

mengatur:

```js
this.techProgress = 0;
```

Akibatnya user bisa mengklik research yang sedang aktif dan kehilangan progress.

Perbaiki.

Klik research yang sedang active harus:

```text
no-op
```

atau membuka detail, bukan reset progress.

Ideal:

```text
Inactive → select
Active → no action
Completed → disabled
```

---

# 14. P1 — INSPECTOR DI-RENDER ULANG SETIAP FRAME

File:

`js/ui.js`

`updateHUD()` dipanggil setiap animation frame.

Ketika inspector terbuka:

```js
this.updateInspectorContent();
```

dipanggil terus.

`updateInspectorContent()` kemudian:

```text
generate HTML
innerHTML = html
attach event listeners
```

setiap frame.

Ini menghasilkan DOM churn sangat besar.

Lebih buruk lagi, listener seperti:

```text
recipeSelect
filterSelect
filterLeftSelect
filterRightSelect
overclockSlider
preset buttons
demolish button
```

dibuat ulang terus.

Refactor menjadi:

```text
Inspector initialization
+
Inspector state updates
```

Pisahkan:

```text
renderInspectorStatic()
updateInspectorValues()
```

Static DOM hanya dibuat ketika:

```text
different building selected
```

Dynamic values di-update tanpa mengganti seluruh `innerHTML`.

Idealnya:

- buka inspector → construct DOM sekali
- change building → rebuild once
- simulation update → update specific values only

---

# 15. P1 — ANALYTICS DI-RENDER ULANG SETIAP FRAME

File:

`js/ui.js`

`updateHUD()` dipanggil 60 FPS.

Ketika analytics terbuka:

```js
updateAnalyticsContent();
```

dipanggil setiap frame.

Function ini kemudian memanggil:

```text
renderPowerChart()
renderThroughputChart()
```

setiap frame.

Canvas chart tidak perlu dihitung 60 FPS.

Buat update frequency:

```text
HUD telemetry:
5–10 Hz

Analytics graph:
2–5 Hz

static content:
on change only
```

Jangan mengorbankan 60 FPS render game untuk chart.

---

# 16. P1 — MINIMAP TIDAK PERLU FULL REDRAW 60 FPS

File:

`js/ui.js`

`renderMinimap()` berjalan setiap animation frame.

Map sekarang 80×80 dan minimap melakukan banyak `fillRect()` tiap frame.

Buat minimap refresh system.

Update hanya ketika:

```text
building changed
camera moved significantly
resource state changed
```

atau gunakan throttle:

```text
5–10 FPS
```

World rendering tetap 60 FPS.

Minimap bukan bagian dari render loop utama.

---

# 17. P1 — POWER WIRES MENGALAMI MASSIVE ALLOCATION / LEAK

File:

`js/renderer3d.js`

Function:

`syncPowerWires()`

sekarang melakukan:

```js
this.catenaryWiresGroup.clear();
```

kemudian setiap frame membuat:

```text
LineBasicMaterial
BufferGeometry
Line
```

untuk setiap pair pole.

Masalah:

1. geometry dibuat ulang setiap frame
2. material dibuat ulang setiap frame
3. object lama dihapus tetapi tidak di-dispose
4. pair processing adalah O(N²)

Dengan factory besar ini akan menjadi sangat buruk.

Contoh:

```text
10 poles → 45 pairs
50 poles → 1225 pairs
100 poles → 4950 pairs
```

Jangan rebuild wires per frame.

Implementasikan:

```text
power network topology dirty
```

Ketika topology berubah:

```text
rebuild wires
```

Kalau topology tidak berubah:

```text
reuse existing wires
```

Gunakan edge cache.

Hanya buat wire untuk edge yang benar-benar ada.

Saat menghapus topology:

```text
dispose geometry
dispose material
remove line
```

Jangan membuat material baru untuk setiap wire jika material dapat shared.

---

# 18. P1 — CONVEYOR ITEM POOLING TIDAK BENAR-BENAR AMAN

File:

`js/renderer3d.js`

Function:

`syncConveyorItems()`

Current logic:

- push semua active mesh ke pool
- pop mesh
- jika `itemType` berbeda → create mesh baru
- mesh yang dipop tetapi tidak digunakan tidak selalu dikembalikan dengan benar

Ini dapat membuat object accumulation.

Refactor menjadi pool berdasarkan item type:

```text
pool[iron_ingot]
pool[copper_ingot]
pool[circuit]
...
```

atau generic pool yang benar-benar reset dengan aman.

Pastikan:

```text
active
inactive
recycled
destroyed
```

state jelas.

Tidak boleh ada mesh yang:

- hilang dari active list
- hilang dari pool
- tetap hidup di scene
- tidak pernah digunakan lagi

---

# 19. P1 — `syncBuildings()` TERLALU BANYAK `getObjectByName()`

File:

`js/renderer3d.js`

Setiap frame building melakukan lookup seperti:

```text
getObjectByName('drillAuger')
getObjectByName('moltenHearth')
getObjectByName('robotArm')
getObjectByName('hydraulicRam')
...
```

Ini lebih mahal dibanding menyimpan reference.

Saat mesh dibuat, cache component reference di `userData` atau object metadata.

Contoh:

```js
mesh.userData.animationParts = {
  mainArm,
  rotor,
  smokePoint,
  emissiveCore,
};
```

Kemudian:

```js
const arm = mesh.userData.animationParts.mainArm;
```

Jangan melakukan scene traversal setiap frame.

---

# 20. P1 — MAIN WEBGL RENDERER TERLALU MAHAL UNTUK CURRENT WEB PROTOTYPE

File:

`js/renderer3d.js`

Current:

```js
antialias: true
powerPreference: 'high-performance'
preserveDrawingBuffer: true
pixelRatio: Math.min(devicePixelRatio, 2)
shadowMap = enabled
2048 shadow map
```

`preserveDrawingBuffer` hanya boleh dipertahankan jika benar-benar dibutuhkan.

Audit apakah main renderer memerlukannya.

Jika tidak:

```text
remove preserveDrawingBuffer
```

Jangan menyamakan renderer utama dengan thumbnail renderer.

Untuk thumbnail renderer, preserveDrawingBuffer memang relevan karena screenshot/data URL digunakan.

Main renderer harus dioptimalkan berbeda.

Pertimbangkan adaptive pixel ratio.

Jangan mengunci DPR ke 2 pada hardware beresolusi tinggi jika menyebabkan performance drop.

---

# 21. P1 — RESOURCE RICHNESS SAAT INI HANYA DATA DUMMY

File:

`js/grid.js`

Resource memiliki:

```js
richness: Math.floor(1000 + Math.random() * 4000);
```

tetapi nilai richness tidak digunakan dalam mining simulation.

Akibatnya:

```text
resource richness
```

saat ini tidak memiliki gameplay effect.

Jangan langsung membuat depletion kompleks.

Minimal putuskan satu dari dua:

### Option A

Gunakan richness untuk menentukan extraction capacity/rate.

### Option B

Untuk sementara hapus misleading richness dari state dan dokumentasi.

Jangan mempertahankan property gameplay yang tidak punya effect.

---

# 22. P1 — TITANIUM DAN URANIUM BELUM TERSEDIA DI WORLD GENERATION

`data.js` memiliki:

```text
titanium_ore
uranium_ore
```

dan recipe untuk memprosesnya.

Tetapi `WorldGrid.generateResources()` saat ini hanya menghasilkan resource cluster awal seperti:

```text
iron
copper
coal
stone
crystal
```

Titanium dan uranium belum dibuat sebagai normal resource nodes.

Environment ore materials juga belum memiliki material khusus untuk kedua resource tersebut.

Akibatnya advanced recipe dapat menjadi inaccessible pada normal play.

Untuk fase ini:

Jangan membuat world expansion besar.

Minimal dokumentasikan dan tambahkan valid baseline:

```text
resource generation support
```

yang dapat menyediakan titanium/uranium secara deterministic/testing.

Jangan membuat random placement yang merusak spawn.

Gunakan resource tiering yang dapat dikembangkan nanti.

---

# 23. P1 — SAVE SYSTEM TIDAK MENYIMPAN STATE PENTING

File:

`js/ui.js`

Current save menyimpan:

```text
buildings
tech
activeTech
techProgress
milestone
```

tetapi banyak runtime state tidak disimpan.

Minimal audit dan perbaiki:

```text
building clockSpeed
building filterItem
smart splitter filters
heldItem
fuelTime
accumulator storedEnergy
belt items
belt split side
relevant production state
gameSpeed
world seed
camera state jika diinginkan
atmosphere mode jika dianggap persistent
player resources
```

Tidak semua animation state perlu disimpan.

Jangan menyimpan state visual yang dapat direconstruct.

Prinsip:

```text
SAVE GAME STATE
≠
SAVE RENDERER STATE
```

Setelah loading:

```text
restore simulation
→ rebuild links
→ rebuild power topology
→ rebuild renderer
```

---

# 24. P1 — IMPORT SAVE SALAH MENGANGGAP INVALID SAVE SEBAGAI SUKSES

File:

`js/ui.js`

Current:

```js
localStorage.setItem(...)
this.loadGame();
this.showToast('Imported', ...)
```

Namun `loadGame()` dapat return `false`.

Tetapi `importSave()` tetap menampilkan:

```text
Imported
Save game imported successfully!
```

Bahkan jika JSON invalid atau schema invalid.

Perbaiki:

```text
parse
→ validate schema
→ validate version
→ validate building IDs
→ validate coordinates
→ validate inventory
→ validate tech
→ only then commit to localStorage
```

Jika gagal:

```text
Import failed
Reason: Invalid save data
```

Jangan overwrite current valid save sebelum validation berhasil.

---

# 25. P1 — SAVE HARUS VERSIONED

Tambahkan:

```js
saveVersion;
```

Misalnya:

```json
{
  "saveVersion": 2,
  ...
}
```

Load system harus dapat:

```text
read current version
→ migrate old version
→ reject unsupported version safely
```

Jangan membuat future updates menghancurkan save lama.

---

# 26. P2 — BUILDING UNLOCK HARUS DILINDUNGI DI SIMULATION LAYER

Saat ini UI melakukan lock checking.

Tetapi source of truth harus tetap berada di game logic.

`WorldGrid.canPlace()` sebaiknya memastikan:

```text
building exists
AND
not tool
AND
building unlocked
AND
affordable
AND
placement valid
AND
terrain valid
```

Dengan begitu UI tidak dapat menjadi satu-satunya security/validity layer.

---

# 27. P2 — POWER STATUS HARUS MEMBEDAKAN CONNECTED DAN WORKING

Generator dapat terlihat `working` walaupun tidak terhubung ke power network.

Bedakan:

```text
WORKING
NO FUEL
DISCONNECTED
STANDBY
```

Consumer juga sebaiknya memiliki diagnosis yang lebih jelas:

```text
NO POWER
POWER LIMITED
WORKING
WAITING INPUT
OUTPUT BLOCKED
```

Jangan menyamakan semua state menjadi `working`.

---

# 28. P2 — INSPECTOR STATUS HARUS BERBASIS CAUSE

Inspector saat ini sudah memiliki status seperti:

```text
No Power
Waiting Inputs
Blocked
No Fuel
No Ore
```

Pertahankan, tetapi pastikan status tersebut berasal dari simulation state.

Jangan membuat status string terpisah yang dapat desync.

Source of truth:

```text
simulation state
```

UI hanya memvisualisasikan.

---

# 29. P2 — MILESTONE REWARD SAAT INI BANYAK YANG HANYA TEKS

Current milestone reward seperti:

```text
Unlocks basic logistics boost
Unlocks industrial overclocking
Unlocks planetary logistics
```

tetapi beberapa reward tidak benar-benar mempunyai effect sesuai deskripsi.

Jangan melakukan content expansion besar di fase ini.

Tetapi jangan biarkan UI menjanjikan mechanic yang belum ada.

Untuk sementara:

- implement reward secara nyata jika kecil
  atau
- ubah description agar akurat terhadap current implementation

Jangan berbohong kepada pemain melalui game text.

---

# 30. PERFORMANCE PRINCIPLE

Target:

```text
Game rendering: 60 FPS target
Simulation: deterministic-ish update
UI: event/state driven
Analytics: throttled
Minimap: throttled
Power wires: topology driven
Inspector: state updates
Assets: cached
Items: pooled
Buildings: cached references
```

Jangan menggunakan:

```text
"just optimize later"
```

untuk hal yang jelas menyebabkan per-frame allocation.

---

# 31. TEST MATRIX

Setelah perbaikan, test minimal:

## BASIC

- new game
- starter factory
- building placement
- invalid placement
- rotation
- demolish
- pipette
- camera pan
- camera orbit
- zoom

## POWER

- solar
- coal generator
- coal depletion
- generator restart
- consumer load
- brownout
- pole connection
- pole removal
- isolated generator
- multiple power networks
- accumulator
- nuclear generator

## LOGISTICS

- belt
- fast belt
- splitter
- merger
- underground belt
- smart splitter
- inserter
- long inserter
- conveyor lift
- belt crossing
- conveyor bridge

## PRODUCTION

- machine no recipe
- machine waiting inputs
- machine working
- machine blocked
- output transfer
- overclock
- recipe switching

## RESEARCH

- single cost
- multi-cost
- research progress
- active research clicked again
- completed research
- locked recipe
- unlocked recipe
- multiple labs

## MILESTONE

- input buffer
- transfer speed
- progress
- completion
- animation trigger
- next milestone

## SAVE

- save
- load
- restart browser
- corrupt save
- invalid import
- old save version
- filters
- clock speed
- fuel
- accumulator energy
- belt item state

---

# 32. PERFORMANCE TEST

Create controlled test scenarios.

Test:

```text
100 buildings
500 buildings
1000 buildings
```

and:

```text
100 belts
500 belts
1000 belts
```

Measure approximately:

```text
FPS
frame time
JS execution cost
object count
geometry count
material count
DOM update frequency
power wire count
active item mesh count
```

Do not claim performance improvements without measurement.

---

# 33. DEBUG INSTRUMENTATION

Add a lightweight developer diagnostics mechanism.

Examples:

```text
F3 / debug mode
```

with:

```text
FPS
Frame Time
Buildings
Belts
Items
Power Networks
Power Capacity
Power Demand
Active UI Updates
Particle Count
Renderer Objects
```

Do not show this permanently to normal players.

Developer mode only.

---

# 34. REGRESSION PRINCIPLE

After fixing one subsystem, ensure the fix does not break another.

Examples:

Power fix must not break:

- research
- production
- UI telemetry

Save fix must not break:

- building reconstruction
- underground linking
- power network reconstruction

Renderer optimization must not break:

- animation
- item positions
- hover
- ghost placement

Recipe lock must not break:

- default recipes
- existing saves
- research progression

---

# 35. DO NOT DO THESE THINGS YET

Jangan sekarang:

- menambahkan ratusan building
- membuat NPC civilization
- membuat railway system penuh
- membuat drone civilization
- membuat planetary map
- membuat Android version
- migrasi Unity
- mengganti Three.js
- rewrite seluruh UI
- mengganti visual style secara total
- membuat giant procedural world
- membuat multiplayer

Semua itu datang setelah baseline stabil.

---

# 36. REQUIRED OUTPUT

Sebelum coding:

buat:

`docs/CURRENT_STABILIZATION_PLAN.md`

isi:

```text
P0 bugs
P1 bugs
P2 bugs
Performance issues
Gameplay consistency issues
Test strategy
```

Setelah coding:

buat:

`docs/CURRENT_STABILIZATION_REPORT.md`

isi:

```text
Fixed
Partially Fixed
Not Fixed
Why Not Fixed
Performance Changes
Known Remaining Issues
```

Jangan menulis “fixed” kalau hanya mengubah UI tanpa memperbaiki simulation.

---

# 37. IMPLEMENTATION ORDER

Kerjakan DALAM urutan ini:

```text
1. duplicate handleSimEvent
2. power state synchronization
3. research multi-cost
4. recipe unlock enforcement
5. building construction economy
6. conveyor bridge simulation
7. space elevator transfer rate
8. out-of-bounds tile handling
9. keyboard repeat protection
10. active research reset bug
11. save/load completeness
12. import validation
13. power wire caching + disposal
14. item pooling
15. inspector throttling/state updates
16. analytics throttling
17. minimap throttling
18. renderer/cache optimization
19. resource tier consistency
20. regression tests
```

Jangan melompat langsung ke nomor 14 sebelum nomor 1–10 stabil.

---

# FINAL INSTRUCTION

Nexus Automata SUDAH memiliki fondasi.

Jangan perlakukan repository ini seperti project kosong.

Tugas kamu sekarang adalah:

> **Repair → Stabilize → Profile → Verify**

Bukan:

> **Rewrite → Add random features → Hope it works**

Pertahankan identitas dan arsitektur yang sudah ada.

Setiap perubahan harus membuat prototype sekarang lebih stabil dan lebih siap menerima expansion berikutnya.
