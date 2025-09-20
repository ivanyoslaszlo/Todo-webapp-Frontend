let allUsers = [];

// Regisztrációs űrlap kezelése
document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(url+"/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.text();
        const ellenorzesElem = document.getElementById("ellenorzes");

       
        document.getElementById("username").value = '';
        document.getElementById("email").value = '';
        document.getElementById("password").value = '';

        ellenorzesElem.innerText = result;

        if (result.toLowerCase().includes("foglalt") || result.toLowerCase().includes("hiba")) {
            ellenorzesElem.classList.remove("success");
            ellenorzesElem.classList.add("error");
        } else {
            ellenorzesElem.classList.remove("error");
            ellenorzesElem.classList.add("success");
            
            loadUsers();
        }

        setTimeout(() => {
            ellenorzesElem.innerText = '';
            ellenorzesElem.classList.remove("success", "error");
        }, 2000);
    } catch (err) {
        console.error("Hiba a regisztrációnál:", err);
    }
});



