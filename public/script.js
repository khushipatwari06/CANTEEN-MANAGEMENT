document.addEventListener('DOMContentLoaded', function() {
    // Fetch all existing products from the database
    fetch('/api/products')
    .then(response => response.json())
    .then(products => {
        // Display each product as an icon in the menu
        const menu = document.getElementById('menu');
        products.forEach(product => {
            const productIcon = document.createElement('div');
            productIcon.classList.add('product-icon');
            productIcon.innerHTML = `
                <span>${product.name} (${product.quantity})</span>
                <div>
                    <span>Description: ${product.description}</span>
                    <button class="increase-btn" data-product-id="${product.id}">+</button>
                    <button class="decrease-btn" data-product-id="${product.id}">-</button>
                    <button class="edit-btn" data-product-id="${product.id}">Edit</button>
                </div>
            `;
            menu.appendChild(productIcon);
        });
    })
    .catch(error => console.error('Error fetching products:', error));

    // Event listener for quantity adjustment
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('increase-btn')) {
            // Handle increase button click
            const productId = event.target.dataset.productId;
            adjustQuantity(productId, 'increase');
        } else if (event.target.classList.contains('decrease-btn')) {
            // Handle decrease button click
            const productId = event.target.dataset.productId;
            adjustQuantity(productId, 'decrease');
        } else if (event.target.classList.contains('edit-btn')) {
            // Handle edit button click
            const productId = event.target.dataset.productId;
            openEditModal(productId);
        }
    });

    // Function to adjust product quantity
    function adjustQuantity(productId, action) {
        fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: action })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to adjust quantity');
            }
            // Refresh product icons after successful adjustment
            location.reload();
        })
        .catch(error => console.error('Error adjusting quantity:', error));
    }

    // Function to open the edit modal with product details
    function openEditModal(productId) {
        const modal = document.getElementById('myModal');
        const descriptionInput = document.getElementById('editDescription');
        const quantityInput = document.getElementById('editQuantity');

        // Fetch product details
        fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Populate modal fields with current product details
            descriptionInput.value = product.description;
            quantityInput.value = product.quantity;

            // Show the modal
            modal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching product details:', error));

        // Close the modal when the close button is clicked
        const closeBtn = document.querySelector('.close');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };

        // Handle form submission
        const editForm = document.getElementById('editForm');
        editForm.onsubmit = function(event) {
            event.preventDefault(); // Prevent default form submission

            // Get updated description and quantity values
            const updatedDescription = descriptionInput.value;
            const updatedQuantity = quantityInput.value;

            // Perform AJAX request to update product quantity in the database
            fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: updatedDescription, quantity: updatedQuantity })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update product');
                }
                // Close the modal after successful update
                modal.style.display = 'none';
                // Refresh product icons after successful update
                location.reload();
            })
            .catch(error => console.error('Error updating product:', error));
        };
    }
});
