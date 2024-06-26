function costos_load() {
  set_date_max_min();
  document
    .querySelector("#calcular_envio")
    .addEventListener("click", (e) => handle_submit_costos(e));
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

//maneja la accion de "Calcular"
async function handle_submit_costos(e) {
  e.preventDefault();
  const { formData } = get_form_data();
  //verifica si el viaje es valido a traves de la distancia
  if (formData.distancia > 0 && formData.fecha) {
    const costos = await get_costo_total();
    render_total_detalle(costos);
  }
}

//hace los calculos del envio
async function get_costo_total() {
  const { formData } = get_form_data();
  const { tarifas } = await get_tarifas();

  let total = tarifas.tarifa_base;

  //extra por kilometros
  const extra_distancia = tarifas.valor_kilometro * formData.distancia;

  //recargo % sobre la tarifa por lluvia
  document.getElementById("calcular_envio").value = "Verificando clima..";
  document.getElementById("calcular_envio").setAttribute("disabled", false);
  document.getElementById("calcular_envio").classList.add("bg-slate-300");

  const lluvia = await check_lluvia(formData.fecha);
  if (lluvia == null) {
    offline_message();
    return;
  }
  const extra_clima = lluvia
    ? (tarifas.recargo_por_lluvia * (tarifas.tarifa_base + extra_distancia)) /
      100
    : 0;

  //recargo % sobre la tarifa
  const extra_tamano =
    formData.tamano == "si"
      ? (tarifas.recargo_paquete_grande *
          (tarifas.tarifa_base + extra_distancia)) /
        100
      : 0;

  //calcula el total y redondea
  total = Math.floor(total + extra_clima + extra_tamano + extra_distancia);

  document.getElementById("calcular_envio").value = "Calcular";
  document.getElementById("calcular_envio").setAttribute("disabled", false);
  document.getElementById("calcular_envio").classList.remove("bg-slate-300");

  return { total, extra_distancia, extra_clima, extra_tamano };
}

//obtiene las tarifas actualizadas desde la base de datos
async function get_tarifas() {
  try {
    const response = await fetch("../db/costos.json");
    const tarifas = await response.json();
    return { tarifas };
  } catch (e) {
    console.log("Error leyendo la base de datos", e);
  }
}

//obtiene y retorna los datos del form en forma de objeto
function get_form_data() {
  const formulario = document.getElementById("calculadora_envios");
  const distancia = formulario.elements["distancia"].value;
  const tamano = formulario.elements["tamaño"].value;
  const fecha = formulario.elements["fecha"].value;

  const formData = {
    distancia,
    tamano,
    fecha,
  };

  return { formData };
}

//renderiza los costos y el detalle
function render_total_detalle(costos) {
  if (!costos) return; // esto solo se acciona si fallo la request o no hay internet

  //si ya fue mostrado el costo de otro envio, lo borra
  if (document.getElementById("div_costos")) {
    document.getElementById("div_costos").remove();
  }

  //sino, creamos un div_costo de envio
  const div_costos = document.createElement("div");
  div_costos.id = "div_costos";
  div_costos.className =
    "bg-white py-5 rounded mt-5 w-full max-w-[453px] px-10 flex flex-col gap-2";

  //creamos un titulo para la seccion
  const titulo = document.createElement("p");
  titulo.className = "text-xl text-slate-900 font-medium";
  titulo.textContent = "Total de tu envio";
  div_costos.appendChild(titulo);
  //creamos <p> para el detalle
  create_p_detalle("distancia", costos.extra_distancia, div_costos);
  create_p_detalle("clima", costos.extra_clima, div_costos);
  create_p_detalle("tamaño", costos.extra_tamano, div_costos);

  //finalemente creamos el total
  const total = document.createElement("p");
  total.textContent = `TOTAL AR$${costos.total}`;
  total.className = "text-xl font-bold text-slate-900 mt-2";
  div_costos.appendChild(total);

  const container = document.getElementById("costos");
  container.appendChild(div_costos);
}

//crea los campos <p> para el detalle
function create_p_detalle(clave, valor, appendTo) {
  const p = document.createElement("p");
  p.textContent = `Extra por ${clave} : ARS$${valor}`;
  p.className = "font-medium text-slate-900";
  appendTo.appendChild(p);
}

function offline_message() {
  const offline_msg = document.createElement("div");
  offline_msg.className =
    "bg-red-500 text-white font-medium fixed bottom-0 w-full flex justify-center p-1";

  const p = document.createElement("p");
  p.textContent = "Esta acción estará disponible cuando tengas conexión";
  offline_msg.appendChild(p);

  document.body.appendChild(offline_msg);
}

costos_load();
