const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Menambahkan event ketika diklik mengganti kelas secara dianmis
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

// Menambahkan even listener pada setiap nav-link untuk mengghapus kelas aktif
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))