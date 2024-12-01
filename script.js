// Variabel global untuk indeks gambar saat ini
let currentIndex = 0;

// Fungsi utama untuk menambahkan efek lightbox pada gambar
function tambahkanLightbox() {
  // Mengambil elemen-elemen DOM yang diperlukan
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const images = document.querySelectorAll(".galeri-container img");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const downloadBtn = document.getElementById("download-btn");

  // Variabel untuk menangani swipe
  let touchStartX = 0;
  let touchEndX = 0;

  // Fungsi untuk menangani swipe
  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      navigateImage(1); // Swipe ke kiri
    }
    if (touchEndX - touchStartX > 50) {
      navigateImage(-1); // Swipe ke kanan
    }
  }

  // Menambahkan event listener untuk swipe pada modalImg (untuk perangkat sentuh)
  modalImg.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  modalImg.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  // Menambahkan event listener untuk swipe pada modal (untuk desktop)
  modal.addEventListener("mousedown", (e) => {
    touchStartX = e.clientX;
  });

  modal.addEventListener("mouseup", (e) => {
    touchEndX = e.clientX;
    handleSwipe();
  });

  // Fungsi untuk membuka modal
  function openModal(index) {
    currentIndex = index;
    modal.style.display = "block";
    modalImg.src = images[currentIndex].src;
    modal.focus(); // Menambahkan fokus ke modal untuk aksesibilitas

    // Memastikan gambar dipusatkan segera setelah dimuat
    modalImg.onload = () => {
      centerImage();
    };
  }

  // Menambahkan event listener untuk orientasi layar
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      centerImage();
    }, 100);
  });

  // Fungsi untuk menutup modal
  function closeModal() {
    modal.style.display = "none";
    images[currentIndex].focus(); // Mengembalikan fokus ke elemen yang membuka modal
  }

  // Fungsi untuk navigasi gambar
  function navigateImage(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
  }

  // Menambahkan event listener untuk setiap gambar
  images.forEach((img, index) => {
    img.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openModal(index);
    });
    // Menambahkan atribut alt jika belum ada
    if (!img.alt) img.alt = `Gambar ${index + 1}`;
  });

  // Menambahkan event listener untuk tombol keyboard
  document.addEventListener("keydown", (e) => {
    if (modal.style.display === "block") {
      if (e.key === "ArrowLeft") {
        e.preventDefault(); // Mencegah scroll default
        navigateImage(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault(); // Mencegah scroll default
        navigateImage(1);
      }
      if (e.key === "Escape") {
        closeModal();
      }
    }
  });

  // Fungsi untuk mengunduh gambar
  downloadBtn.onclick = function () {
    if (confirm("Apakah Anda ingin mengunduh gambar ini?")) {
      const link = document.createElement("a");
      link.href = modalImg.src;
      link.download = `gambar_${currentIndex + 1}.jpg`;
      link.target = "_blank"; // Membuka di tab baru
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Gambar sedang diunduh. Silakan periksa folder unduhan Anda.");
    }
  };

  // Menutup modal jika mengklik di luar gambar
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

// Fungsi untuk menambahkan animasi scroll halus
function tambahkanScrollHalus() {
  const tautan = document.querySelectorAll("nav a");

  tautan.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElemen = document.getElementById(targetId);

      if (targetElemen) {
        targetElemen.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}

// Jalankan fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  tambahkanLightbox();
  tambahkanScrollHalus();
  sembunyikanTitik(); // Pastikan fungsi ini sudah didefinisikan di tempat lain
});
