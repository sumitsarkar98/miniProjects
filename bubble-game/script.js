let bubblesContainer = document.getElementById('bubbles-container');

for (let i = 0; i <= 88; i++) {
    // Create a div element
    let child = document.createElement('div');
    
    // Set the class and id
    child.className = 'bubbles';
    child.id = `bubble-${i}`;
    
    // Set the inner content
    child.textContent =  Math.floor(Math.random() * 100) + 1;
    
    // Append the child to the container
    bubblesContainer.appendChild(child);
}
