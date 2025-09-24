const kuldes_gomb = document.getElementById("jelszo");

kuldes_gomb.addEventListener("click", function () {
    const input = document.getElementById("text");
    const password = input.value;

    fetch("http://localhost:8080/api/reset_password", {
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
        })
        .catch(err => {
            alert("Hiba: " + err.message);
        });
});

