// Mengimpor fungsi untuk wishlist
import { addToWishlist, loadIconStates } from './addToWishlist.js';

// Menunggu hingga seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  // Mengambil elemen-elemen yang akan digunakan
  const compareButton = document.querySelector('.compare-button');
  const compareProduct = document.querySelector('.compare-product');
  const compareLine = document.querySelector('.compare-line');
  const mainProduct = document.querySelector('.main-product');
  const mainDetails = document.querySelector('.main-product-details');
  const productContainer = document.querySelector('.product-container');
  const mainSummary1 = document.querySelector('.main-product-summary1');
  const compareListContainer = document.querySelector('.compare-list-container');
  const compareListClose = document.getElementById('compare-list-close');

  // Menambahkan event listener untuk tombol "Compare" agar menampilkan/menyembunyikan daftar perbandingan
  compareButton.addEventListener('click', () => {
    if (compareListContainer.classList.contains('compare-list-container-show') || compareProduct.classList.contains('show')) {
      // Menyembunyikan elemen-elemen jika daftar perbandingan sedang terbuka
      compareProduct.classList.remove('show');
      compareLine.classList.remove('show');
      mainProduct.classList.remove('main-product-show');
      mainSummary1.classList.remove('show');
      compareListContainer.classList.remove('compare-list-container-show');
    } else {
      // Menampilkan container daftar perbandingan jika tidak terbuka
      compareListContainer.classList.add('compare-list-container-show');
    }
  });

  // Event listener untuk menutup daftar perbandingan ketika tombol close ditekan
  compareListClose.addEventListener('click', () => {
    compareListContainer.classList.remove('compare-list-container-show');
  });

  // Fungsi untuk memperbarui tampilan produk berdasarkan ukuran layar
  function updatecompare(e) {
    if(e.matches){
      // Jika ukuran layar lebih kecil dari 1150px, elemen produk akan dipindahkan ke dalam div baru
      let comparableDiv = document.createElement('div');
      comparableDiv.classList.add('comparable');
      productContainer.insertBefore(comparableDiv, compareProduct);
      comparableDiv.appendChild(compareProduct);
      comparableDiv.appendChild(compareLine);
      comparableDiv.appendChild(mainProduct);
    } else {
      // Jika layar lebih besar dari 1150px, elemen-elemen dipindahkan kembali ke posisi aslinya
      productContainer.insertBefore(mainProduct, mainDetails);
      productContainer.insertBefore(compareLine, mainProduct);
      productContainer.insertBefore(compareProduct, compareLine);

      const comparableDiv = document.querySelector('.comparable');
      if(comparableDiv) {
        comparableDiv.remove();
      }
    }
  }

  // Membuat media query untuk mendeteksi perubahan ukuran layar
  const mediaQuery = window.matchMedia('(max-width: 1150px)');
  mediaQuery.addListener(updatecompare); // Menambahkan listener untuk perubahan layar
  updatecompare(mediaQuery); // Menjalankan fungsi pada saat halaman pertama kali dimuat
});

// Fungsi untuk memperbarui informasi produk yang dibandingkan
function updateCompareProduct(item) {
  const compareProductContainer = document.querySelector('.compare-product-image');
  const compareProductImage = document.querySelector('.compare-product-image img');
  const compareProductTitle = document.querySelector('.compare-summary h3');
  const compareProductPrice = document.querySelector('.compare-summary h2');

  // Memuat status ikon wishlist dari localStorage
  const iconStates = loadIconStates();
  const isInWishlist = iconStates[item.name] || false; // Mengecek apakah produk ada di wishlist
  const wishlistButton = document.createElement('button'); // Membuat tombol wishlist
  wishlistButton.classList.add('wishlist-btn');
  wishlistButton.setAttribute('aria-label', isInWishlist ? 'Hapus dari wishlist' : 'Tambahkan ke wishlist');
  wishlistButton.innerHTML = `<i class="${isInWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"
                              style="color: ${isInWishlist ? 'var(--secondary-color)' : 'gray'};"></i>`;
  
  // Menambahkan tombol wishlist ke container produk
  compareProductContainer.appendChild(wishlistButton);
  
  // Memperbarui gambar, judul, dan harga produk yang dibandingkan
  compareProductImage.src = item.image;
  compareProductImage.alt = item.name;
  compareProductTitle.textContent = item.name;
  compareProductPrice.textContent = item.price;

  // Menambahkan event listener untuk tombol wishlist
  wishlistButton.addEventListener('click', function() {
    addToWishlist(item.name, item.image, item.price, item.sold, item.stars, wishlistButton);
    addingComparable(); // Memperbarui daftar produk yang dibandingkan
  });
}

// Fungsi untuk memperbarui daftar perbandingan
function addingComparable() {
  const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || []; // Mendapatkan item wishlist dari localStorage
  const compareList = document.querySelector('.compare-list');
  const compareProduct = document.querySelector('.compare-product');
  const compareLine = document.querySelector('.compare-line');
  const mainProduct = document.querySelector('.main-product');
  const mainSummary1 = document.querySelector('.main-product-summary1');
  const productDataElement = document.getElementById('productData');
  const productData = JSON.parse(productDataElement.textContent); // Mendapatkan data produk utama

  compareList.innerHTML = ''; // Mengosongkan daftar produk yang dibandingkan
  if(wishlistItems.length  === 0 || (wishlistItems.length === 1 && wishlistItems[0].name === productData.name)){
    // Menampilkan pesan jika wishlist kosong atau hanya berisi produk utama
    const listItem = document.createElement('li');
    listItem.textContent = "Daftar wishlist Anda kosong";
    compareList.appendChild(listItem);
  } else {
    // Menambahkan produk yang ada di wishlist ke dalam daftar perbandingan
    wishlistItems.forEach(item => {
      if(item.name !== productData.name){
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = item.name;

        // Menambahkan event listener untuk memperbarui produk yang dibandingkan ketika produk dipilih
        link.addEventListener('click', (event) => {
          updateCompareProduct(item);
          compareProduct.classList.add('show');
          compareLine.classList.add('show');
          mainProduct.classList.add('main-product-show');
          mainSummary1.classList.add('show');
        });
         // Menambahkan link ke item daftar dan  daftar ke daftar perbandingan
        listItem.appendChild(link);
        compareList.appendChild(listItem);
      }
    });
  }
}

// Menjalankan fungsi ketika konten halaman selesai dimuat
document.addEventListener('DOMContentLoaded', addingComparable);
