let data = []; // This will hold your Excel data

// Function to load and display the Excel data
async function loadExcelSheet(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assuming you're using the first sheet
        const sheet = workbook.Sheets[sheetName];
        
        // Convert sheet data to JSON
        data = XLSX.utils.sheet_to_json(sheet, { defval: null });
        
        // Now that the data is loaded, populate the primary column dropdown
        populatePrimaryColumnDropdown();
        
        // Display the sheet
        displaySheet();
        
    } catch (error) {
        console.error("Error loading Excel sheet:", error);
    }
}

// Function to populate the primary column dropdown based on Excel data
function populatePrimaryColumnDropdown() {
    const primaryColumnSelect = document.getElementById('primary-column');
    primaryColumnSelect.innerHTML = ''; // Clear any existing options

    if (data.length === 0) {
        alert("No data available to populate columns.");
        return;
    }

    // Assuming the first row contains column headers
    const columnNames = Object.keys(data[0]);

    columnNames.forEach(col => {
        const option = document.createElement('option');
        option.value = col;
        option.textContent = col;
        primaryColumnSelect.appendChild(option);
    });
}

// Function to display the Excel sheet as an HTML table
function displaySheet() {
    const sheetContentDiv = document.getElementById('sheet-content');
    sheetContentDiv.innerHTML = ''; // Clear any existing content

    if (data.length === 0) {
        sheetContentDiv.innerHTML = '<p>No data available</p>';
        return;
    }

    const table = document.createElement('table');

    // Create table headers
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell === null ? 'NULL' : cell; // Display 'NULL' for null values
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    sheetContentDiv.appendChild(table);
}

// Load the Excel sheet when the page is loaded (replace with your file URL)
window.addEventListener('load', () => {
    const fileUrl = getQueryParam('fileUrl'); // Assuming you get file URL from query params
    loadExcelSheet(fileUrl);
});
