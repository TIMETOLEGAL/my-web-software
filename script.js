<!-- JavaScript file with working toggle for register screen -->

// CSS styles and other logic stay the same

const API_URL = "https://script.google.com/macros/s/AKfycby46orkSSxefSTu75D0A9CIR7il9TOJrxgz-hEvNJi7ocaima_JAX1CkORvCmwzfJ1J/exec";

let currentUser = null;
let currentRole = null;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function toggleRegister(show) {
  if (show) {
    showScreen("register-screen");
  } else {
    showScreen("login-screen");
  }
}

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({ action: "getUsers" })
  })
    .then(res => res.text())
    .then(text => {
      const rows = JSON.parse(text);
      const index = rows.findIndex(r => r[0] === user && r[1] === pass);
      if (index === -1) {
        document.getElementById("login-error").textContent = "Invalid credentials";
        return;
      }
      const role = rows[index][2];
      const approved = rows[index][3] === "true";

      currentUser = user;
      currentRole = role;

      if (!approved) {
        showScreen("approval-screen");
      } else {
        document.getElementById("role").textContent = role;
        showScreen("dashboard");
        if (role === "Director") renderAdminPanel();
        if (role === "Back") loadTasks();
      }
    });
}

function register() {
  const user = document.getElementById("reg-username").value.trim();
  const pass = document.getElementById("reg-password").value.trim();
  const role = document.getElementById("reg-role").value;

  fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "registerUser",
      username: user,
      password: pass,
      role: role
    })
  })
    .then(res => res.text())
    .then(txt => {
      if (txt === "success") {
        document.getElementById("register-success").textContent = "Registration successful! Awaiting Director approval.";
      } else {
        document.getElementById("register-success").textContent = "Error occurred.";
      }
    });
}

function uploadTask() {
  const category = document.getElementById("task-category").value;
  const client = document.getElementById("client-name").value;
  const desc = document.getElementById("task-desc").value;
  const date = document.getElementById("deadline").value;

  fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "uploadTask",
      category: category,
      client_name: client,
      task_description: desc,
      deadline: date,
      assigned_by: currentUser || "Anonymous"
    })
  })
    .then(res => res.text())
    .then(txt => {
      if (txt === "task_saved") {
        alert("Task uploaded successfully.");
        loadTasks();
      }
    });
}

function loadTasks() {
  fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({ action: "getTasks" })
  })
    .then(res => res.text())
    .then(txt => {
      const rows = JSON.parse(txt);
      const container = document.getElementById("task-list");
      container.innerHTML = "";
      rows.slice(1).forEach(task => {
        const div = document.createElement("div");
        div.innerHTML = `<b>${task[0]}</b> - ${task[1]} (${task[2]}) - Due: ${task[3]}`;
        container.appendChild(div);
      });
    });
}
