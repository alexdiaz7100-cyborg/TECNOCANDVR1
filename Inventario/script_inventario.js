document.getElementById('inventory-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores
    const name = document.getElementById('name').value;
    const model = document.getElementById('model').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;

    // Crear fila en la tabla
    addProductoToTable(name, model, category, price, stock);

    // Limpiar formulario
    this.reset();
});

function addProductoToTable(name, model, category, price, stock) {
    const table = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${model}</td>
        <td><span class="badge">${category}</span></td>
        <td>$${parseFloat(price).toFixed(2)}</td>
        <td>${stock} u.</td>
        <td><button class="delete-btn" onclick="deleteRow(this)">Eliminar</button></td>
    `;
}

function deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

