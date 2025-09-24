const gombBekuldes = document.getElementById("bekuldes");
const inputFeladat = document.getElementById("feladat");
const listam = document.getElementById("jegyzetlista");
const error = document.getElementById("error_message");
async function jegyzetmentes() {
    const noteText = document.getElementById("feladat").value.trim();

    if (!noteText) {

        return;
    }

    try {
        const response = await fetch(url+"/note", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note: noteText })
        });

        const message = await response.text();
        jegyzet_elem_készités(noteText);

        const now = new Date().toLocaleString();
        console.log(message + " : " + noteText + " . " + now);

        document.getElementById("feladat").value = "";

    } catch (error) {
        error.innerHTML = error;
        window.location.href = "/html/login.html";
        console.log(error);
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
            const response = await fetch(url+"/note", {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([noteText])
            });
            const message=await response.text();
            console.log("A backend válassza",message)

        } catch (error) {
            console.error("Hiba a törlésnél:", error);
        }
    });

    elem.appendChild(checkbox);
    elem.appendChild(span);
    elem.appendChild(deleteBtn);
    listam.prepend(elem);
}




function jegyzetlekeres() {
    fetch(url+"/note", {
        method: "GET",
        credentials: "include"
    })
        .then(response => {
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
        .catch(error => {
            console.error("Lekérési hiba:", error);
        });
}





document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault(); // 

    try {
        const res = await fetch(url+"/kilepes", {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data.message);

            window.location.href = "index.html";
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

