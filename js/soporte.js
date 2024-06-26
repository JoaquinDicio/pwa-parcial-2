//setea eventos y renderiza elementos en soporte.html
function faq_load() {
  const FAQ_LIST = [
    {
      question: "¿Cuanto demoran en realizar el envio?",
      answer:
        "El tiempo maximo que podemos llegar a demorar es de 48hs habiles. Si pasaron mas de 48hs y aun no recibiste tu pedido, por favor contactate con soporte.",
    },
    {
      question: "¿Que ocurre si no habia nadie en el domicilio?",
      answer:
        "Cuando la visita no puede ser concretada se re-agenda para pasarpor el domicilio una segunda vez. Si esta segunda visita tampocopuede ser concretada, el paquete vuelve a su punto de origen yel dinero NO es reembolsado.",
    },
    {
      question: "¿Puedo pagar cuando recibo mi paquete?",
      answer:
        "Si. Nuestros cadetes estan autorizados a recibir dinero en efectivo o cobrar por Mercado Pago. Si tu metodo de pago no es ninguno de los anteriores, deberas abonar previo a la realizacion del envio.",
    },
    {
      question: "¿Que es considerado un paquete grande?",
      answer:
        "Cuando el paquete supera los 70x70cm es considerado de tamaño grande. Ademas, recorda que si el paquete mide mas de 1 metro de ancho o largo, nuestros cadetes no podran llevarlo en sus motos.",
    },
  ];
  render_faq_list(FAQ_LIST);
}

function render_faq_list(FAQ_LIST) {
  const faq_container = document.getElementById("faq-list");

  FAQ_LIST.forEach((faq) => {
    const li = document.createElement("li");
    li.className =
      "p-5 bg-white rounded cursor-pointer hover:shadow transition-[.5s] my-2.5 flex justify-between flex-wrap";
    li.addEventListener("click", () => show_answer(answer));

    const h3 = document.createElement("h3");
    h3.className = "font-medium text-md text-salte-900";
    h3.textContent = faq.question;
    li.appendChild(h3);

    const answer = document.createElement("div");
    answer.className = "mt-4 hidden text-blue-500 w-full";
    const answer_text = document.createElement("p");
    answer_text.textContent = faq.answer;
    answer.appendChild(answer_text);
    li.appendChild(answer);

    faq_container.appendChild(li);
  });
}

function show_answer(answer) {
  answer.classList.toggle("hidden");
}

window.addEventListener("load", faq_load);
