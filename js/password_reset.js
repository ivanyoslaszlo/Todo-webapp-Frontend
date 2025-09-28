const jelszo_modositasa = document.getElementById("jelszo_modositasa");
const first_password = document.getElementById("first_password")
const second_password = document.getElementById("second_password")


jelszo_modositasa.addEventListener("click", function () {


    if (first_password.value.trim() === "" || second_password.value.trim() === "") {
        alert("Kérlek töltsd ki mindkét mezőt!");
    }
    else if
        (first_password.value != second_password.value) {
        alert("Nem egyeznek a jelszavak!")
    }

    else {
        const input = document.getElementById("first_password");
        const password = input.value;

        fetch(url + "/reset_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ password })
        })
            .then(res => res.text())
            .then(data => {
                input.value = "";
                alert(data);
                first_password.value = "";
                second_password.value = "";
            })
            .catch(err => {
                alert("Hiba: " + err.message);
            });
    }


});

function ablak_nyitas() {
    document.getElementById("delete_gui").style.display = "block";
}
function ablak_zaras() {
    document.getElementById("delete_gui").style.display = "none";
}
function fiok_torles() {
    fetch(url+"/delete_user", {
        method: "POST",
        credentials: "include" // így megy vele a session cookie
    })
        .then(response => {
            if (response.ok) {
                alert("Fiók törölve!");
                ablak_zaras();
                window.location.href = "/index.html";
            } else {
                alert("Hiba: " + response.status);
            }
        })
        .catch(error => {
            console.error(error);
            alert("Hálózati hiba!");
        });
}

