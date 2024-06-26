class Db {
  constructor() {
    this.connection = this.make_connection();
  }

  //retorna una promesa para poder manejar la asincronia
  make_connection() {
    return new Promise((resolve, reject) => {
      this.request = indexedDB.open("db", 1);

      this.request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.db.createObjectStore("envios", {
          keyPath: "id",
        });
      };

      this.request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("Conectado a la base de datos");
        resolve(this.db);
      };

      this.request.onerror = (event) => {
        console.log("ERROR:", event.messagge);
        reject(event.messagge);
      };
    });
  }

  //metodos de la clase

  async add_envio(new_envio) {
    await this.connection; // espera la conexion

    const transaction = this.db.transaction(["envios"], "readwrite");
    const store = transaction.objectStore("envios");
    store.add(new_envio);
  }

  get_all() {
    return new Promise(async (resolve, reject) => {
      await this.connection; // espera que se cree la conexion

      const transaction = this.db.transaction(["envios"], "readonly");
      const store = transaction.objectStore("envios");
      const cursor_request = store.openCursor();

      const data = [];

      cursor_request.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          resolve(data);
        }
      };
    });
  }

  async delete_envio(id) {
    await this.connection; //espera la conexion

    const transaction = this.db.transaction(["envios"], "readwrite");
    const store = transaction.objectStore("envios");

    //eliminamos de la bbdd
    const request = store.delete(id);

    //despues actualizamos el dom
    request.addEventListener("success", (event) => {
      const element = document.getElementById(id);
      element.remove();
    });
  }

  async edit_envio(new_value) {
    await this.connection; //espera la conexion

    const transaction = this.db.transaction(["envios"], "readwrite");
    const store = transaction.objectStore("envios");
    const request = store.put(new_value, );

    request.addEventListener("success", (event) => {
      window.location.reload();
    });
    
  }
}
