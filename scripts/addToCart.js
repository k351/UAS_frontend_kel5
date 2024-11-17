    //Fungsi untuk menambah item pada cart
function addToCart(name, image, price) {
    // Mengambil item keranjang dari localStorage dan mengubahnya menjadi array JavaScript/JSON
    // Jika belum ada item keranjang, maka diinisialisasi sebagai array kosong
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Mencari apakah item yang akan ditambahkan sudah ada di dalam keranjang
    const existingItem = cartItems.find(item => item.name === name);

    if (existingItem) {
        // Jika item sudah ada, tingkatkan kuantitasnya sebanyak 1
        existingItem.quantity += 1;
    } else {
        // Jika item belum ada, tambahkan item baru dengan kuantitas 1
        cartItems.push({ name, image, price, quantity: 1 });
    }

    // Menyimpan kembali array item keranjang yang sudah diperbarui ke dalam localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Menampilkan pesan notifikasi bahwa item berhasil ditambahkan ke keranjang
    alert('Item added to cart!');
}
