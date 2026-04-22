// ---------- MODELO DE DATOS ----------
// Cada tarea: { id, descripcion, prioridad, fechaLimite, estado }
let tareas = [];

// Estados posibles: "pendiente", "progreso", "completado"
const ESTADOS = {
    PENDIENTE: "pendiente",
    PROGRESO: "progreso",
    COMPLETADO: "completado"
};

// Mapeo para orden de columnas y siguientes estados (para botones mover)
const siguienteEstado = {
    [ESTADOS.PENDIENTE]: ESTADOS.PROGRESO,
    [ESTADOS.PROGRESO]: ESTADOS.COMPLETADO,
    [ESTADOS.COMPLETADO]: null   // no mover más allá
};

const estadoAnterior = {
    [ESTADOS.PENDIENTE]: null,
    [ESTADOS.PROGRESO]: ESTADOS.PENDIENTE,
    [ESTADOS.COMPLETADO]: ESTADOS.PROGRESO
};

// Helper para guardar en localStorage (opcional pero persistencia)
function guardarEnLocalStorage() {
    localStorage.setItem("kanbanTareas", JSON.stringify(tareas));
}

function cargarDesdeLocalStorage() {
    const data = localStorage.getItem("kanbanTareas");
    if (data) {
        tareas = JSON.parse(data);
    } else {
        // datos de ejemplo iniciales para demostración
        tareas = [
            {
                id: "1",
                descripcion: "Implementar diseño responsive del tablero",
                prioridad: "alta",
                fechaLimite: "2026-04-22",
                estado: ESTADOS.PENDIENTE
            },
            {
                id: "2",
                descripcion: "Agregar funcionalidad de botones mover/eliminar",
                prioridad: "media",
                fechaLimite: "2026-04-21",
                estado: ESTADOS.PROGRESO
            },
            {
                id: "3",
                descripcion: "Documentar uso de IA en el proyecto",
                prioridad: "baja",
                fechaLimite: "2026-04-23",
                estado: ESTADOS.COMPLETADO
            }
        ];
    }
}

// Generador simple de ID
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para renderizar todo el Kanban (actualizar contadores y listas)
function renderizarKanban() {
    // Limpiar contenedores
    const contenedorPendiente = document.getElementById("lista-pendiente");
    const contenedorProgreso = document.getElementById("lista-progreso");
    const contenedorCompletado = document.getElementById("lista-completado");

    contenedorPendiente.innerHTML = "";
    contenedorProgreso.innerHTML = "";
    contenedorCompletado.innerHTML = "";

    // Contadores
    let contPend = 0, contProg = 0, contComp = 0;

    tareas.forEach(tarea => {
        const tarjeta = crearTarjetaDOM(tarea);
        if (tarea.estado === ESTADOS.PENDIENTE) {
            contenedorPendiente.appendChild(tarjeta);
            contPend++;
        } else if (tarea.estado === ESTADOS.PROGRESO) {
            contenedorProgreso.appendChild(tarjeta);
            contProg++;
        } else if (tarea.estado === ESTADOS.COMPLETADO) {
            contenedorCompletado.appendChild(tarjeta);
            contComp++;
        }
    });

    // Mostrar mensajes vacíos si no hay tareas
    if (contPend === 0) mostrarMensajeVacio(contenedorPendiente, "No hay tareas pendientes");
    if (contProg === 0) mostrarMensajeVacio(contenedorProgreso, "No hay tareas en progreso");
    if (contComp === 0) mostrarMensajeVacio(contenedorCompletado, "Tareas completadas aparecerán aquí");

    // Actualizar contadores en UI
    document.getElementById("counter-pendiente").innerText = contPend;
    document.getElementById("counter-progreso").innerText = contProg;
    document.getElementById("counter-completado").innerText = contComp;

    guardarEnLocalStorage();
}

function mostrarMensajeVacio(contenedor, mensaje) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-message";
    emptyDiv.innerText = mensaje;
    contenedor.appendChild(emptyDiv);
}

// Crear tarjeta DOM con datos de la tarea
function crearTarjetaDOM(tarea) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("data-id", tarea.id);
    card.setAttribute("data-prioridad", tarea.prioridad);

    // descripción
    const descElem = document.createElement("div");
    descElem.className = "task-desc";
    descElem.innerText = tarea.descripcion;

    // metadata
    const metaElem = document.createElement("div");
    metaElem.className = "task-meta";
    const prioridadFormateada = {
        "alta": "🔴 Alta",
        "media": "🟠 Media",
        "baja": "🟢 Baja"
    }[tarea.prioridad] || tarea.prioridad;
    const fechaLimite = tarea.fechaLimite ? `📅 ${new Date(tarea.fechaLimite).toLocaleDateString()}` : "Sin fecha";
    metaElem.innerHTML = `<span class="task-prioridad">${prioridadFormateada}</span><span>${fechaLimite}</span>`;

    // Botones de acción
    const acciones = document.createElement("div");
    acciones.className = "task-actions";

    // Botón mover (derecha) si existe siguiente estado
    const estadoActual = tarea.estado;
    const next = siguienteEstado[estadoActual];
    if (next) {
        const btnMover = document.createElement("button");
        btnMover.innerText = "→ Mover";
        btnMover.className = "btn-mover";
        btnMover.addEventListener("click", (e) => {
            e.stopPropagation();
            moverTarea(tarea.id, next);
        });
        acciones.appendChild(btnMover);
    }

    // Botón mover izquierda (retroceder) si existe estado anterior y no está en pendiente
    const prev = estadoAnterior[estadoActual];
    if (prev) {
        const btnAtras = document.createElement("button");
        btnAtras.innerText = "← Retroceder";
        btnAtras.className = "btn-mover";
        btnAtras.addEventListener("click", (e) => {
            e.stopPropagation();
            moverTarea(tarea.id, prev);
        });
        acciones.appendChild(btnAtras);
    }

    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.innerText = "🗑 Eliminar";
    btnEliminar.className = "btn-eliminar";
    btnEliminar.addEventListener("click", (e) => {
        e.stopPropagation();
        eliminarTarea(tarea.id);
    });
    acciones.appendChild(btnEliminar);

    card.appendChild(descElem);
    card.appendChild(metaElem);
    card.appendChild(acciones);
    return card;
}

// Mover tarea a nuevo estado
function moverTarea(id, nuevoEstado) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea && nuevoEstado) {
        tarea.estado = nuevoEstado;
        renderizarKanban();
    }
}

function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    renderizarKanban();
}

// Agregar nueva tarea validando campos
function agregarTarea(descripcion, prioridad, fechaLimite) {
    // Validación campos no vacíos
    if (!descripcion || descripcion.trim() === "") {
        alert("❌ La descripción es obligatoria.");
        return false;
    }
    if (!prioridad || prioridad === "") {
        alert("❌ Debes seleccionar una prioridad.");
        return false;
    }
    if (!fechaLimite) {
        alert("❌ La fecha límite es requerida.");
        return false;
    }

    // Validación extra: fecha no puede ser en el pasado? No obligatorio, pero recomendable
    const fechaSeleccionada = new Date(fechaLimite);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
        if (!confirm("⚠️ La fecha límite es anterior a hoy. ¿Deseas agregar la tarea de todas formas?")) {
            return false;
        }
    }

    const nuevaTarea = {
        id: generarId(),
        descripcion: descripcion.trim(),
        prioridad: prioridad,
        fechaLimite: fechaLimite,
        estado: ESTADOS.PENDIENTE   // siempre se agrega a pendientes
    };
    tareas.push(nuevaTarea);
    renderizarKanban();
    return true;
}

// Evento del formulario
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descripcion").value;
    const prioridad = document.getElementById("prioridad").value;
    const fecha = document.getElementById("fecha").value;

    const exito = agregarTarea(descripcion, prioridad, fecha);
    if (exito) {
        // Limpiar formulario (opcional)
        document.getElementById("taskForm").reset();
        // Enfocar de nuevo
        document.getElementById("descripcion").focus();
    }
});

// Inicializar app: cargar datos y pintar
function init() {
    cargarDesdeLocalStorage();
    renderizarKanban();
}

init();