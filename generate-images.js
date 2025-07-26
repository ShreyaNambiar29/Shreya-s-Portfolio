// This is a placeholder image generator for the portfolio
// In a real project, you would replace these with actual project screenshots

const fs = require('fs');
const { createCanvas } = require('canvas');

// Create placeholder images for projects
const projectImages = [
    { name: 'project1.jpg', title: 'E-Commerce Website', color: '#ff6b6b' },
    { name: 'project2.jpg', title: 'Task Management App', color: '#4ecdc4' },
    { name: 'project3.jpg', title: 'Weather Forecast App', color: '#45b7d1' },
    { name: 'project4.jpg', title: 'Student Management System', color: '#f9ca24' },
    { name: 'project5.jpg', title: 'Algorithm Visualizer', color: '#6c5ce7' },
    { name: 'project6.jpg', title: 'Personal Portfolio', color: '#a29bfe' }
];

function createProjectImage(name, title, color) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustBrightness(color, -20));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add some geometric shapes for visual interest
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(700, 100, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(100, 500, 100, 0, Math.PI * 2);
    ctx.fill();

    // Title text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 400, 300);

    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillText('Project Screenshot', 400, 350);

    // Save the image
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(name, buffer);
}

// Helper function to adjust color brightness
function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const B = (num >> 8 & 0x00FF) + amt;
    const G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}

// Generate all project images
projectImages.forEach(({ name, title, color }) => {
    console.log(`Creating ${name}...`);
    createProjectImage(name, title, color);
});

console.log('All project images created successfully!');
