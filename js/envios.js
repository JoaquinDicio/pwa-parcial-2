const db = new Db();

let data = [];

async function render() {
  // espera la lectura de la base de datos
  data = await db.get_all();

  //renderizamos contenido
  const lista = document.getElementById("lista-envios");
  data.forEach((envio) => {
    lista.innerHTML += generate_item_list(envio);
  });

  // una vez renderizado asigno los eventos
  asign_events(data);
}

function generate_item_list(envio) {
  const item_content = `<div id=${envio.id} class="flex flex-col gap-5 bg-slate-100 rounded-sm p-4">
              <div class="flex items-center w-full justify-between sm:flex-row flex-col">
                <div class="flex items-center flex-col sm:flex-row">
                  <svg
                    class="h-[20px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"
                        fill="#29db35"
                      ></path>
                    </g>
                  </svg>
                  <p class="text-sm mx-1 mb-3 sm:mb-1">${envio.direccion1}</p>
                  <svg
                    class="h-[20px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"
                        fill="#e92f54"
                      ></path>
                    </g>
                  </svg>
                  <p class="text-sm mx-1 mb-3 sm:mb-1">${envio.direccion2}</p>
                </div>
                <p class="font-medium">
                  <span class="text-sm">Fecha</span> ${envio.fecha}
                </p>
              </div>
              <div class="flex items-center w-full flex-col sm:flex-row sm:gap-0 gap-4 justify-between">
                <div class="flex items-center gap-2">
                  <svg
                    class="h-[20px]"
                    fill="#000000"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"
                      ></path>
                    </g>
                  </svg>
                  <p>${envio.nombre} ${envio.apellido}</p>
                </div>
                <div class="flex gap-2">
                  <button
                  id='edit-${envio.id}'
                    class="py-2 px-3 rounded-sm text-sm bg-orange-500 text-white font-medium"
                  >
                    Editar
                  </button>
                  <button
                  id='cancel-${envio.id}'
                    class="py-2 px-3 rounded-sm text-sm bg-red-500 text-white font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>`;

  return item_content;
}

//asigna los eventos para borrar y editar en base al id del envio
function asign_events(data) {
  data.forEach((envio) => {
    const btn_cancel = document.getElementById("cancel-" + envio.id);
    const btn_edit = document.getElementById("edit-" + envio.id);

    btn_cancel.addEventListener("click", () => handle_cancel(envio.id));
    btn_edit.addEventListener("click", () => handle_edit(envio.id));
  });
}

async function handle_cancel(id) {
  show_delete_confimation(id);
}

function handle_edit(id) {
  //la funcion que se usa de callback en el modal
  const save = async function () {
    new_register = { id: editing.id };

    for (key in editing) {
      if (key != "id") new_register[key] = document.getElementById(key).value;
    }

    await db.edit_envio(new_register);
  };

  const editing = data.find((envio) => envio.id == id); //buscamos los datos del elemento que se esta editando
  render_edit_modal(editing, save); // se lo pasamos al modal de edicion
}

function show_delete_confimation(id) {
  const modal_container = document.createElement("div");
  modal_container.className =
    "top-0 fixed bg-black/70 w-full h-screen flex flex-col items-center justify-center";

  const modal_content = document.createElement("div");
  modal_content.className = "bg-white rounded p-10";

  modal_title = document.createElement("p");
  modal_title.textContent = "¿Desea eliminar su envio programado?";
  modal_title.className = "text-xl font-medium";
  modal_content.appendChild(modal_title);

  cancel_btn = document.createElement("button");
  cancel_btn.textContent = "Cancelar";
  cancel_btn.className = "bg-red-500 p-2 rounded-sm text-white";
  cancel_btn.addEventListener("click", () => {
    modal_container.remove();
  });

  confirm_btn = document.createElement("button");
  confirm_btn.textContent = "Confirmar";
  confirm_btn.className = "bg-green-500 p-2 rounded-sm text-white";
  confirm_btn.addEventListener("click", async () => {
    await db.delete_envio(id);
    modal_container.remove();
  });

  buttons_div = document.createElement("div");
  buttons_div.className = "flex  gap-1 mt-5";
  buttons_div.appendChild(confirm_btn);
  buttons_div.appendChild(cancel_btn);
  modal_content.appendChild(buttons_div);

  modal_container.appendChild(modal_content);
  document.body.append(modal_container);
}

function render_edit_modal(element, callback) {
  const modal_container = document.createElement("div");
  modal_container.className =
    "top-0 fixed bg-black/70 w-full h-screen flex flex-col items-center justify-center";

  const modal_content = document.createElement("div");
  modal_content.className = "bg-white rounded p-10";

  const modal_title = document.createElement("p");
  modal_title.textContent = "Editar envio";
  modal_title.className = "text-xl font-medium";
  modal_content.appendChild(modal_title);

  const edit_form = document.createElement("form");
  edit_form.className = "flex flex-col w-full py-5";
  edit_form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  modal_content.appendChild(edit_form);

  for (key in element) {
    if (key !== "id") {
      const { input, label } = generate_input(key, element[key]);
      edit_form.appendChild(label);
      edit_form.appendChild(input);
    }
  }

  const buttons_container = document.createElement("div");
  buttons_container.className = "flex gap-1";
  modal_content.appendChild(buttons_container);

  const confirm_btn = document.createElement("button");
  confirm_btn.className = "bg-green-500 text-white rounded-sm p-2";
  confirm_btn.textContent = "Guardar";
  confirm_btn.addEventListener("click", () => callback());
  buttons_container.appendChild(confirm_btn);

  const cancel_btn = document.createElement("button");
  cancel_btn.className = "bg-red-500 text-white rounded-sm p-2";
  cancel_btn.textContent = "Cancelar";
  cancel_btn.addEventListener("click", () => modal_container.remove());
  buttons_container.appendChild(cancel_btn);

  modal_container.appendChild(modal_content);
  document.body.appendChild(modal_container);
}

//utilitie para generar inputs en el formulario
function generate_input(name, value) {
  const label = document.createElement("label");

  if (name == "direccion1") {
    label.textContent = "Direccion partida";
  } else if (name == "direccion2") {
    label.textContent = "Direccion llegada";
  } else {
    label.textContent = name;
  }

  label.setAttribute("htmlFor", name);
  const input = document.createElement("input");

  input.setAttribute("id", name);
  if (name == "fecha") input.setAttribute("type", "date");
  input.setAttribute("placeholder", name);
  input.value = value;
  input.className = "bg-slate-100 rounded-sm border py-2 px-3 border-1 mb-4";

  return { input, label };
}

render();
