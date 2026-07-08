const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to update a single file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Add import if not already present
    if (content.includes('10.0.2.2:5000') && !content.includes('API_BASE_URL')) {
      const importMatch = content.match(/import.*from.*['"]\.\.\/\.\.\/context\/UserContext['"]/);
      if (importMatch) {
        content = content.replace(
          importMatch[0],
          importMatch[0] + '\nimport { API_BASE_URL } from \'../../config/api\';'
        );
        updated = true;
      }
    }
    
    // Replace hardcoded URLs
    if (content.includes('10.0.2.2:5000')) {
      content = content.replace(/http:\/\/10\.0\.2\.2:5000/g, '${API_BASE_URL}');
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Main execution
console.log('Updating API URLs in project files...');

const projectRoot = path.join(__dirname, '..');
const files = findFiles(projectRoot);

files.forEach(file => {
  if (file.includes('10.0.2.2:5000')) {
    updateFile(file);
  }
});

console.log('Done! Please review the changes and test your app.');
console.log('\nImportant notes:');
console.log('1. For iOS simulator: localhost:5000 should work');
console.log('2. For physical iOS device: you need to use your computer\'s local IP (e.g., 192.168.1.xxx:5000)');
console.log('3. Update the config/api.ts file with your computer\'s actual IP if using physical device');
console.log('4. Make sure your backend is accessible from the device\'s network');
