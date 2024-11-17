// Fungsi untuk memuat item dari localStorage dan menampilkannya di keranjang
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Ambil item keranjang dari localStorage
    const cartBody = document.getElementById('cart-items'); // Dapatkan elemen untuk menampilkan item
    const checkoutButton = document.querySelector('#cart-total .normal'); // Dapatkan tombol checkout
    
    cartBody.innerHTML = ''; 

    if (cartItems.length > 0) { 
        cartItems.forEach(item => {
            const itemName = item.name || 'Unknown Product'; // Ambil nama item
            const itemImage = item.image || 'icon/Jeans.png'; // Ambil gambar item
            const itemPrice = item.price || 'Rp0'; // Ambil harga item
            const itemQuantity = item.quantity || 1; // Ambil jumlah item

            // Hanya lanjutkan jika itemPrice didefinisikan dan valid
            if (itemPrice && itemName !== 'Unknown Product') {
                const row = document.createElement('tr'); // Buat elemen baris baru
                row.innerHTML = `
                    <td><a href="#" onclick="removeItem('${itemName}')"><i class="fa-regular fa-circle-xmark"></i></a></td>
                    <td><img src="${itemImage}" alt=""></td>
                    <td>${itemName}</td>
                    <td>${itemPrice}</td>
                    <td><input type="number" value="${itemQuantity}" min="1" onchange="updateQuantity('${itemName}', this.value)"></td>
                    <td>${(parseFloat(itemPrice.replace(/Rp/g, '').replace(/\./g, '').trim()) * itemQuantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                `;
                cartBody.appendChild(row); // Tambahkan baris ke keranjang
            }
        });
        checkoutButton.style.display = 'block'; // Tampilkan tombol checkout
    } else {
        checkoutButton.style.display = 'none'; // Sembunyikan tombol checkout
    }

    updateCartTotal(cartItems); // Perbarui total keranjang di akhir
}

// Fungsi untuk memperbarui jumlah item
function updateQuantity(name, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems = cartItems.map(item => {
        if (item.name === name) {
            item.quantity = parseInt(newQuantity); // Perbarui jumlah item
        }
        return item;
    });

    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Simpan kembali ke localStorage
    loadCartItems();
}

// Fungsi untuk menghapus item dari keranjang
function removeItem(name) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.name !== name); // Hapus item dari keranjang
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Simpan kembali ke localStorage
    loadCartItems(); 
}

// Fungsi untuk memperbarui total biaya keranjang
function updateCartTotal(cartItems) {
    const couponDiscount = parseInt(localStorage.getItem('couponDiscount')) || 0; // Dapatkan diskon kupon
    const total = cartItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price.replace(/Rp/g, '').replace(/\./g, '').trim()) || 0; // Ambil harga item
        return sum + (itemPrice * item.quantity); // Hitung total
    }, 0);

    const finalTotal = total; // Terapkan diskon kupon

    if (finalTotal === 0) {
        localStorage.removeItem('couponDiscount'); // Hapus diskon jika totalnya 0
    }
    
    // Simpan total ke localStorage
    localStorage.setItem('cartTotal', finalTotal);

    // Tampilkan total di bagian "Total Keranjang"
    document.querySelector('#cart-total table tr:nth-child(1) td:last-child').innerText = total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    document.querySelector('#cart-total table tr:nth-child(2) td:last-child').innerText = couponDiscount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    document.querySelector('#cart-total table tr:nth-child(3) td:last-child').innerText = finalTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

// Fungsi untuk menangani logika saat halaman dimuat
function handlePageLoad() {
    const currentPage = window.location.pathname;

    // Simpan diskon kupon jika berada di cart.html atau checkout.html
    if (!(currentPage.endsWith('cart.html') || currentPage.endsWith('checkout.html'))) {
        // Reset diskon kupon jika meninggalkan keranjang atau checkout
        localStorage.removeItem('couponDiscount');
    }

    loadCartItems(); // Muat item keranjang
}

// Muat item keranjang saat halaman dimuat
window.addEventListener('DOMContentLoaded', handlePageLoad);

// Fungsi untuk menerapkan kupon
function applyCoupon() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Dapatkan item keranjang saat ini
    const couponInput = document.querySelector('input[placeholder="Please enter your coupon"]'); // Dapatkan input kupon
    const couponCode = couponInput.value.trim().toUpperCase(); // Ambil kode kupon
    const coupons = {
        'DISCOUNT10': 10000, 
        'DISCOUNT20': 20000, 
    };

    // Periksa apakah keranjang kosong
    if (cartItems.length === 0) {
        alert('Silakan tambahkan item ke keranjang sebelum menerapkan kupon.'); // Pesan peringatan jika keranjang kosong
        return; // Keluar dari fungsi jika keranjang kosong
    }

    const discountValue = coupons[couponCode] || 0; // Dapatkan nilai diskon atau 0 jika tidak valid

    // Simpan diskon di localStorage
    if (discountValue > 0) {
        localStorage.setItem('couponDiscount', discountValue); // Simpan diskon
        alert(`Kupon diterapkan! Anda menghemat Rp ${discountValue}.`); // Tampilkan pesan kupon diterapkan
    } else {
        alert('Kode kupon tidak valid.'); // Pesan peringatan jika kupon tidak valid
    }

    loadCartItems(); // Perbarui tampilan total keranjang
}

// Lampirkan fungsi applyCoupon ke tombol Terapkan
document.querySelector('.coupon button').addEventListener('click', (event) => {
    event.preventDefault(); // Cegah pengiriman formulir
    applyCoupon(); // Terapkan kupon
});
