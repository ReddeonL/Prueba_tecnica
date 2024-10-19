const apiUrl = "http://127.0.0.1:5000/adquisiciones";

// Crear una nueva adquisición
async function crearAdquisicion(adquisicion) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(adquisicion)
    });

    if (response.ok) {
        alert("Adquisición creada exitosamente.");
        mostrarAdquisiciones();
        cargarHistorial();
    } else {
        const error = await response.json();
        alert("Error: " + error.error);
    }
}

// Mostrar todas las adquisiciones
async function mostrarAdquisiciones() {
    const response = await fetch(apiUrl);
    const adquisiciones = await response.json();
    renderizarLista(adquisiciones);
}

// Cargar y mostrar el historial de cambios
async function cargarHistorial() {
    const response = await fetch(`${apiUrl}/historial`);
    const historial = await response.json();
    renderizarHistorial(historial);
}

// Renderizar la tabla de historial
function renderizarHistorial(historial) {
    const tablaHistorial = document.getElementById("tabla-historial").querySelector("tbody");
    tablaHistorial.innerHTML = historial.map(item => `
        <tr>
            <td>${item.id_adquisicion}</td>
            <td>${item.fecha_cambio}</td>
            <td>${item.campo_modificado}</td>
            <td>${item.valor_anterior}</td>
            <td>${item.nuevo_valor}</td>
        </tr>
    `).join('');
}

// Aplicar filtros
async function aplicarFiltros() {
    const unidad = document.getElementById("filtro-unidad").value;
    const proveedor = document.getElementById("filtro-proveedor").value;
    const tipo = document.getElementById("filtro-tipo").value;

    let query = `${apiUrl}/filtros?`;
    if (unidad) query += `unidad=${unidad}&`;
    if (proveedor) query += `proveedor=${proveedor}&`;
    if (tipo) query += `tipo=${tipo}`;

    const response = await fetch(query);
    const adquisiciones = await response.json();
    renderizarLista(adquisiciones);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById("filtro-unidad").value = '';
    document.getElementById("filtro-proveedor").value = '';
    document.getElementById("filtro-tipo").value = '';
    mostrarAdquisiciones();
}

// Renderizar la lista de adquisiciones
function renderizarLista(adquisiciones) {
    const lista = document.getElementById("lista-adquisiciones");
    lista.innerHTML = adquisiciones.map(adq => `
        <li>
            <strong>${adq.tipo} - ${adq.proveedor}</strong>
            <div class="detalle">
                Unidad: ${adq.unidad} | Fecha: ${adq.fecha} |
                Cantidad: ${adq.cantidad} | Valor Total: COP ${adq.valorTotal.toLocaleString()}
            </div>
        </li>
    `).join('');
}

// Manejar el formulario
document.getElementById("form-adquisicion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevaAdquisicion = {
        presupuesto: parseFloat(document.getElementById("presupuesto").value),
        unidad: document.getElementById("unidad").value,
        tipo: document.getElementById("tipo").value,
        cantidad: parseInt(document.getElementById("cantidad").value),
        valorUnitario: parseFloat(document.getElementById("valorUnitario").value),
        fecha: document.getElementById("fecha").value,
        proveedor: document.getElementById("proveedor").value,
        documentacion: document.getElementById("documentacion").value
    };

    await crearAdquisicion(nuevaAdquisicion);
});

// Cargar adquisiciones y historial al inicio
window.onload = () => {
    mostrarAdquisiciones();
    cargarHistorial();
};
