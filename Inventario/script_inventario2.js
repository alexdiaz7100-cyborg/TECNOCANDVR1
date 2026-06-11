
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Configuración de tu proyecto
const firebaseConfig = {
    apiKey: "AIzaSyCNDvUfJ8OFMNN6Y-t2c2zZAmLkkJZ3rX4",
    projectId: "transportecolectivomanagua",
    storageBucket: "transportecolectivomanagua.firebasestorage.app",
    messagingSenderId: "128935348270",
    appId: "1:128935348270:web:6c4f89b2fc1e7fb22ff7bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lógica única que detecta si estás en la Tienda o en el Inventario
onSnapshot(collection(db, "inventario"), (snapshot) => {
    
    // 1. Lógica para inventario.html (Tabla)
    const tabla = document.querySelector('#inventory-table tbody');
    if (tabla) {
        tabla.innerHTML = "";
        snapshot.forEach((docItem) => {
            const p = docItem.data();
            const tr = document.createElement("tr");
            const claseAlerta = p.stock <= 5 ? "alerta-stock" : "";
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.model}</td>
                <td>$${p.price}</td>
                <td class="${claseAlerta}">${p.stock} u.</td>
                <td><button class="delete-btn" onclick="window.borrar('${docItem.id}')">Eliminar</button></td>
            `;
            tabla.appendChild(tr);
        });
    }

    // 2. Lógica para Index.html (Tienda)
    const contenedor = document.querySelector("#contenedor-productos");
    if (contenedor) {
        contenedor.innerHTML = "";
        snapshot.forEach((docItem) => {
            const p = docItem.data();
            const div = document.createElement("div");
            div.className = "producto";
            const claseAlertaTxt = p.stock <= 5 ? "alerta-txt" : "";
            div.innerHTML = `
                <img class="producto-imagen" src="${p.imagen}" alt="${p.name}">
                <div class="producto-detalles">
                    <h3>${p.name} - ${p.model}</h3>
                    <p>Precio: $${p.price}</p>
                    <p class="${claseAlertaTxt}">${p.stock <= 5 ? '¡Últimas ' + p.stock + ' unidades!' : 'Stock: ' + p.stock}</p>
                    <button class="producto-agregar" ${p.stock == 0 ? 'disabled' : ''}>Agregar al carrito</button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }
});

// Lógica para agregar nuevos productos (Formulario)
const formulario = document.getElementById('inventory-form');
if (formulario) {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "inventario"), {
                name: document.getElementById('name').value,
                model: document.getElementById('model').value,
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value),
                stock: parseInt(document.getElementById('stock').value),
                imagen: document.getElementById('imagen').value
            });
            formulario.reset();
            alert("Producto guardado con éxito");
        } catch (error) {
            console.error("Error al guardar: ", error);
        }
    });
}

// Función global para eliminar desde el HTML
window.borrar = async (id) => {
    if(confirm("¿Estás seguro de eliminar este producto?")) {
        await deleteDoc(doc(db, "inventario", id));
    }
};