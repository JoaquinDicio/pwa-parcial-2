if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../serviceworkers.js")
    .then(console.log("service worker registered"));
}

//este evento se dispara al desconectarse de internet
window.addEventListener(
  "offline",
  () => (window.location.href = "/offline.html")
);

async function set_menu() {
  //se conecta a la bbdd para mostrar el numero de envios programados en el header
  const db = new Db();
  const envios = await db.get_all();
  const qty_envios = envios ? envios.length : 0;
  document.getElementById("qty-envios").textContent = qty_envios;

  const btn = document.getElementById("show-menu");
  btn.addEventListener("click", () => {
    document.getElementById("nav-menu").classList.toggle("hidden");
  });
}

//setea los eventos del heder
set_menu();
