var darkTheme = document.getElementById("dark-theme");

// Mengecek apakah tema yang disimpan di localStorage adalah "dark"
if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("darkmode");
    darkTheme.src = "images/icon/sun.png";
} else {
    darkTheme.src = "images/icon/moon.png";
}

// Menambahkan event listener untuk ikon tema gelap saat diklik
darkTheme.onclick = function() {
    // Mengubah kelas "darkmode" pada body
    document.body.classList.toggle("darkmode");

    // Mengecek apakah body sekarang memiliki kelas "darkmode"
    if (document.body.classList.contains("darkmode")) {
        darkTheme.src = "images/icon/sun.png";
        // Simpan tema "dark" di localStorage
        localStorage.setItem("theme", "dark"); 
    } else {
        darkTheme.src = "images/icon/moon.png";
        // Simpan tema "light" di localStorage
        localStorage.setItem("theme", "light"); 
    }
}
