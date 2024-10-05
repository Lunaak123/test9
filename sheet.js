let data = []; // This will hold your Excel data

// Function to populate the primary column dropdown based on Excel data
function populatePrimaryColumnDropdown() {
    const primaryColumnSelect = document.getElementById('primary-column');
    
    // Assuming the first row contains column headers
    const columnNames = Object.keys(data[0]);
    
    columnNames.forEach(col => {
        const option = document.createElement('option');
        option.value = col;
        option.textContent = col;
        primaryColumnSelect.appendChild(option);
    });
}

// When the user submits the number of columns
document.getElementById('submit-column-count').addEventListener('click', () => {
    const columnCount = parseInt(document.getElementById('column-count').value);
    if (!columnCount || columnCount < 1) {
        alert("Please enter a valid number of columns.");
        return;
    }

    // Show the column selection panel
    document.getElementById('column-selection').style.display = 'block';

    // Generate available columns
    const availableColumnsDiv = document.getElementById('available-columns');
    availableColumnsDiv.innerHTML = '';

    // Sample column names for selection (A, B, C)
    const columnNames = Object.keys(data[0]); // Dynamically get column names

    columnNames.forEach((col) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = col;
        checkbox.id = `col-${col}`;
        
        const label = document.createElement('label');
        label.htmlFor = `col-${col}`;
        label.innerText = col;

        availableColumnsDiv.appendChild(checkbox);
        availableColumnsDiv.appendChild(label);
        availableColumnsDiv.appendChild(document.createElement('br'));
    });

    // Populate the primary column dropdown
    populatePrimaryColumnDropdown();
});

// When the user processes the selected columns
document.getElementById('process-columns').addEventListener('click', () => {
    const selectedColumns = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    if (selectedColumns.length === 0) {
        alert("Please select at least one column.");
        return;
    }

    // Show the null check options
    document.getElementById('null-check-panel').style.display = 'block';

    const nullOptionsDiv = document.getElementById('null-options');
    nullOptionsDiv.innerHTML = ''; // Clear previous options

    selectedColumns.forEach((col) => {
        const optionDiv = document.createElement('div');
        optionDiv.innerHTML = `
            <span>Check for Null/Not Null in Column ${col}:</span>
            <input type="radio" name="null-check-${col}" value="null"> Null
            <input type="radio" name="null-check-${col}" value="not-null"> Not Null
        `;
        nullOptionsDiv.appendChild(optionDiv);
    });
});

// When the user checks for null values
document.getElementById('check-null').addEventListener('click', () => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    const selectedColumns = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    
    selectedColumns.forEach((col) => {
        const selectedOption = document.querySelector(`input[name="null-check-${col}"]:checked`);
        
        if (!selectedOption) {
            alert(`Please select an option for column ${col}.`);
            return;
        }
        
        const checkType = selectedOption.value;
        const colData = data.map(row => row[col]).filter(item => item !== undefined);

        let result;
        if (checkType === 'null') {
            result = colData.filter(item => item === null);
        } else {
            result = colData.filter(item => item !== null);
        }

        resultsDiv.innerHTML += `<p>Column ${col}: ${checkType} values count: ${result.length}</p>`;
    });
});

// Example of populating the sheet content dynamically (using mock data)
function displaySheet() {
    const sheetContentDiv = document.getElementById('sheet-content');
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
            td.textContent = cell === null ? 'NULL' : cell; // Display NULL for null values
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    sheetContentDiv.appendChild(table);
}

// Call displaySheet to show data initially
displaySheet();
