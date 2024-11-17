// Fungsi untuk mengubah tampilan filter saat di klik
function toggleFilter(element) {
    const filterSection = element.parentElement;
    
    const filterOptions = filterSection.querySelector('.filter-options');
    
    // Memeriksa apakah section filter saat ini dalam keadaan aktif
    if (filterSection.classList.contains('active')) {
        filterOptions.style.height = '0px';
        // Hapus kelas 'active' dari section filter
        filterSection.classList.remove('active');
    } else {
        // Jika tidak aktif, hitung tinggi penuh dari filterOptions
        const fullHeight = filterOptions.scrollHeight + 'px';
        filterOptions.style.height = fullHeight;
        // Tambahkan kelas 'active' ke section filter
        filterSection.classList.add('active');
    }
}
