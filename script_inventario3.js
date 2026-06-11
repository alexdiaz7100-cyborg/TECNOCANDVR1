
// 1. Al cargar la página, recuperar los datos guardados
document.addEventListener('DOMContentLoaded', () => {
    const savedInventory = JSON.parse(localStorage.getItem('techInventory')) || [];
    savedInventory.forEach(prod => addProductoToTable(prod.name, prod.model, prod.category, prod.price, prod.stock));
});

// 2. Escuchar el envío del formulario
document.getElementById('inventory-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        model: document.getElementById('model').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value
    };

    // Agregar visualmente a la tabla
    addProductoToTable(product.name, product.model, product.category, product.price, product.stock);
    
    // Guardar en LocalStorage
    saveProduct(product);

    this.reset();
});

// Función para insertar filas en la tabla
function addProductoToTable(name, model, category, price, stock) {
    const tableBody = document.querySelector('#inventory-table tbody');
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${model}</td>
        <td>${category}</td>
        <td>$${parseFloat(price).toFixed(2)}</td>
        <td>${stock} u.</td>
        <td><button class="delete-btn" onclick="deleteRow(this, '${name}')">Eliminar</button></td> `;
}

// 3. Función para guardar en LocalStorage
function saveProduct(product) {
    let inventory = JSON.parse(localStorage.getItem('techInventory')) || [];
    inventory.push(product);
    localStorage.setItem('techInventory', JSON.stringify(inventory));
}

// 4. Función para eliminar y actualizar LocalStorage
function deleteRow(btn, name) {
    // Eliminar de la vista
    const row = btn.parentNode.parentNode;
    row.remove();

    // Eliminar de LocalStorage
    let inventory = JSON.parse(localStorage.getItem('techInventory')) || [];
    inventory = inventory.filter(prod => prod.name !== name); // Filtra por nombre
    localStorage.setItem('techInventory', JSON.stringify(inventory));
}
