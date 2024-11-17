    //Fungsi untuk mengarahkan ke halaman produk-produk dengan filter berdasarakan kategori
function handleCategoryFilter(event) {
    // Mencegah perilaku default dari elemen
    event.preventDefault(); 

    // Mengambil nilai kategori filter dari atribut 'data-category' elemen yang diklik
    const filterQuery = event.currentTarget.getAttribute('data-category');
    
    // Menyimpan query filter ke dalam localStorage agar bisa digunakan di halaman lain
    localStorage.setItem('filterQuery', filterQuery);

    // Mengarahkan pengguna ke halaman 'shop.html' untuk melihat hasil filter
    window.location.href = 'shop.html';
}