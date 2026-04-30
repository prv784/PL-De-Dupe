const XLSX = require('xlsx');

class FileParser {
    // Parse CSV file
    static parseCSV(content) {
        const lines = content.trim().split('\n');
        const data = [];
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                // Simple CSV parsing - split by comma
                const values = trimmedLine.split(',').map(v => v.trim());
                data.push(...values.filter(v => v !== ''));
            }
        });
        
        return data;
    }

    // Parse Excel file
    static parseExcel(buffer) {
        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            const data = [];
            jsonData.forEach(row => {
                if (Array.isArray(row)) {
                    row.forEach(cell => {
                        if (cell !== null && cell !== undefined && cell.toString().trim() !== '') {
                            data.push(cell.toString().trim());
                        }
                    });
                }
            });
            
            return data;
        } catch (error) {
            throw new Error('Error parsing Excel file: ' + error.message);
        }
    }

    // Parse JSON file
    static parseJSON(content) {
        try {
            const parsed = JSON.parse(content);
            const data = [];
            
            const extractValues = (obj) => {
                if (Array.isArray(obj)) {
                    obj.forEach(item => {
                        if (typeof item === 'string' && item.trim()) {
                            data.push(item.trim());
                        } else if (typeof item === 'number') {
                            data.push(item.toString());
                        } else if (typeof item === 'object' && item !== null) {
                            extractValues(item);
                        }
                    });
                } else if (typeof obj === 'object' && obj !== null) {
                    Object.values(obj).forEach(value => {
                        if (typeof value === 'string' && value.trim()) {
                            data.push(value.trim());
                        } else if (typeof value === 'number') {
                            data.push(value.toString());
                        } else if (Array.isArray(value) || typeof value === 'object') {
                            extractValues(value);
                        }
                    });
                }
            };
            
            extractValues(parsed);
            return data;
        } catch (error) {
            throw new Error('Invalid JSON format');
        }
    }

    // Parse manual input
    static parseManualInput(text) {
        const lines = text.split('\n');
        const data = [];
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
                data.push(trimmed);
            }
        });
        
        return data;
    }
}

module.exports = FileParser;