// Array para almacenar gastos
const gastos = [];

// Función para registrar gasto
function registrarGasto() {
    let nombre = prompt("Nombre del gasto:");
    let monto = parseFloat(prompt("Monto del gasto:"));
    
    if (nombre && !isNaN(monto)) {
        gastos.push({ nombre, monto });
        alert("Gasto registrado correctamente");
    } else {
        alert("Datos inválidos. Intenta nuevamente.");
    }
}

// Función para mostrar total de gastos
function mostrarTotal() {
    if (gastos.length === 0) {
        alert("No hay gastos registrados");
        return;
    }

    let total = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    let mensaje = "Detalle de Gastos:\n";
    
    gastos.forEach(gasto => {
        mensaje += `${gasto.nombre}: $${gasto.monto.toFixed(2)}\n`;
    });
    
    mensaje += `\nTotal de gastos: $${total.toFixed(2)}`;
    alert(mensaje);
}

// Función de menú principal
function menu() {
    let opcion = prompt("Selecciona una opción:\n1. Registrar gasto\n2. Ver total de gastos\n3. Salir");
    
    switch(opcion) {
        case "1": 
            registrarGasto(); 
            menu(); 
            break;
        case "2": 
            mostrarTotal(); 
            menu(); 
            break;
        case "3": 
            alert("Gracias por usar el simulador de gastos"); 
            break;
        default:
            alert("Opción inválida. Intenta nuevamente.");
            menu();
    }
}

// Iniciar el programa
menu();