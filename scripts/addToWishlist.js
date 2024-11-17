// Fungsi untuk menambah atau menghapus item dari wishlist
function addToWishlist(name, image, price, sold, stars, element) {
     // Mengambil item wishlist dari localStorage dan mengubahnya menjadi array JavaScript
    // Jika belum ada item wishlist, diinisialisasi sebagai array kosong
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    // Memeriksa apakah item sudah ada di dalam wishlist
    const existingItem = wishlistItems.find(item => item.name === name);
``
    if (existingItem) {
        // Jika item sudah ada, hapus dari wishlist
        const updatedWishlist = wishlistItems.filter(item => item.name !== name);
        localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
        alert('Item dihapus dari wishlist!');
        updateIconState(name, false, element); // Memperbarui ikon hati
    } else {
        // Jika item belum ada, tambahkan ke wishlist
        wishlistItems.push({ name, image, price, sold, stars });
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        alert('Item ditambahkan ke wishlist!');
        updateIconState(name, true, element); // Memperbarui ikon hati
    }
}

function updateIconState(productName, isAdded, element) {
   // Mengambil status ikon dari localStorage
   let iconStates = JSON.parse(localStorage.getItem('wishlistIconStates')) || {};

   // Memperbarui status ikon di localStorage
   if (isAdded) {
    // Menandai bahwa produk ada di wishlist
       iconStates[productName] = true;  
   } else {
    // Menghapus status jika tidak ada di wishlist
       delete iconStates[productName];  
   }

   // Memperbarui tampilan ikon secara visual
   const heartIcon = element.querySelector('i');
   if (isAdded) {
       heartIcon.classList.remove('fa-regular');
       heartIcon.classList.add('fa-solid');
       heartIcon.style.color = 'var(--secondary-color)';
   } else {
       heartIcon.classList.remove('fa-solid');
       heartIcon.classList.add('fa-regular');
       heartIcon.style.color = 'gray';
   }

   // Menyimpan status ikon ke localStorage
   localStorage.setItem('wishlistIconStates', JSON.stringify(iconStates));
}

// Fungsi untuk memuat status ikon hati yang disimpan dari localStorage
function loadIconStates() {
    // Mengembalikan status ikon dari localStorage atau objek kosong jika belum ada
    return JSON.parse(localStorage.getItem('wishlistIconStates')) || {}; 
}

export { addToWishlist, loadIconStates };
