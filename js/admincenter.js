let allUsers = [];
let freezeSelect = false;
let lastSnapshot = "";

const select = document.getElementById("userSelect");
const detailsEl = document.getElementById("details");


select.addEventListener("focus", () => { freezeSelect = true; });
select.addEventListener("blur", () => { freezeSelect = false; });

select.addEventListener("change", e => {
    if (e.target.value) showUserDetails(e.target.value);
    else detailsEl.innerHTML = "";
});

async function loadUsers() {
    try {
        const response = await fetch(url + "/user_notes", { credentials: "include" });
        if (!response.ok) {
            detailsEl.textContent = "Hiba: " + response.status;
            return;
        }

        const data = await response.json();
        allUsers = data;


        const newSnapshot = allUsers.map(u => u.username).join("|");


        if (!freezeSelect && newSnapshot !== lastSnapshot) {
            const current = select.value;

            select.innerHTML = '<option value="">-- Válassz felhasználót --</option>';
            for (const u of allUsers) {
                const opt = document.createElement("option");
                opt.value = u.username;
                opt.textContent = u.username;
                select.appendChild(opt);
            }
            if (current && allUsers.some(u => u.username === current)) {
                select.value = current;
            }
            lastSnapshot = newSnapshot;
        }


        if (select.value) showUserDetails(select.value);
        else detailsEl.innerHTML = "";

    } catch (err) {
        console.error("Hiba a lekérés közben:", err);
    }
}

function showUserDetails(username) {
    const u = allUsers.find(x => x.username === username);
    if (!u) { detailsEl.innerHTML = ""; return; }

    detailsEl.innerHTML = `
    <p><b>Felhasználónév:</b> ${u.username}</p>
    <p><b>Email:</b> ${u.email}</p>
    <p><b>Szerep:</b> ${u.role}</p>
    <p><b>Regisztráció:</b> ${u.registeredAt}</p>
    <p><b>Utolsó login:</b> ${u.lastLogin}</p>
    <p><b>Jegyzetek:</b></p>
    ${u.notes?.length ? "<ul>" + u.notes.map(n => `<li>${n}</li>`).join("") + "</ul>" : "<p>Nincsenek jegyzetek</p>"}
  `;
}

document.getElementById("kilepes").addEventListener("click", async () => {
    await fetch(url + "/logout", { method: "POST", credentials: "include" });
    window.location.href = "/index.html";
});











const ban = document.getElementById("ban");
const select2 = document.getElementById("userSelect"); 

ban.addEventListener("click", async () => {
    const selectedUser = select2.value;
    if (!selectedUser) {
        alert("Először válassz ki egy felhasználót!");
        return;
    }

    let action;
    if (ban.innerHTML === "Felhasználó tiltása") {
        action = "ban";
        ban.innerHTML = "Feloldás";
        ban.style.background = "green";
    } else {
        action = "unban";
        ban.innerHTML = "Felhasználó tiltása";
        ban.style.background = "red";
    }

    await fetch(url + "/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            username: selectedUser,
            action: action
        })
    });
});



loadUsers();
setInterval(loadUsers, 3000);
