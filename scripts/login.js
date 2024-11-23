document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const modalMessage = document.getElementById('modalMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message before redirect
                modalMessage.textContent = 'Login successful! Redirecting...';
                loginModal.show();
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1500);
            } else {
                // Show error message in modal
                modalMessage.textContent = data.message || 'Login failed. Please try again.';
                loginModal.show();
            }
        } catch (error) {
            console.error('Error:', error);
            modalMessage.textContent = 'An error occurred during login. Please try again.';
            loginModal.show();
        }
    });

    // Clear form on modal close
    document.getElementById('loginModal').addEventListener('hidden.bs.modal', function () {
        if (modalMessage.textContent.includes('successful')) return; // Don't clear if login was successful
        document.getElementById('loginForm').reset();
    });
});