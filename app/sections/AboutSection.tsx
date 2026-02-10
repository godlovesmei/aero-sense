"use client";

import {
  InfoIcon,
  CircuitBoardIcon,
  WindIcon,
  CheckCircleIcon,
  ActivityIcon,
  BellIcon,
  BarChart3 as ChartIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";

export default function AboutSection() {
  const sensors = [
    {
      name: "MQ-7",
      description: "Carbon Monoxide (CO) Sensor",
      details:
        "Mendeteksi gas karbon monoksida yang berbahaya. Sensor ini sangat sensitif terhadap CO dan dapat mendeteksi konsentrasi gas dari 20 hingga 2000 ppm.",
      color: "from-red-500 to-orange-500",
      icon: "🔥",
    },
    {
      name: "MQ-131",
      description: "Ozone (O₃) Sensor",
      details:
        "Mengukur konsentrasi ozon di udara. Sensor ini dapat mendeteksi ozon dalam rentang 10 ppb hingga 2 ppm, penting untuk memantau kualitas udara dalam ruangan.",
      color: "from-blue-500 to-cyan-500",
      icon: "☁️",
    },
    {
      name: "MQ-135",
      description: "Air Quality Sensor",
      details:
        "Sensor kualitas udara yang dapat mendeteksi berbagai gas seperti NH₃, NOx, alkohol, benzena, asap, dan CO₂. Ideal untuk sistem monitoring kualitas udara komprehensif.",
      color: "from-green-500 to-emerald-500",
      icon: "🌿",
    },
    {
      name: "DHT-22",
      description: "Temperature & Humidity Sensor",
      details:
        "Sensor digital yang mengukur suhu dan kelembaban dengan akurasi tinggi. Rentang pengukuran: suhu -40°C hingga 80°C dan kelembaban 0-100% RH.",
      color: "from-sky-500 to-blue-500",
      icon: "🌡️",
    },
  ];

  const features = [
    {
      title: "Monitoring Real-time",
      description: "Pantau kualitas udara secara langsung dengan update data setiap detik",
      icon: <ActivityIcon className="h-6 w-6" />,
    },
    {
      title: "Multi-sensor",
      description: "Menggunakan 4 sensor berbeda untuk deteksi komprehensif",
      icon: <CircuitBoardIcon className="h-6 w-6" />,
    },
    {
      title: "Notifikasi Otomatis",
      description: "Dapatkan peringatan ketika kualitas udara mencapai level berbahaya",
      icon: <BellIcon className="h-6 w-6" />,
    },
    {
      title: "Data Historis",
      description: "Akses riwayat data untuk analisis tren kualitas udara",
      icon: <ChartIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-500 p-8 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
            <InfoIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Tentang AeroSense</h1>
            <p className="text-cyan-50">Sistem monitoring kualitas udara berbasis IoT</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-900">
          <CircuitBoardIcon className="mr-3 h-6 w-6 text-cyan-600" />
          Tentang Sistem
        </h2>

        <div className="space-y-4 leading-relaxed text-gray-700">
          <p>
            AeroSense adalah sistem monitoring kualitas udara dalam ruangan berbasis Internet of
            Things (IoT) yang dirancang untuk memantau berbagai parameter kualitas udara secara
            real-time.
          </p>
          <p>
            Dengan AeroSense, pengguna dapat memantau kualitas udara melalui dashboard interaktif
            yang menampilkan data real-time, grafik historis, dan notifikasi otomatis ketika kualitas
            udara mencapai level yang tidak aman.
          </p>
          <p>
            Data yang dikumpulkan membantu pengguna mengambil keputusan terkait ventilasi,
            penggunaan penjernih udara, dan tindakan pencegahan lain untuk menjaga kualitas udara
            optimal.
          </p>
        </div>
      </div>

      {/* Sensors Section */}
      <div>
        <h2 className="mb-6 flex items-center text-2xl font-bold text-gray-900">
          <WindIcon className="mr-3 h-6 w-6 text-cyan-600" />
          Sensor yang Digunakan
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sensors.map((sensor, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className={`bg-gradient-to-r ${sensor.color} p-6 text-white`}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-2xl font-bold">{sensor.name}</h3>
                    <p className="text-sm font-medium text-white/90">{sensor.description}</p>
                  </div>
                  <span className="text-4xl">{sensor.icon}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <p className="text-sm leading-relaxed text-gray-700">{sensor.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-500 p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Keunggulan AeroSense</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-white/20 p-3">{f.icon}</div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-cyan-50">{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-white/10 p-4 text-sm text-cyan-50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              Real-time dashboard
            </span>
            <span className="opacity-60">•</span>
            <span className="inline-flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              Alert otomatis
            </span>
            <span className="opacity-60">•</span>
            <span className="inline-flex items-center gap-2">
              <ChartIcon className="h-4 w-4" />
              Analisis historis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
