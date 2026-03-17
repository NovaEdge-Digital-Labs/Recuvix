const { registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

const fontPath = path.join(__dirname, 'backend/public/fonts/Inter-Bold.ttf');
console.log('Testing font path:', fontPath);
console.log('File size:', fs.statSync(fontPath).size);

try {
    registerFont(fontPath, { family: 'Inter', weight: 'bold' });
    console.log('Font registered successfully!');
} catch (e) {
    console.error('Failed to register font:', e);
}
