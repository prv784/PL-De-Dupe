class DedupeLogic {
    // Remove duplicates and preserve order
    static removeDuplicates(data) {
        const seen = new Set();
        const uniqueData = [];
        const duplicates = [];
        
        data.forEach(item => {
            if (!seen.has(item)) {
                seen.add(item);
                uniqueData.push(item);
            } else {
                duplicates.push(item);
            }
        });
        
        return {
            uniqueData,
            duplicateCount: duplicates.length,
            duplicates
        };
    }

    // Count frequency of each PL number
    static countFrequency(data) {
        const frequency = {};
        data.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
        });
        return frequency;
    }

    // Find most common duplicates
    static findMostCommon(data, limit = 10) {
        const frequency = this.countFrequency(data);
        return Object.entries(frequency)
            .filter(([_, count]) => count > 1)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([number, count]) => ({ number, count }));
    }

    // Validate PL numbers (basic validation)
    static validatePLNumbers(data) {
        const invalid = [];
        const valid = [];
        
        data.forEach(item => {
            if (typeof item === 'string' && item.trim().length > 0) {
                valid.push(item.trim());
            } else {
                invalid.push(item);
            }
        });
        
        return {
            valid,
            invalid,
            invalidCount: invalid.length
        };
    }
}

module.exports = DedupeLogic;