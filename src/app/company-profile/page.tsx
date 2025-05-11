export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow bg-white">
        <h1 className="text-2xl font-bold text-blue-600">PLN Scheduler</h1>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-blue-600">
            Fitur
          </a>
          <a href="#about" className="hover:text-blue-600">
            Tentang
          </a>
          <a
            href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20bertanya%20tentang%20layanan%20Anda"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            Kontak
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-10 bg-white">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl font-bold text-blue-700">
            Jadwalkan Maintenance PLN dengan Mudah
          </h2>
          <p className="text-lg">
            Aplikasi berbasis web untuk pengelolaan dan penjadwalan pemeliharaan
            infrastruktur PLN lebih efisien.
          </p>
          <a
            href="#features"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Lihat Fitur
          </a>
        </div>
        <div className="border mt-8 md:mt-0">
          <img
            src="https://puriraharja.com/img/post/kerjasama/7150856-pt-indonesia-power.jpg"
            alt="Maintenance Illustration"
            className="w-full bg-cover rounded-lg shadow"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="p-10 bg-gray-100">
        <h3 className="text-3xl font-semibold text-center mb-8">Fitur Utama</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <img
              src="/imagee.png"
              alt="Penjadwalan Fleksibel"
              className="mx-auto mb-4 h-24"
            />
            <h4 className="font-semibold text-lg mb-2">
              Penjadwalan Fleksibel
            </h4>
            <p>Atur jadwal maintenance berdasarkan prioritas dan lokasi.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <img
              src="/imageee.png"
              alt="Data Real-Time"
              className="mx-auto mb-4 h-24"
            />
            <h4 className="font-semibold text-lg mb-2">Data Real-Time</h4>
            <p>Terima update data sebelum jadwal maintenance dimulai.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <img
              src="/image.png"
              alt="Easy Monitoring"
              className="mx-auto mb-4 h-24"
            />
            <h4 className="font-semibold text-lg mb-2">Easy Monitoring</h4>
            <p>Rekap aktivitas pemeliharaan mudah dan efisien.</p>
          </div>
        </div>
      </section>

      {/* About / Testimoni */}
      <section id="about" className="p-10 bg-white">
        <img
          src={"/logo.png"}
          className="border mx-auto w-64 h-64 rounded-md mb-6"
        />
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-semibold">Tentang Aplikasi</h3>
          <p>
            Dibuat untuk mendukung kinerja tim maintenance PLN dalam mengelola
            dan menjadwalkan pekerjaan dengan lebih efisien, mengurangi
            downtime, dan meningkatkan keandalan layanan.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 bg-blue-800 text-white text-center">
        <p>
          &copy; {new Date().getFullYear()} PLN Scheduler. Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
}
