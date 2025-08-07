// Set current year
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Shop button action
  const shopBtn = document.getElementById("shop-now");
  shopBtn.addEventListener("click", () => {
    alert("Redirecting to shop...");
    // Example future logic: window.location.href = "/shop.html";
  });
});
