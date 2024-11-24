document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const notification = document.getElementById('notification');

    // Function to show notification
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = `notification ${isError ? 'error' : ''}`;
        notification.style.display = 'block';

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1500);
            } else {
                showNotification(data.message || 'Login failed. Please try again.', true);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred during login. Please try again.', true);
        }
    });
});