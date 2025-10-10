const gombBekuldes = document.getElementById("bekuldes");
const inputFeladat = document.getElementById("feladat");
const listam = document.getElementById("jegyzetlista");
const errorBox = document.getElementById("error_message");






async function backendIsAlive(params) {

    try {

        const response = await fetch(url + "/ping", {

            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {


            alert("A szerver offline!")
            window.location.href = "/index.html";
        }
    }
         catch (err) {

            alert("A szerver offline!")
            window.location.href = "/index.html";

        }
    
}


setInterval(backendIsAlive, 3000)








async function jegyzetmentes() {
    const noteText = inputFeladat.value.trim();

    if (!noteText) {
        return;
    }

    try {
        const response = await fetch(url + "/note", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note: noteText })
        });

        if (response.status === 401 || response.status === 403) {
            alert("Nem vagy bejelentkezve!");
            window.location.href = "/index.html";
            return;
        }

        const message = await response.text();
        jegyzet_elem_készités(noteText);

        const now = new Date().toLocaleString();
        console.log(message + " : " + noteText + " . " + now);

        inputFeladat.value = "";

    } catch (err) {

        console.error("Jegyzet mentési hiba:", err);
        window.location.href = "/index.html";
    }
}

function jegyzet_elem_készités(noteText) {
    let elem = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = noteText;

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
        span.classList.toggle("done", checkbox.checked);
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    deleteBtn.addEventListener("click", async function () {
        elem.classList.add("fade-out");
        setTimeout(() => elem.remove(), 400);

        try {
            const response = await fetch(url + "/note", {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([noteText])
            });
            const message = await response.text();
            console.log("A backend válasza:", message);

        } catch (err) {
            console.error("Hiba a törlésnél:", err);
        }
    });

    elem.appendChild(checkbox);
    elem.appendChild(span);
    elem.appendChild(deleteBtn);
    listam.prepend(elem);
}

function jegyzetlekeres() {
    fetch(url + "/note", {
        method: "GET",
        credentials: "include"
    })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                console.warn("Nincs jogosultság, átirányítás a login oldalra");
                window.location.href = "/index.html";
                return [];
            }
            if (!response.ok) {
                throw new Error("Hiba a jegyzetek lekérésénél: " + response.status);
            }
            return response.json();
        })
        .then(item => {
            item.forEach(note => {
                jegyzet_elem_készités(note);
            });
        })
        .catch(err => {
            console.error("Lekérési hiba:", err);
            window.location.href = "/index.html";
        });
}

document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(url + "/logout", {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data.message);

            window.location.href = "/index.html";
        } else {
            console.error("Kilépés sikertelen!");
        }
    } catch (err) {
        console.error("Hiba a kilépés közben:", err);
    }
});

gombBekuldes.addEventListener("click", jegyzetmentes);

inputFeladat.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        jegyzetmentes();
    }
});

jegyzetlekeres();
