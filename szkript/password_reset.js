const kuldes_gomb = document.getElementById("jelszo");
const first_password = document.getElementById("first_password")
const second_password = document.getElementById("second_password")


kuldes_gomb.addEventListener("click", function () {


    if (first_password.value.trim() === "" || second_password.value.trim() === "") {
        alert("Kérlek töltsd ki mindkét mezőt!");
    }
    else if
        (first_password.value != second_password.value) {
        alert("nem egyeznek a jelszavak!")
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

