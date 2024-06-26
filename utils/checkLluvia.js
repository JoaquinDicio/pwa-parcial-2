// esto no deberia estar en el archivo, sino en una variable de entorno por seguridad, pero no lo vimos en la cursada, me apego a la consigna
const API_KEY = "7xmdojxfoyi4expeof5gtsnc1ezyzpmge89csr49";

async function check_lluvia(fecha) {
  try {
    const response = await fetch(
      "https://www.meteosource.com/api/v1/free/point?place_id=buenos-aires&sections=all&timezone=UTC&language=en&units=metric&key=" +
        API_KEY
    );

    if (!response.ok) {
      throw new Error("Error conectando con la API");
    }

    // retorna boolean en base al clima de la fecha buscada
    const data = await response.json();
    
    console.log(data) // dejo este console log para que sea mas facil chequear que efectivamente no esta pronosticado lluvia

    const clima_fecha = data.daily.data.find((value) => value.day == fecha);

    //verifica si hay lluvia
    if (clima_fecha.weather.includes("rain")) return true;
    return false;

  } catch (e) {
    console.log("Error:", e);
    return null;
  }
}
