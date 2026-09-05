

---

### 1. Tragedi "Cara" vs Vercel: Viral Malah Terancam Bangkrut ($96.280 dalam Semalam)

* **Pelaku/Korban:** Jingna Zhang, seorang fotografer dan *indie founder* yang membuat platform portofolio seni bernama **Cara**.


* **Kronologi:** Ketika Instagram dan Meta mengubah kebijakan privasi untuk melatih AI menggunakan karya para seniman, jutaan seniman di seluruh dunia berbondong-bondong memboikot Meta dan pindah ke platform Cara dalam hitungan hari.


* **Petaka:** Aplikasi Cara menggunakan arsitektur *serverless* di Vercel. Lonjakan pengguna baru membuat pemanggilan fungsi serverless Vercel meledak hingga **56 juta invokasi per hari**. Karena Vercel tidak memiliki *hard spend cap* (hanya *metered billing*), sistem terus melayani trafik tanpa henti.


* **Hasil:** Sang pendiri mendapati tagihan Vercel meroket hingga **$96.280 (sekitar Rp1,5 Miliar)**. Sebagai proyek independen (*bootstrapped*) yang belum memonetisasi pengguna, tagihan miliaran rupiah ini nyaris membunuh bisnis mereka dalam sekejap sebelum komunitas mendesak adanya negosiasi dan penggalangan dana darurat.



---

### 2. Kematian Total "Code Spaces": Lenyap dalam 12 Jam karena Pemerasan Hacker

* **Pelaku/Korban:** Code Spaces, sebuah layanan hosting repositori kode dan manajemen proyek Git/SVN yang dibangun oleh tim kecil.
* **Kronologi:** Pada pertengahan tahun 2014, peretas berhasil menyusup ke dalam konsol AWS manajemen induk milik Code Spaces. Hacker tersebut tidak langsung merusak sistem, melainkan menghubungi founder Code Spaces dan meminta tebusan uang dalam jumlah besar jika ingin akunnya dikembalikan.
* **Petaka:** Founder Code Spaces mencoba melawan. Mereka tidak membayar tebusan, melainkan mencoba mengambil alih kembali akun AWS mereka dengan mengganti password dan mencabut akses hacker.
* **Hasil Bencana:** Menyadari pihak Code Spaces mencoba merebut kembali akunnya, hacker langsung mengaktifkan serangan balasan (*scorched-earth*). Dalam hitungan jam, hacker **menghapus semua instance EC2, memformat EBS storage, menghapus bucket S3, serta menghapus seluruh salinan cadangan (*backup offsite*)**. Seluruh data pelanggan hilang tanpa sisa. Keesokan harinya, Code Spaces merilis surat perpisahan: perusahaan terpaksa tutup permanen karena biaya memulihkan data yang sudah lenyap mustahil dilakukan.

---

### 3. Website Portofolio Audio Gratis Dihantam Bot Netlify ($104.500)

* **Pelaku/Korban:** Seorang developer yang membuat website portofolio audio eksperimental yang sudah terbengkalai selama 4 tahun.


* **Kronologi:** Website tersebut hanya memuat satu file MP3 kecil dan di-hosting pada *free tier* Netlify.


* **Petaka:** Tiba-tiba ada jaringan bot/DDoS yang menemukan link file MP3 tersebut dan mengunduhnya secara berulang-ulang miliaran kali dalam rentang 4 hari. Trafik *bandwidth* keluar (*egress*) membengkak hingga **60,7 TB dalam satu hari**, dengan total konsumsi mencapai **190 TB**. Karena Netlify mengenakan tarif sekitar $55 per 100 GB kelebihan *bandwidth*, argonya terus berputar.


* **Hasil:** Developer tersebut menerima email tagihan otomatis sebesar **$104.500 (Rp1,65 Miliar)** untuk sebuah situs gratis yang bahkan sudah lama tidak disentuh. Kasus ini sempat membuat geger jagat Hacker News dan Reddit sebelum pihak platform akhirnya membatalkan tagihan tersebut setelah viral dan dihujat publik.



---

### 4. Bencana "Infinite Loop" Database Serverless ($70.000+ dalam Satu Malam)

* **Pelaku/Korban:** Developer aplikasi mobile yang mengintegrasikan basis data *real-time* berbasis *serverless* (Firebase / Cloud Functions).


* **Kronologi:** Developer membuat fitur sinkronisasi: jika ada dokumen baru di database, sebuah fungsi *cloud* akan berjalan untuk menambahkan stempel waktu (*timestamp*) dan status dokumen.


* **Petaka:** Terjadi kesalahan logika (*bug*) 2 baris kode: proses pembaruan stempel waktu tersebut dideteksi oleh sistem sebagai "perubahan dokumen baru". Akibatnya, fungsi memanggil dirinya sendiri kembali secara rekursif (*infinite loop*).


* **Hasil:** Karena sifat arsitektur *serverless* yang dirancang untuk secara otomatis membuat instans baru tanpa batas (*instant auto-scale*), jutaan fungsi paralel dieksekusi setiap detiknya saat sang developer sedang tidur. Ketika terbangun di pagi hari, dasbor menunjukkan tagihan antara **$70.000 hingga $72.000 (lebih dari Rp1,1 Miliar)** hanya dari miliaran operasi *read/write* yang terjadi semalaman.



---

### 5. Kunci AWS Bocor ke GitHub: Serbuan Bot Penambang Kripto ($40.000 – $60.000)

* **Pelaku/Korban:** Developer individu yang sedang terburu-buru mengerjakan *side project* di akhir pekan.


* **Kronologi:** Saat mengetik `git add .` dan `git commit`, file `.env` yang berisi `AWS_ACCESS_KEY_ID` dan `AWS_SECRET_ACCESS_KEY` tidak sengaja ikut terunggah ke repositori GitHub publik.


* **Petaka:** Hacker di seluruh dunia menjalankan bot pemindai (*crawler*) yang memantau feed *commit* publik GitHub secara *real-time*. Hanya butuh waktu **3 hingga 10 detik** setelah tombol push ditekan, kunci rahasia tersebut sudah tersedot oleh bot.


* **Hasil:** Bot langsung menggunakan API AWS untuk membuka puluhan mesin virtual kelas berat yang dilengkapi kartu grafis (*GPU instances* seperti `p3.16xlarge`) di seluruh wilayah (*regions*) dunia (Frankfurt, Virginia, Tokyo) untuk menambang koin kripto. Dalam waktu kurang dari 8 jam, akun AWS tersebut menumpuk tagihan komputasi senilai **$40.000 – $60.000 (Rp600–900 Juta)**.



---

