let adquisiciones = [];
let idCounter = 1;

const form = document.getElementById('adquisicionForm');
const tableBody = document.querySelector('#adquisicionTable tbody');
const listaElementos = document.getElementById('listaElementos');

// Función para calcular el valor total automáticamente
form.cantidad.addEventListener('input', calcularValorTotal);
form.valorUnitario.addEventListener('input', calcularValorTotal);

function calcularValorTotal() {
    const cantidad = parseFloat(form.cantidad.value) || 0;
    const valorUnitario = parseFloat(form.valorUnitario.value) || 0;
    form.valorTotal.value = cantidad * valorUnitario;
}

// Registrar nueva adquisición
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevaAdquisicion = {
        id: idCounter++,
        presupuesto: form.presupuesto.value,
        unidad: form.unidad.value,
        tipo: form.tipo.value,
        cantidad: form.cantidad.value,
        valorTotal: form.valorTotal.value,
        fecha: form.fecha.value,
        proveedor: form.proveedor.value,
        documentacion: form.documentacion.value,
    };
    adquisiciones.push(nuevaAdquisicion);
    actualizarTabla();
    form.reset();
});

// Actualizar la tabla de adquisiciones
function actualizarTabla(filtradas = adquisiciones) {
    tableBody.innerHTML = '';
    filtradas.forEach((adq) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${adq.id}</td>
            <td>${adq.presupuesto}</td>
            <td>${adq.unidad}</td>
            <td>${adq.tipo}</td>
            <td>${adq.cantidad}</td>
            <td>${adq.valorTotal}</td>
            <td>${adq.fecha}</td>
            <td>${adq.proveedor}</td>
            <td>
                <button onclick="editarAdquisicion(${adq.id})">Editar</button>
                <button onclick="eliminarAdquisicion(${adq.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Aplicar filtros
function aplicarFiltros() {
    const unidad = document.getElementById('filtroUnidad').value.toLowerCase();
    const proveedor = document.getElementById('filtroProveedor').value.toLowerCase();

    const filtradas = adquisiciones.filter((adq) =>
        adq.unidad.toLowerCase().includes(unidad) &&
        adq.proveedor.toLowerCase().includes(proveedor)
    );

    actualizarTabla(filtradas);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filtroUnidad').value = '';
    document.getElementById('filtroProveedor').value = '';
    actualizarTabla();
}

// Editar una adquisición existente
function editarAdquisicion(id) {
    const adq = adquisiciones.find((item) => item.id === id);
    if (adq) {
        form.presupuesto.value = adq.presupuesto;
        form.unidad.value = adq.unidad;
        form.tipo.value = adq.tipo;
        form.cantidad.value = adq.cantidad;
        form.valorUnitario.value = adq.valorTotal / adq.cantidad;
        form.fecha.value = adq.fecha;
        form.proveedor.value = adq.proveedor;
        form.documentacion.value = adq.documentacion;

        eliminarAdquisicion(id);
    }
}

// Eliminar adquisición
function eliminarAdquisicion(id) {
    adquisiciones = adquisiciones.filter((item) => item.id !== id);
    actualizarTabla();
}

// Mostrar lista de información relevante
function mostrarInformacionRelevante() {
    listaElementos.innerHTML = adquisiciones.map(
        (adq) => `<li>${adq.tipo} - ${adq.proveedor} (${adq.valorTotal} USD)</li>`
    ).join('');
}

setInterval(mostrarInformacionRelevante, 5000);
