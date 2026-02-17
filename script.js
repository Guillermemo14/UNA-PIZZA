// Esta función carga las órdenes desde el archivo JSON
async function cargarOrdenes() {

    // fetch obtiene datos desde un archivo externo
    const respuesta = await fetch('orders.json');

    // Convertimos la respuesta a formato JSON
    const ordenes = await respuesta.json();

    // Seleccionamos el contenedor donde se mostrarán las órdenes
    const contenedor = document.getElementById('orders-container');

    // Limpiamos el contenedor antes de agregar contenido
    contenedor.innerHTML = "";

    // Recorremos cada orden del JSON
    ordenes.forEach(orden => {

        // Creamos un div para cada orden
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('order-card');

        // Creamos el contenido interno de la tarjeta
        tarjeta.innerHTML = `
            <h2>Orden #${orden.id}</h2>
            <p><strong>Cliente:</strong> ${orden.cliente}</p>
            <p><strong>Pedido:</strong> ${orden.pedido}</p>
            <p class="status ${orden.status}">
                ${orden.status === "preparing" ? "En preparación" : "Lista"}
            </p>
        `;

        // Agregamos la tarjeta al contenedor
        contenedor.appendChild(tarjeta);
    });
}

// Ejecutamos la función cuando la página carga
cargarOrdenes();
