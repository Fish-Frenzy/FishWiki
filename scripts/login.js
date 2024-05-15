document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://127.0.0.1:8000/api';
    const loginForm = document.getElementById('waterform');
    
    function login(email, password) {
        return axios.post(`${apiUrl}/login`, { email: email, password: password }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            }
        });
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password)
        .then(response => {
            console.log('Login successful');
            localStorage.setItem('accessToken', response.data.token); // Store the token in localStorage
            window.location.href = 'dashboard.html'; // Redirect to the dashboard page
        })
        .catch(error => {
            console.error('Login failed:', error);
            const errorMessageElement = document.getElementById('error');
            errorMessageElement.textContent = "Your email address and/or password is wrong.";
        });
    });

});
