document.getElementById("btnIngresar").addEventListener("click", function() {
  document.getElementById("formLogin").style.display = "block";
  document.getElementById("formRegister").style.display = "none";
});

document.getElementById("btnRegistrarse").addEventListener("click", function() {
  document.getElementById("formLogin").style.display = "none";
  document.getElementById("formRegister").style.display = "block";
});
