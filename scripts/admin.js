document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    const modalMessage = document.getElementById('modalMessage');

    // Show/Hide different sections
    window.showDashboard = function() {
        document.getElementById('dashboardContent').style.display = 'block';
        document.getElementById('productFormContent').style.display = 'none';
    }

    window.showProductForm = function() {
        document.getElementById('dashboardContent').style.display = 'none';
        document.getElementById('productFormContent').style.display = 'block';
    }

    window.showUsers = function() {
        // Implementation for users section
        console.log('Users section clicked');
    }

    // Handle product form submission
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value,
            stars: parseFloat(document.getElementById('productStars').value),
            sold: 0 // Initial value for new products
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();

            if (response.ok) {
                modalMessage.textContent = 'Product added successfully!';
                addProductForm.reset();
            } else {
                modalMessage.textContent = data.message || 'Error adding product';
            }
        } catch (error) {
            console.error('Error:', error);
            modalMessage.textContent = 'An error occurred while adding the product';
        }

        notificationModal.show();
    });
});