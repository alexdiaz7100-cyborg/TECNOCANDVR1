import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCNDvUfJ8OFMNN6Y-t2c2zZAmLkkJZ3rX4",
    projectId: "transportecolectivomanagua",
    storageBucket: "transportecolectivomanagua.firebasestorage.app",
    messagingSenderId: "128935348270",
    appId: "1:128935348270:web:6c4f89b2fc1e7fb22ff7bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos del DOM
let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const btnVaciar = document.querySelector("#carrito-acciones-vaciar");
const btnComprar = document.querySelector("#carrito-acciones-comprar");
const totalGeneral = document.querySelector("#total");

// 1. FUNCIÓN PARA DIBUJAR LOS PRODUCTOS Y CALCULAR TOTALES
function renderizarCarrito() {
    if (carrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";
        let total = 0;

        carrito.forEach(p => {
            const subtotal = p.precio * p.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${p.imagen}" alt="${p.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${p.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${p.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>C$${p.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>C$${subtotal}</p>
                </div>
            `;
            contenedorCarritoProductos.append(div);
        });
        totalGeneral.innerText = `C$${total}`;
    } else {
        // Carrito vacío
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
    }
}

// 2. ACCIÓN VACIAR CARRITO
btnVaciar.addEventListener("click", () => {
    localStorage.removeItem("productos-en-carrito");
    carrito = [];
    renderizarCarrito();
});

// 3. ACCIÓN COMPRAR (Actualiza Firebase)
btnComprar.addEventListener("click", async () => {
    try {
        btnComprar.innerText = "Procesando...";
        btnComprar.disabled = true;

        for (const item of carrito) {
            const prodRef = doc(db, "inventario", item.id);
            // Restamos la cantidad comprada al stock de Firebase
            await updateDoc(prodRef, {
                stock: increment(-item.cantidad)
            });
        }
        
        localStorage.removeItem("productos-en-carrito");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
        
    } catch (error) {
        console.error("Error al procesar compra: ", error);
        alert("Hubo un error al procesar tu compra. Intenta de nuevo.");
        btnComprar.innerText = "Comprar ahora";
        btnComprar.disabled = false;
    }
});

// Iniciar renderizado
renderizarCarrito();