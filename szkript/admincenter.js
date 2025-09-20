
    let allUsers = [];

    async function loadUsers() {
            try {
                const response = await fetch(url+"/user_notes",{
                    credentials: "include" 
                });
    if (!response.ok) {git
        document.getElementById("details").textContent = "Hiba: " + response.status;
    return;
                }

    allUsers = await response.json();
    const select = document.getElementById("userSelect");


    select.innerHTML = '<option value="">-- Válassz felhasználót --</option>';

               
                allUsers.forEach(user => {
                    const opt = document.createElement("option");
    opt.value = user.username;
    opt.textContent = user.username;
    select.appendChild(opt);
                });


    if (select.value) {
        showUserDetails(select.value);
                } else {
        document.getElementById("details").innerHTML = "";
                }

            } catch (err) {
        console.error("Hiba a lekérés közben:", err);
            }
        }

    function showUserDetails(username) {
            const selected = allUsers.find(u => u.username === username);
    if (selected) {
        document.getElementById("details").innerHTML = `
                    <p><b>Felhasználónév:</b> ${selected.username}</p>
                    <p><b>Email:</b> ${selected.email}</p>
                    <p><b>Szerep:</b> ${selected.role}</p>
                    <p><b>Regisztráció:</b> ${selected.registeredAt}</p>
                    <p><b>Utolsó login:</b> ${selected.lastLogin}</p>
                    <p><b>Jegyzetek:</b></p>
                    ${selected.notes && selected.notes.length > 0
            ? "<ul>" + selected.notes.map(note => `<li>${note}</li>`).join("") + "</ul>"
            : "<p>Nincsenek jegyzetek</p>"
        }
                `;
            } else {
        document.getElementById("details").innerHTML = "";
            }
        }

        
        document.getElementById("userSelect").addEventListener("change", e => {
            if (e.target.value) {
        showUserDetails(e.target.value);
            } else {
        document.getElementById("details").innerHTML = "";
            }
        });


    loadUsers();

