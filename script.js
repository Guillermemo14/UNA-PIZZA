// Configuración de Supabase
const supabaseUrl = "sb_publishable_m6_SfupjKAIuc38QzFXfHA_eu22GeYc";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5a2JpaXZ6Y21pemtoeHBsYmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTM4NjgsImV4cCI6MjA4Njk2OTg2OH0.rcnykRqLCPEHctmmngaMenr3E9Bu0Z-vnI0l-Cmudco";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Función para cargar órdenes desde Supabase
async function cargarOrdenes() {

    const { data: ordenes, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error cargando órdenes:", error);
        return;
    }

    const contenedor = document.getElementById('orders-container');
    contenedor.innerHTML = "";

    ordenes.forEach(orden => {

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('order-card');

        tarjeta.innerHTML = `
            <h2>Orden</h2>
            <p><strong>Cliente:</strong> ${orden.cliente}</p>
            <p><strong>Pedido:</strong> ${orden.pedido}</p>
            <p class="status ${orden.status}">
                ${orden.status === "preparing" ? "En preparación" : "Lista"}
            </p>
        `;

        tarjeta.addEventListener("click", () => cambiarEstado(orden.id, orden.status));

        contenedor.appendChild(tarjeta);
    });
}

// Cambiar estado en la base de datos REAL
async function cambiarEstado(id, estadoActual) {

    const nuevoEstado = estadoActual === "preparing" ? "ready" : "preparing";

    const { error } = await supabase
        .from('orders')
        .update({ status: nuevoEstado })
        .eq('id', id);

    if (error) {
        console.error("Error actualizando:", error);
        return;
    }

    cargarOrdenes();
}

// Cargar al iniciar
cargarOrdenes();

// Actualizar cada 5 segundos
setInterval(cargarOrdenes, 5000);
