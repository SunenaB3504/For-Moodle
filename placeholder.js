/**
 * Creates a dynamic placeholder image when actual images are missing
 */
function createPlaceholder(width, height, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width || 300;
    canvas.height = height || 200;
    
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || 'Image not available', canvas.width/2, canvas.height/2);
    
    // Add border
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/png');
}

// Replace missing images with placeholders
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = createPlaceholder(this.width, this.height, this.alt || 'Image not available');
            this.onerror = null; // Prevent infinite loop
        };
    });
});
