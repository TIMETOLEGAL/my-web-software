// Dummy users (will be replaced by Google Sheet later)
const users = [
  { email: "director@ttl.com", password: "1234", role: "director" },
  { email: "sales@ttl.com", password: "1234", role: "sales" },
  { email: "back@ttl.com", password: "1234", role: "back" }
];

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        alert("Invalid email or password!");
        return;
      }

      // Redirect based on role
      if (user.role === "director") window.location.href = "director-dashboard.html";
      else if (user.role === "sales") window.location.href = "sales-dashboard.html";
      else if (user.role === "back") window.location.href = "back-dashboard.html";
    });
  }
});
