// Mengambil total keranjang
const cartTotal = localStorage.getItem('cartTotal');
 // Mengambil diskon kupon; default ke 0 jika tidak diatur
const discount = localStorage.getItem('couponDiscount') || 0;

// Memformat nilai-nilai untuk tampilan
const formattedCartTotal = cartTotal ? Number(cartTotal).toLocaleString('id-ID') : '0';
const formattedDiscount = discount ? `Rp ${Number(discount).toLocaleString('id-ID')}` : 'Rp 0';

// Menghitung total akhir
const finalTotal = (cartTotal ? Number(cartTotal) : 0) - (discount ? Number(discount) : 0);
const formattedFinalTotal = `Rp ${finalTotal.toLocaleString('id-ID')}`;

// Memperbarui tabel total checkout setelah halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const cartTotalCell = document.querySelector('#cart-total-cell');
    const discountCell = document.querySelector('#discount-cell');
    const totalCell = document.querySelector('#total-cell');
    
    // Memperbarui sel total keranjang, diskon, dan total akhir
    if (cartTotalCell) {
        cartTotalCell.innerText = `Rp ${formattedCartTotal}`;
    }
    if (discountCell) {
        discountCell.innerText = formattedDiscount; 
    }
    if (totalCell) {
        totalCell.innerText = formattedFinalTotal;
    }
});

// Fungsi untuk mengedit alamat
document.getElementById('edit-address-btn').addEventListener('click', function () {
    const contactPerson = document.getElementById('contact-person');
    const phoneNumber = document.getElementById('phone-number');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const postcode = document.getElementById('postcode');

    // Mengubah kolom menjadi input untuk diedit
    contactPerson.innerHTML = `<input type="text" id="edit-contact-person" value="${contactPerson.innerText}">`;
    phoneNumber.innerHTML = `<input type="text" id="edit-phone-number" value="${phoneNumber.innerText}">`;
    address.innerHTML = `<input type="text" id="edit-address" value="${address.innerText}">`;
    city.innerHTML = `<input type="text" id="edit-city" value="${city.innerText}">`;
    postcode.innerHTML = `<input type="text" id="edit-postcode" value="${postcode.innerText}">`;

    // Menyembunyikan tombol edit dan menampilkan tombol simpan dan batal
    document.getElementById('edit-address-btn').style.display = 'none';
    document.getElementById('save-address-btn').style.display = 'inline-block';
    document.getElementById('cancel-btn').style.display = 'inline-block';
});

// Fungsi untuk menyimpan alamat yang telah diedit
document.getElementById('save-address-btn').addEventListener('click', function () {
    const newContactPerson = document.getElementById('edit-contact-person').value;
    const newPhoneNumber = document.getElementById('edit-phone-number').value;
    const newAddress = document.getElementById('edit-address').value;
    const newCity = document.getElementById('edit-city').value;
    const newPostcode = document.getElementById('edit-postcode').value;

    // Menyimpan nilai-nilai baru dan mengubah input kembali ke teks
    document.getElementById('contact-person').innerText = newContactPerson;
    document.getElementById('phone-number').innerText = newPhoneNumber;
    document.getElementById('address').innerText = newAddress;
    document.getElementById('city').innerText = newCity;
    document.getElementById('postcode').innerText = newPostcode;

    // Menyembunyikan tombol simpan dan batal, menampilkan kembali tombol edit
    document.getElementById('edit-address-btn').style.display = 'inline-block';
    document.getElementById('save-address-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
});

// Fungsi untuk membatalkan pengeditan alamat
document.getElementById('cancel-btn').addEventListener('click', function () {
    const contactPerson = document.getElementById('contact-person');
    const phoneNumber = document.getElementById('phone-number');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const postcode = document.getElementById('postcode');

    // Membatalkan perubahan dan mengembalikan ke nilai semula
    contactPerson.innerHTML = contactPerson.querySelector('input').value;
    phoneNumber.innerHTML = phoneNumber.querySelector('input').value;
    address.innerHTML = address.querySelector('input').value;
    city.innerHTML = city.querySelector('input').value;
    postcode.innerHTML = postcode.querySelector('input').value;

    // Menyembunyikan tombol simpan dan batal, menampilkan kembali tombol edit
    document.getElementById('edit-address-btn').style.display = 'inline-block';
    document.getElementById('save-address-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
});

// Fungsi untuk mereset data keranjang dan checkout
function resetCartAndCheckoutData() {
    // Menghapus item keranjang dan total dari localStorage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('couponDiscount'); // Memastikan item yang benar dihapus untuk diskon kupon

    // Menghapus tampilan keranjang
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = '';
    }

    // Mereset tampilan total keranjang, diskon, dan total akhir
    const cartTotalCell = document.querySelector('#cart-total-cell');
    const discountCell = document.querySelector('#discount-cell');
    const totalCell = document.querySelector('#total-cell');
    
    if (cartTotalCell) {
        cartTotalCell.innerText = 'Rp 0';
    }

    if (discountCell) {
        discountCell.innerText = 'Rp 0';
    }

    if (totalCell) {
        totalCell.innerText = 'Rp 0';
    }

    // Mereset informasi alamat
    const contactPerson = document.getElementById('contact-person');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const postcode = document.getElementById('postcode');
    
    if (contactPerson) {
        contactPerson.innerText = '';
    }

    if (address) {
        address.innerText = '';
    }

    if (city) {
        city.innerText = '';
    }

    if (postcode) {
        postcode.innerText = '';
    }
}

// Fungsi checkout ketika tombol checkout ditekan
document.getElementById('checkout-button').addEventListener('click', function(event) {
    event.preventDefault(); // Mencegah navigasi langsung

    // Mengambil nilai-nilai alamat
    const contactPerson = document.getElementById('contact-person').innerText.trim();
    const phoneNumber = document.getElementById('phone-number').innerText.trim();
    const address = document.getElementById('address').innerText.trim();
    const city = document.getElementById('city').innerText.trim();
    const postcode = document.getElementById('postcode').innerText.trim();
    
    // Memvalidasi apakah ada kolom yang kosong
    if (!contactPerson || !phoneNumber || !address || !city || !postcode) {
         // Alert jika ada kolom kosong
        alert("Harap isi semua detail alamat");
        return; 
    }

    // Mengecek apakah total keranjang nol
    if (finalTotal === 0) {
        // Alert jika total keranjang nol
        alert("Keranjang Anda kosong."); 
        return; 
    }
    // Mereset data keranjang dan alamat
    resetCartAndCheckoutData(); 
    // Notifikasi kepada pengguna
    alert("Berhasil Check Out!"); 
    
    // Memberikan jeda sebelum redirect agar UI dapat diperbarui
    setTimeout(function() {
        // Redirect ke halaman utama
        window.location.href = "index.html"; 
        // Jeda selama 500ms (0,5 detik)
    }, 500); 
});
