//seteando eventos para el archivo programar-envios
const db = new Db();

function programar_envio_load() {
  set_date_max_min();
  const btn_programar = document.getElementById("programar_envio");
  btn_programar.addEventListener("click", handle_programar_envio);
}

function set_date_max_min() {
  const fechaActual = new Date();
  const fechaLimite = new Date();
  //maximo 7 dias en adelante para poder pronosticar correctamente el clima
  fechaLimite.setDate(fechaActual.getDate() + 7);
  // Convertir la fecha limite a formato ISO pq el input date recibe ese tipo de dato
  const fechaLimiteISO = fechaLimite.toISOString().split("T")[0];
  const inputFecha = document.getElementById("fecha");
  // Asignar la fecha límite al atributo max del input date
  inputFecha.setAttribute("max", fechaLimiteISO);
  // asignar la fecha minima como la fecha actual
  inputFecha.setAttribute("min", fechaActual.toISOString().split("T")[0]);
}

//manejand el "submit" del formulario
async function handle_programar_envio(e) {
  e.preventDefault();
  const error = validate_form();

  if (!error) {
    const new_envio = get_form_status();
    new_envio["id"] = crypto.randomUUID();
    await db.add_envio(new_envio);
    show_success();
  }
}

//verifica la validez de los campos
function validate_form() {
  const form_fields = get_form_status();
  //itera las claves del objeto en busca de valores vacios o nulos
  let error = false;
  for (let key in form_fields) {
    if (form_fields[key] == "" || !form_fields[key]) error = true;
  }

  //si hay error muestra el error en el DOM
  if (error) document.getElementById("error").classList.remove("hidden");
  return error ? true : false;
}

//obtiene el estado actual del form
function get_form_status() {
  const form = document.getElementById("form-programar");

  const form_fields = {};

  form_fields["nombre"] = form.elements.nombre.value;
  form_fields["apellido"] = form.elements.apellido.value;
  form_fields["fecha"] = form.elements.fecha.value;
  form_fields["direccion1"] = form.elements["direccion-1"].value;
  form_fields["direccion2"] = form.elements["direccion-2"].value;

  return form_fields;
}

//muestra un mensaje de exito al usuario
function show_success() {
  const container = document.getElementById("section_programar_envio");
  container.innerHTML = "";
  container.classList.add(
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "gap-2"
  );

  const title = document.createElement("p");
  title.className = "font-bold mt-10 text-xl text-center text-slate-900";
  title.textContent = "Envio programado";
  container.appendChild(title);

  const p = document.createElement("p");
  p.className = "text-blue-500 max-w-[500px] text-center";
  p.textContent =
    "Nos pondremos en contacto a la brevedad para confirmar tu pedido.";
  container.appendChild(p);

  const a = document.createElement("a");
  a.className = "rounded-sm text-white bg-blue-500 px-4 py-2 text-center";
  a.textContent = "Ver en mis envios";
  a.setAttribute("href", "./mis-envios.html");
  container.appendChild(a);
}

programar_envio_load();
