// Fungsi untuk menangani pencarian dari header search bar
function handleHeaderSearch(event) {
    event.preventDefault() // Mencegah halaman direload

    const searchQuery = document.getElementById('headerSearchBar').value

    if (searchQuery === '') {
        alert('You searched for nothing!')
        return
    }

    // Simpan ke LocalStorage
    localStorage.setItem('searchQuery', searchQuery)
    
    // Arahkan ke shop.html
    window.location.href = 'shop.html'
}

// Fungsi untuk menangani pencarian dari home section search bar
function handleHomeSearch(event) {
    event.preventDefault() // Mencegah halaman direload

    const searchQuery = document.getElementById('homeSearchBar').value

    if (searchQuery === '') {
        alert('You searched for nothing!')
        return
    }
    
    // Simpan ke LocalStorage
    localStorage.setItem('searchQuery', searchQuery)
    
    // Arahkan ke shop.html
    window.location.href = 'shop.html'
}

function handleSearch() {
    // Ambil nilai pencarian
    const searchQuery = document.getElementById('searchBar').value

    // Simpan ke LocalStorage
    localStorage.setItem('searchQuery', searchQuery)

    // Arahkan ke shop.html
    window.location.href = 'shop.html'
}