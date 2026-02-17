// Variable para guardar el tiempo de inicio de cada orden
let tiemposInicio = {};

// Función principal que carga órdenes
async function cargarOrdenes() {

    const respuesta = await fetch('orders.json');
    const ordenes = await respuesta.json();

    const contenedor = document.getElementById('orders-container');
    contenedor.innerHTML = "";

    ordenes.forEach(orden => {

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('order-card');

        // Si la orden está en preparación y no tiene tiempo registrado, guardamos hora actual
        if (orden.status === "preparing" && !tiemposInicio[orden.id]) {
            tiemposInicio[orden.id] = new Date();
        }

        // Calcular tiempo transcurrido
        let tiempoTexto = "";

        if (orden.status === "preparing") {
            const ahora = new Date();
            const inicio = tiemposInicio[orden.id];
            const minutos = Math.floor((ahora - inicio) / 60000);
            tiempoTexto = `<p><strong>Tiempo:</strong> ${minutos} min</p>`;
        }

        tarjeta.innerHTML = `
            <h2>Orden #${orden.id}</h2>
            <p><strong>Cliente:</strong> ${orden.cliente}</p>
            <p><strong>Pedido:</strong> ${orden.pedido}</p>
            ${tiempoTexto}
            <p class="status ${orden.status}">
                ${orden.status === "preparing" ? "En preparación" : "Lista"}
            </p>
        `;

        // Evento para cambiar estado al hacer click
        tarjeta.addEventListener("click", () => cambiarEstado(orden.id));

        contenedor.appendChild(tarjeta);
    });
}

// Función que cambia estado localmente (solo visual)
async function cambiarEstado(id) {

    const respuesta = await fetch('orders.json');
    const ordenes = await respuesta.json();

    // Cambiamos el estado en memoria
    ordenes.forEach(orden => {
        if (orden.id === id) {
            orden.status = orden.status === "preparing" ? "ready" : "preparing";
        }
    });

    // ⚠️ Esto NO guarda el cambio permanentemente
    // Solo recarga visualmente

    cargarOrdenes();
}

// Cargar al iniciar
cargarOrdenes();

// Actualizar cada 10 segundos
setInterval(cargarOrdenes, 10000);
