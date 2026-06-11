import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNDvUfJ8OFMNN6Y-t2c2zZAmLkkJZ3rX4",
    projectId: "transportecolectivomanagua",
    storageBucket: "transportecolectivomanagua.firebasestorage.app",
    messagingSenderId: "128935348270",
    appId: "1:128935348270:web:6c4f89b2fc1e7fb22ff7bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let listaProductos = [];
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numerito");

onSnapshot(collection(db, "inventario"), (snapshot) => {
    listaProductos = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        listaProductos.push({
            id: doc.id,
            titulo: data.name,
            imagen: data.imagen,
            precio: parseFloat(data.price) || 0,
            categoria: data.category, // Asegúrate que en Firebase sea "pc", "net", "varios"
            stock: parseInt(data.stock) || 0
        });
    });
    cargarProductos(listaProductos);
});

function cargarProductos(productos) {
    contenedorProductos.innerHTML = "";
    productos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${p.imagen}" alt="${p.titulo}" style="width:100px;",height:100px;">
            <h3>${p.titulo}</h3>
            <p>C$${p.precio}</p>
            <p>Existencia: ${p.stock}</p>
            <button class="producto-agregar" id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                ${p.stock <= 0 ? 'AGOTADO' : 'AGREGAR'}
            </button>
        `;
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    const producto = listaProductos.find(p => p.id === idBoton);
    const enCarrito = carrito.find(p => p.id === idBoton);
    
    // CORRECCIÓN: Validamos lo que el usuario quiere tener al final
    const cantidadActual = enCarrito ? enCarrito.cantidad : 0;
    
    if (cantidadActual + 1 > producto.stock) {
        alert("¡No hay suficiente stock! Existencia actual: " + producto.stock);
        return;
    }

    if (enCarrito) {
        enCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
    actualizarNumerito();
    alert("Agregado al carrito");
}

function actualizarBotonesAgregar() {
    document.querySelectorAll(".producto-agregar").forEach(b => b.addEventListener("click", agregarAlCarrito));
}

function actualizarNumerito() {
    const carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    numerito.innerText = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

// CATEGORÍAS CORREGIDAS
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        
        const cat = e.currentTarget.id;
        if (cat === "todos") {
            tituloPrincipal.innerText = "BIENVENIDOS A TECNOCAND";
            cargarProductos(listaProductos);
        } else {
            const filtrados = listaProductos.filter(p => p.categoria === cat);
            cargarProductos(filtrados);
        }
    });
});

actualizarNumerito();