const form = document.getElementById('loginForm');
const errorElem = document.getElementById('error-msg');

 console.log(url)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(url+"/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            if (data.role === "admin") {
                window.location.href = "admincenter.html";
            } else if (data.role === "User") {
                window.location.href = "todo.html";
            }
        } else {
            errorElem.textContent = data.message;
            setTimeout(() => errorElem.textContent = "", 2000);
        }
    } catch (err) {
        errorElem.textContent = "Hiba történt a szerverrel való kommunikációban!";
    }
});