# Nexus Automata — Web Factory Automation Simulator 🏭⚡

**Nexus Automata** adalah game simulasi pabrik dan logistik otomasi berbasis web modern (terinspirasi dari **Factorio**, **Satisfactory**, dan **Builderment**), dibangun menggunakan arsitektur **HTML5 Canvas 60 FPS**, sistem desain **Glass Dark Premium**, dan **Web Audio API procedural sound synthesizer**.

---

## 🌟 Fitur Utama

1. **Sistem Konveyor Cerdas (Smart Conveyor Network)**:
   - Conveyor belt 4 arah dengan interpolasi posisi item sub-tile yang mulus.
   - Deteksi kemacetan (*item queuing & anti-clipping*).
   - **Splitters**: Membagi aliran item 1-ke-2 secara bergiliran (*round-robin*).
   - **Mergers**: Menyatukan beberapa jalur konveyor menjadi satu.
   - **Underground Belts (Tunnels)**: Melewati bawah tanah sejauh 4 petak untuk persilangan jalur logistik tanpa tabrakan.

2. **Mesin Manufaktur & Resep Berjenjang**:
   - **Mining Drill**: Menambang *Iron Ore*, *Copper Ore*, *Coal*, *Stone*, dan *Rare Crystal*.
   - **Electric Smelter**: Peleburan Ore menjadi Ingot dan Steel Plates.
   - **Automated Workshop (Assembler)**: Merakit Copper Wire, Iron Gear, Electronic Circuit, Electric Motors, dan Science Packs.
   - **Storage Silo**: Buffer penyimpanan berkapasitas 250 item dengan indikator visual.
   - **Nexus Research Lab**: Laboratorium sains untuk membuka cabang teknologi baru.
   - **Orbital Space Elevator**: Sasaran ekspansi koloni melalui fase milestone pengiriman material.

3. **Jaringan Listrik Real-Time (Power Grid Simulation)**:
   - **Coal Power Plant**: Membakar batubara untuk menghasilkan daya 50 kW.
   - **Solar Array**: Menghasilkan 20 kW energi terbarukan tanpa bahan bakar.
   - **Power Substation Pole**: Tiang distribusi listrik dengan radius 5 petak dan kabel listrik bergelombang (*catenary wires*).
   - Efek *Brownout*: Kecepatan produksi mesin melambat secara proporsional jika kapasitas listrik pabrik di bawah total permintaan.

4. **Desain Glass Dark Premium**:
   - Palet warna obsidian dark mode (`#08080C`) dengan specular highlight asimetris.
   - **Glass Dock Navigation**: Hotbar melayang di bagian bawah dengan kategori *Logistics*, *Production*, *Power*, *Special*, dan *Tools*.
   - **Machine Diagnostics Modal**: Inspeksi inventaris input/output, status operasi, rasio daya, dan progress bar neon real-time.
   - **Tech Tree Modal**: Pohon riset teknologi interaktif.
   - **Toast Notification Stack**: Notifikasi mengambang saat riset dan milestone selesai.
   - **Minimap Radar**: Survei area 80x80 petak dengan posisi deposit dan kamera.

5. **Audio Engine Prosedural (Web Audio API)**:
   - Suara sintetis dinamis tanpa dependensi file audio eksternal (bunyi konveyor, dentuman penempatan, dekonstruksi, rotasi, dan arpeggio riset selesai).

6. **Penyimpanan Lokal (Save / Load / Export / Import)**:
   - Otomatis menyimpan setiap 30 detik ke `localStorage`.
   - Fitur salin kode simpan (*Save JSON string*) untuk backup.

---

## 🎮 Kontrol Permainan

| Tombol / Aksi | Fungsi |
|---|---|
| **Klik Kiri** | Menempatkan bangunan yang dipilih pada petak |
| **Klik Kiri + Tahan Drag** | Menarik jalur konveyor belt secara bersambung |
| **Klik Tengah / Kanan Drag** | Menggeser kamera (*Pan Viewport*) |
| **WASD / Tombol Panah** | Menggeser kamera (*Camera Pan*) |
| **Scroll Roda Mouse** | Zoom in / Zoom out ke arah kursor |
| **R** | Memutar arah hadap bangunan (*Rotate North → East → South → West*) |
| **Q** | Alat pipet (*Pipet / Sample*) untuk memilih bangunan yang sedang disorot |
| **E** | Membuka Pohon Riset Teknologi (*Tech Tree*) |
| **Spasi (Spacebar)** | Menjeda / Melanjutkan simulasi (*Pause / Resume*) |
| **Angka 1 - 9** | Pintasan cepat memilih bangunan pada hotbar aktif |
| **Delete / Backspace** | Beralih ke alat bongkar bangunan (*Demolish / Deconstruct*) |
| **Escape (Esc)** | Menutup modal / kembali ke alat inspeksi kursor |

---

## 🚀 Cara Menjalankan

Aplikasi ini sepenuhnya statis (HTML/CSS/JS modern ES Modules). Dapat dijalankan melalui web server lokal apa pun:

```bash
# Menggunakan Python:
python -m http.server 8080

# Atau menggunakan Node (npx serve / live-server):
npx serve .
```

Buka `http://localhost:8080` pada browser modern apa pun (Chrome, Edge, Firefox, Brave, Safari).
