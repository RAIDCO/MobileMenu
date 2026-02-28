
let currentTable; // Declare currentTable in global scope
let db;
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get table number from URL, removing any extra "?table=" that might have been appended
    const urlParams = new URLSearchParams(window.location.search);
    let tableNum = urlParams.get('table');
    // Clean up the table number in case it has extra parameters
    if (tableNum && tableNum.includes('?')) {
        tableNum = tableNum.split('?')[0];
    }
    currentTable = tableNum || '1';
    console.log('Table number from URL:', currentTable); // Debug log

    // Update all menu links with table number
    document.querySelectorAll('.menu-item a').forEach(link => {
        const currentHref = link.getAttribute('href').split('?')[0]; // Remove any existing parameters
        link.setAttribute('href', `${currentHref}?table=${currentTable}`);
    });

    // Update receipt icon
    const receiptIcon = document.getElementById('receipt-icon');
    if (receiptIcon) {
        receiptIcon.onclick = function() {
            showReceipt(currentTable);
        };
    }

    // Update receipt title
    const receiptTitle = document.querySelector('.receipt-title');
    if (receiptTitle) {
        receiptTitle.textContent = `Mar y Tierra - Mesa ${currentTable}`;
    }

    // Initialize cart for this table
    loadCartFromStorage(currentTable);
});
// Initialize SQLite database
document.addEventListener('DOMContentLoaded', function() {
    // Check if SQLite is available
    if (typeof SQLite === 'undefined') {
        console.error('SQLite library not loaded');
        return;
    }

    try {
        // Initialize database
        db = new SQLite.Database('products.db');

    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, size TEXT, price REAL)");
        db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        table_number INTEGER,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_amount REAL
        )`);
        // Insert products into the database
        const products = [
            { name: "Ceviche de Camarón", size: "Normal", price: 10.00 },
            { name: "Ceviche de Camarón", size: "Grande", price: 15.00 },
            { name: "Paella de Mariscos", size: "Normal", price: 12.00 },
            { name: "Paella de Mariscos", size: "Grande", price: 18.00 },
            { name: "Pasta con Salsa de Mariscos", size: "Normal", price: 11.00 },
            { name: "Pasta con Salsa de Mariscos", size: "Grande", price: 16.00 },
            { name: "Sushi de Atún", size: "Normal", price: 14.00 },
            { name: "Sushi de Atún", size: "Grande", price: 20.00 },
            { name: "Coctel de Mariscos", size: "Normal", price: 9.00 },
            { name: "Coctel de Mariscos", size: "Grande", price: 14.00 },
            { name: "Fish and Chips", size: "Normal", price: 8.00 },
            { name: "Fish and Chips", size: "Grande", price: 12.00 },
            // New Hamburger Products
            { name: "Hamburguesa Clásica", size: "Normal", price: 12.00 },
            { name: "Hamburguesa Clásica", size: "Grande", price: 16.00 },
            { name: "Hamburguesa BBQ", size: "Normal", price: 13.00 },
            { name: "Hamburguesa BBQ", size: "Grande", price: 17.00 },
            { name: "Hamburguesa Vegetariana", size: "Normal", price: 11.00 },
            { name: "Hamburguesa Vegetariana", size: "Grande", price: 15.00 },
            { name: "Hamburguesa Picante", size: "Normal", price: 14.00 },
            { name: "Hamburguesa Picante", size: "Grande", price: 18.00 },
            { name: "Hamburguesa Doble", size: "Normal", price: 15.00 },
            { name: "Hamburguesa Doble", size: "Grande", price: 20.00 },
            { name: "Hamburguesa Fiesta", size: "Normal", price: 13.00 },
            { name: "Hamburguesa Fiesta", size: "Grande", price: 18.00 },
            //Pastas
            { name: "Pasta Boloñesa", size: "Normal", price: 10.00 },
            { name: "Pasta Boloñesa", size: "Grande", price: 15.00 },
            { name: "Pasta Alfredo", size: "Normal", price: 11.00 },
            { name: "Pasta Alfredo", size: "Grande", price: 16.00 },
            { name: "Pasta Pesto", size: "Normal", price: 12.00 },
            { name: "Pasta Pesto", size: "Grande", price: 17.00 },
            { name: "Pasta con Mariscos", size: "Normal", price: 13.00 },
            { name: "Pasta con Mariscos", size: "Grande", price: 18.00 },
            { name: "Pasta Vegetariana", size: "Normal", price: 11.00 },
            { name: "Pasta Vegetariana", size: "Grande", price: 15.00 },
            { name: "Pasta Carbonara", size: "Normal", price: 12.00 },
            { name: "Pasta Carbonara", size: "Grande", price: 17.00 },
            //SUSHI
            // New Sushi Products
        { name: "Rollo de Sushi", size: "Normal", price: 10.00 },
        { name: "Rollo de Sushi", size: "Grande", price: 15.00 },
        { name: "Sushi Nigiri", size: "Normal", price: 12.00 },
        { name: "Sushi Nigiri", size: "Grande", price: 17.00 },
        { name: "Sushi Maki", size: "Normal", price: 11.00 },
        { name: "Sushi Maki", size: "Grande", price: 16.00 },
        { name: "Sushi Temaki", size: "Normal", price: 12.00 },
        { name: "Sushi Temaki", size: "Grande", price: 17.00 },
        { name: "Sashimi", size: "Normal", price: 14.00 },
        { name: "Sashimi", size: "Grande", price: 20.00 },
        { name: "Sushi Fusión", size: "Normal", price: 15.00 },
        { name: "Sushi Fusión", size: "Grande", price: 22.00 },
        // New Beverage Products
        { name: "Jugo de Naranja", size: "Normal", price: 5.00 },
        { name: "Jugo de Naranja", size: "Grande", price: 8.00 },
        { name: "Jugo de Mora", size: "Normal", price: 6.00 },
        { name: "Jugo de Mora", size: "Grande", price: 9.00 },
        { name: "Limonada", size: "Normal", price: 5.00 },
        { name: "Limonada", size: "Grande", price: 8.00 },
        { name: "Coca Cola", size: "Normal", price: 4.00 },
        { name: "Coca Cola", size: "Grande", price: 7.00 },
        { name: "Cóctel", size: "Normal", price: 10.00 },
        { name: "Cóctel", size: "Grande", price: 15.00 },
        { name: "Bebida Energética", size: "Normal", price: 6.00 },
        { name: "Bebida Energética", size: "Grande", price: 9.00 },
        { name: "Pasta para Niños", size: "Normal", price: 7.00 },
        { name: "Pasta para Niños", size: "Grande", price: 10.00 },
        { name: "Hamburguesa para Niños", size: "Normal", price: 8.00 },
        { name: "Hamburguesa para Niños", size: "Grande", price: 12.00 },
        { name: "Pizza para Niños", size: "Normal", price: 9.00 },
        { name: "Pizza para Niños", size: "Grande", price: 13.00 },
        { name: "Tortilla para Niños", size: "Normal", price: 6.00 },
        { name: "Tortilla para Niños", size: "Grande", price: 9.00 },
        { name: "Nuggets de Pollo", size: "Normal", price: 7.00 },
        { name: "Nuggets de Pollo", size: "Grande", price: 10.00 },
        { name: "Fruta Fresca", size: "Normal", price: 5.00 },
        { name: "Fruta Fresca", size: "Grande", price: 8.00 }
        ];
        const stmt = db.prepare("INSERT INTO products (name, size, price) VALUES (?, ?, ?)");
        products.forEach(product => {
            stmt.run(product.name, product.size, product.price);
        });
        stmt.finalize();

        // Modify processPayment to ensure it's defined after db initialization
        window.processPayment = function(tableNumber) {
            if (!db) {
                console.error('Database not initialized');
                alert('Error: Database not ready');
                return;
            }

            const receiptContent = document.getElementById('receipt-content');
            const items = receiptContent.getElementsByClassName('receipt-item');
            
            if (items.length === 0) {
                alert("El carrito está vacío");
                return;
            }

            const total = parseFloat(document.getElementById('total').querySelector('span:last-child').innerText.replace('$', ''));
            
            db.run('INSERT INTO orders (table_number, total_amount) VALUES (?, ?)', [tableNumber, total], function(err) {
                if (err) {
                    console.error('Error al procesar la orden:', err);
                    alert('Error al procesar el pago');
                    return;
                }
                
                alert('¡Pago procesado exitosamente!');
                resetCart(tableNumber);
            });
        };
    });
} catch (error) {
    console.error('Database initialization error:', error);
}
});

function addToReceipt(name, size, basePrice, quantityId, tableNumber) {
    const quantityInput = document.getElementById(quantityId);
    const quantity = parseInt(quantityInput.value);
    
    const sizeRadio = document.querySelector(`input[name=portion-${quantityId.replace('quantity-', '')}]:checked`);
    const actualPrice = parseFloat(sizeRadio.parentElement.querySelector('span').innerText);
    
    if (quantity > 0) {
        const itemTotal = actualPrice * quantity;
        const receiptContent = document.getElementById('receipt-content');
        
        const emptyMessage = receiptContent.querySelector('.empty-receipt');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const existingTotal = document.getElementById('total');
        if (existingTotal) {
            existingTotal.remove();
        }

        const itemElement = document.createElement('div');
        itemElement.className = 'receipt-item';
        const itemId = `item-${Date.now()}`;
        itemElement.id = itemId;
        itemElement.innerHTML = `
            <div class="receipt-item-details">
                ${quantity}x ${size} ${name}
                <div class="unit-price">Precio unitario: $${actualPrice.toFixed(2)}</div>
            </div>
            <div class="receipt-item-price">
                $${itemTotal.toFixed(2)}
            </div>
            <button class="remove-item" onclick="removeItem('${itemId}', '${currentTable}')">×</button>
        `;
        
        receiptContent.appendChild(itemElement);
        updateTotal();
        saveCartToStorage(tableNumber);
        quantityInput.value = 1;
        alert("Producto agregado al carrito");
    } else {
        alert("Por favor, selecciona una cantidad válida.");
    }
}

function removeItem(itemId, tableNumber) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
        updateTotal();
        saveCartToStorage(tableNumber);
        
        const receiptContent = document.getElementById('receipt-content');
        const items = receiptContent.getElementsByClassName('receipt-item');
        if (items.length === 0) {
            receiptContent.innerHTML = '<div class="empty-receipt">No hay productos seleccionados.</div>';
            saveCartToStorage(tableNumber);
        }
    }
}

function updateTotal() {
    const receiptContent = document.getElementById('receipt-content');
    const items = receiptContent.getElementsByClassName('receipt-item');
    let total = 0;

    // Remove existing total if it exists
    const existingTotal = document.getElementById('total');
    if (existingTotal) {
        existingTotal.remove();
    }

    // Calculate new total
    for (let item of items) {
        const priceText = item.querySelector('.receipt-item-price').innerText;
        const price = parseFloat(priceText.replace('$', ''));
        if (!isNaN(price)) {
            total += price;
        }
    }

    // Add new total element at the end
    const totalElement = document.createElement('div');
    totalElement.id = 'total';
    totalElement.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
    `;
    receiptContent.appendChild(totalElement);

    // Show/hide cart action buttons
    const actionButtons = document.getElementById('cart-actions');
    if (actionButtons) {
        actionButtons.style.display = items.length > 0 ? 'flex' : 'none';
    }
}

function resetCart(tableNumber) {
    const receiptContent = document.getElementById('receipt-content');
    receiptContent.innerHTML = '<div class="empty-receipt">No hay productos seleccionados.</div>';
    updateTotal();
    
    // Get existing tables data
    const tablesData = JSON.parse(localStorage.getItem('tablesData') || '{}');
    
    // Remove data for specific table
    delete tablesData[tableNumber];
    
    // Save back to localStorage
    localStorage.setItem('tablesData', JSON.stringify(tablesData));
    
    // Ensure the cart is reset in the UI
    loadCartFromStorage(tableNumber); // This will ensure the UI reflects the reset
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
}




function processPayment(tableNumber) {
    const receiptContent = document.getElementById('receipt-content');
    const items = receiptContent.getElementsByClassName('receipt-item');
    
    if (items.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // Reset the cart
    receiptContent.innerHTML = '<div class="empty-receipt">No hay productos seleccionados.</div>';
    updateTotal();
    
    // Get existing tables data
    const tablesData = JSON.parse(localStorage.getItem('tablesData') || '{}');
    
    // Remove data for specific table
    delete tablesData[tableNumber];
    
    // Save back to localStorage
    localStorage.setItem('tablesData', JSON.stringify(tablesData));
    
    // Ensure the cart is reset in the UI
    loadCartFromStorage(tableNumber); // This will ensure the UI reflects the reset
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
    
    // Add prompts
    alert('¡Pago procesado exitosamente!'); // Payment processed prompt
    alert('¡Gracias por su compra!'); // Thank you prompt
}
   

    function showReceipt(tableNumber) {
        console.log('Showing receipt for table:', tableNumber); // Debug log
        
        const receipt = document.getElementById('receipt');
        if (!receipt) return;
        
        // Update date
        const dateElement = document.getElementById('receipt-date');
        if (dateElement) {
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        }
        
        // Update title
        const receiptTitle = document.querySelector('.receipt-title');
        if (receiptTitle) {
            receiptTitle.textContent = `Mar y Tierra - Mesa ${tableNumber}`;
        }
        
        // Load cart items
        loadCartFromStorage(tableNumber);
        
        // Show receipt
        receipt.style.display = 'block';
    }
function closeReceipt() {
    document.getElementById('receipt').style.display = 'none';
}

function changeQuantity(id, delta) {
    const quantityInput = document.getElementById(id);
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value);
        currentValue += delta;
        if (currentValue < 1) currentValue = 1;
        quantityInput.value = currentValue;
    }
}
function saveCartToStorage(tableNumber, reset = false) {
    const tablesData = JSON.parse(localStorage.getItem('tablesData') || '{}');

    if (reset) {
        delete tablesData[tableNumber];
    } else {
        const receiptContent = document.getElementById('receipt-content');
        const items = Array.from(receiptContent.getElementsByClassName('receipt-item')).map(item => ({
            id: item.id,
            details: item.querySelector('.receipt-item-details').innerHTML, // Changed from innerText to innerHTML to preserve the unit price div
            price: item.querySelector('.receipt-item-price').innerText,
        }));

        tablesData[tableNumber] = items;
    }

    localStorage.setItem('tablesData', JSON.stringify(tablesData));
    const event = new CustomEvent('cartUpdated');
    document.dispatchEvent(event);
}

function loadCartFromStorage(tableNumber) {
    console.log('Loading cart for table:', tableNumber);
    
    if (!tableNumber) {
        console.error('Table number is missing');
        return;
    }

    const receiptContent = document.getElementById('receipt-content');
    if (!receiptContent) return;

    const tablesData = JSON.parse(localStorage.getItem('tablesData') || '{}');
    const savedItems = tablesData[tableNumber] || [];
    
    receiptContent.innerHTML = '';
    
    if (savedItems.length === 0) {
        receiptContent.innerHTML = '<div class="empty-receipt">No hay productos seleccionados.</div>';
        return;
    }
    
    savedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'receipt-item';
        itemElement.id = item.id;
        itemElement.innerHTML = `
            <div class="receipt-item-details">
                ${item.details}
            </div>
            <div class="receipt-item-price">
                ${item.price}
            </div>
            <button class="remove-item" onclick="removeItem('${item.id}', '${tableNumber}')">×</button>
        `;
        receiptContent.appendChild(itemElement);
    });
    
    updateTotal();
}

function backtomenu(){
    let backToMenu = document.getElementById("backToMenu");
    if (currentTable) {
        backToMenu.href = `menu.html?table=${currentTable}`;
    } else {
        backToMenu.href = "menu.html"; // Fallback in case the table number is missing
    }
}
function backtomenuBottom(){
    let backToMenu = document.getElementById("backToMenuBottom");
    if (currentTable) {
        backToMenu.href = `menu.html?table=${currentTable}`;
    } else {
        backToMenu.href = "menu.html"; // Fallback in case the table number is missing
    }
}

