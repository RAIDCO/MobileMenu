function checkTableOccupancy() {
    // Retrieve tables data from localStorage
    const tablesData = JSON.parse(localStorage.getItem('tablesData') || '{}');
    
    // Get all table elements
    const tables = document.querySelectorAll('.table');
    
    tables.forEach(table => {
        // Extract table number from the href or data attribute
        const tableNumber = table.getAttribute('data-table') || 
                            table.getAttribute('href').split('=')[1];
        
        // Check if this table has items in its cart
        const isOccupied = tablesData[tableNumber] && 
                           tablesData[tableNumber].length > 0;
        
        // Update table appearance based on occupancy
        if (isOccupied) {
            table.classList.add('occupied');
            table.style.backgroundColor = '#FFB6C1';  // Light red
            table.style.borderColor = '#FF4500';      // Darker red border
        } else {
            table.classList.remove('occupied');
            table.style.backgroundColor = '';
            table.style.borderColor = '';
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkTableOccupancy);

// Optional: Add event listeners to update occupancy status 
// after certain actions like adding/removing items or processing payment
document.addEventListener('cartUpdated', checkTableOccupancy);