// Variables globales
let gastos = [];
let categorias = [];

// Elementos del DOM
const formularioGasto = document.getElementById('formularioGasto');
const listaGastos = document.getElementById('listaGastos');
const mensajeNoGastos = document.getElementById('mensajeNoGastos');
const selectCategoria = document.getElementById('categoria');
const selectFiltroCategoria = document.getElementById('filtroCategoria');
const totalGastadoElement = document.getElementById('totalGastado');
const totalPorCategoriaElement = document.getElementById('totalPorCategoria');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    cargarCategorias();
    configurarEventListeners();
});

// Cargar gastos desde localStorage
function cargarDatos() {
    const gastosGuardados = localStorage.getItem('gastos');
    if (gastosGuardados) {
        gastos = JSON.parse(gastosGuardados);
        actualizarInterfaz();
    }
}

// Cargar categorías desde el archivo JSON
async function cargarCategorias() {
    try {
        const respuesta = await fetch('data/categorias.json');
        const datos = await respuesta.json();
        categorias = datos.categorias;
        cargarSelects();
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Cargar selects con las categorías
function cargarSelects() {
    // Limpiar selects
    selectCategoria.innerHTML = '';
    selectFiltroCategoria.innerHTML = '<option value="todas">Todas</option>';
    
    // Cargar categorías en los selects
    categorias.forEach(categoria => {
        // Select del formulario
        const optionFormulario = document.createElement('option');
        optionFormulario.value = categoria.id;
        optionFormulario.textContent = categoria.nombre;
        selectCategoria.appendChild(optionFormulario);
        
        // Select del filtro
        const optionFiltro = document.createElement('option');
        optionFiltro.value = categoria.id;
        optionFiltro.textContent = categoria.nombre;
        selectFiltroCategoria.appendChild(optionFiltro);
    });
}

// Configurar eventos
function configurarEventListeners() {
    // Evento para agregar un gasto
    formularioGasto.addEventListener('submit', agregarGasto);
    
    // Evento para filtrar gastos
    selectFiltroCategoria.addEventListener('change', filtrarGastos);
}

// Agregar un nuevo gasto
function agregarGasto(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const concepto = document.getElementById('concepto').value.trim();
    const monto = parseFloat(document.getElementById('monto').value);
    const categoriaId = parseInt(document.getElementById('categoria').value);
    const fecha = document.getElementById('fecha').value;
    
    // Validar datos
    if (!concepto || isNaN(monto) || monto <= 0 || !fecha) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }
    
    // Crear nuevo gasto
    const nuevoGasto = {
        id: Date.now(), // ID único basado en timestamp
        concepto,
        monto,
        categoriaId,
        fecha,
        fechaCreacion: new Date().toISOString()
    };
    
    // Agregar al array de gastos
    gastos.push(nuevoGasto);
    
    // Guardar en localStorage
    guardarGastosEnLocalStorage();
    
    // Limpiar formulario
    formularioGasto.reset();
    
    // Establecer fecha por defecto como hoy
    document.getElementById('fecha').valueAsDate = new Date();
    
    // Actualizar la interfaz
    actualizarInterfaz();
}

// Eliminar un gasto
function eliminarGasto(id) {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
        // Filtrar los gastos para quitar el eliminado
        gastos = gastos.filter(gasto => gasto.id !== id);
        
        // Guardar en localStorage
        guardarGastosEnLocalStorage();
        
        // Actualizar la interfaz
        actualizarInterfaz();
    }
}

// Filtrar gastos por categoría
function filtrarGastos() {
    actualizarInterfaz();
}

// Guardar gastos en localStorage
function guardarGastosEnLocalStorage() {
    localStorage.setItem('gastos', JSON.stringify(gastos));
}

// Actualizar toda la interfaz
function actualizarInterfaz() {
    mostrarGastos();
    actualizarResumen();
}

// Mostrar los gastos en la interfaz
function mostrarGastos() {
    // Limpiar la lista
    listaGastos.innerHTML = '';
    
    // Obtener el filtro seleccionado
    const filtroCategoria = selectFiltroCategoria.value;
    
    // Filtrar gastos si es necesario
    let gastosFiltrados = gastos;
    if (filtroCategoria !== 'todas') {
        gastosFiltrados = gastos.filter(gasto => 
            gasto.categoriaId === parseInt(filtroCategoria)
        );
    }
    
    // Ordenar por fecha más reciente
    gastosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Mostrar mensaje si no hay gastos
    if (gastosFiltrados.length === 0) {
        listaGastos.appendChild(mensajeNoGastos);
        return;
    } else {
        if (listaGastos.contains(mensajeNoGastos)) {
            listaGastos.removeChild(mensajeNoGastos);
        }
    }
    
    // Crear un elemento para cada gasto
    gastosFiltrados.forEach(gasto => {
        // Obtener la categoría del gasto
        const categoria = categorias.find(cat => cat.id === gasto.categoriaId);
        const nombreCategoria = categoria ? categoria.nombre : 'Desconocida';
        
        // Crear el elemento del gasto
        const elementoGasto = document.createElement('div');
        elementoGasto.className = `gasto categoria-${nombreCategoria.toLowerCase()}`;
        elementoGasto.dataset.id = gasto.id;
        
        // Formatear la fecha
        const fechaFormateada = new Date(gasto.fecha).toLocaleDateString();
        
        // Estructura del elemento
        elementoGasto.innerHTML = `
            <div class="gasto-info">
                <div class="gasto-concepto">${gasto.concepto}</div>
                <div class="gasto-detalle">
                    ${nombreCategoria} • ${fechaFormateada}
                </div>
            </div>
            <div class="gasto-monto">$${gasto.monto.toFixed(2)}</div>
            <div class="gasto-acciones">
                <button class="boton boton-secundario btn-eliminar">✕</button>
            </div>
        `;
        
        // Agregar evento para eliminar
        const btnEliminar = elementoGasto.querySelector('.btn-eliminar');
        btnEliminar.addEventListener('click', () => {
            eliminarGasto(gasto.id);
        });
        
        // Agregar a la lista
        listaGastos.appendChild(elementoGasto);
    });
}

// Actualizar el resumen de gastos
function actualizarResumen() {
    // Calcular el total gastado
    const total = gastos.reduce((acumulado, gasto) => acumulado + gasto.monto, 0);
    totalGastadoElement.textContent = `$${total.toFixed(2)}`;
    
    // Calcular totales por categoría
    const totalesPorCategoria = {};
    
    // Inicializar los totales
    categorias.forEach(categoria => {
        totalesPorCategoria[categoria.id] = 0;
    });
    
    // Sumar los gastos por categoría
    gastos.forEach(gasto => {
        totalesPorCategoria[gasto.categoriaId] += gasto.monto;
    });
    
    // Mostrar los totales por categoría
    totalPorCategoriaElement.innerHTML = '';
    
    categorias.forEach(categoria => {
        // Solo mostrar categorías con gastos
        if (totalesPorCategoria[categoria.id] > 0) {
            const elementoCategoria = document.createElement('div');
            elementoCategoria.className = 'categoria-total';
            elementoCategoria.innerHTML = `
                <span>${categoria.nombre}</span>
                <span>$${totalesPorCategoria[categoria.id].toFixed(2)}</span>
            `;
            totalPorCategoriaElement.appendChild(elementoCategoria);
        }
    });
}

// Establecer la fecha de hoy como predeterminada al cargar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha').valueAsDate = new Date();
});