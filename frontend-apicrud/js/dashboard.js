const API_URL = "http://localhost:3000/api";

let currentProductId = null;
let allProducts = [];
let userRole = "";

// Obtener datos del usuario del localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        window.location.href = "login.html";
        return null;
    }
    return JSON.parse(userStr);
}

// Inicializar el dashboard
function initDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    userRole = user.rol;
    document.getElementById("userName").textContent = user.usuario;
    document.getElementById("userRole").textContent = userRole === "administrador" ? "👑 Administrador" : "💼 Vendedor";

    loadProducts();

    // Event listeners
    document.getElementById("searchInput").addEventListener("input", debounce(searchProducts, 500));
    document.getElementById("productForm").addEventListener("submit", (e) => {
        e.preventDefault();
        // El formulario se maneja mediante el botón Guardar
    });

    // Reset del modal cuando se cierra
    document.getElementById("productModal").addEventListener("hidden.bs.modal", resetForm);
}

// Obtener headers de autenticación
function getAuthHeaders() {
    const user = getCurrentUser();
    if (!user) return {};

    return {
        "Content-Type": "application/json",
        "x-user-id": user.id,
        "x-user-role": user.rol,
        "x-user-name": user.usuario,
    };
}

// Cargar todos los productos
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/productos`, {
            headers: getAuthHeaders(),
        });

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) throw new Error("Error al cargar productos");

        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error:", error);
        showAlert("Error al cargar productos", "error");
    }
}

// Buscar productos
async function searchProducts() {
    const searchTerm = document.getElementById("searchInput").value.trim();

    if (!searchTerm) {
        renderProducts(allProducts);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos/search?q=${encodeURIComponent(searchTerm)}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Error en la búsqueda");

        const results = await response.json();
        renderProducts(results);
    } catch (error) {
        console.error("Error:", error);
        showAlert("Error en la búsqueda", "error");
    }
}

// Limpiar búsqueda
function resetSearch() {
    document.getElementById("searchInput").value = "";
    renderProducts(allProducts);
}

// Renderizar productos en la tabla
function renderProducts(products) {
    const tableBody = document.getElementById("productsTableBody");
    const emptyState = document.getElementById("emptyState");

    if (products.length === 0) {
        tableBody.innerHTML = "";
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    tableBody.innerHTML = products
        .map((product) => {
            let stockClass = "low";
            if (product.stock >= 20) stockClass = "high";
            else if (product.stock >= 10) stockClass = "medium";

            const imageSrc = product.imagen && product.imagen.trim() ? product.imagen : "https://via.placeholder.com/50";

            return `
                <tr>
                    <td>
                        <img src="${imageSrc}" alt="${product.nombre}" class="product-image" onerror="this.src='https://via.placeholder.com/50'">
                    </td>
                    <td><strong>${product.nombre}</strong></td>
                    <td>${product.descripcion || "—"}</td>
                    <td class="price">$${parseFloat(product.precio).toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</td>
                    <td>
                        <span class="stock ${stockClass}">${product.stock} unidades</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="editProduct(${product.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            ${userRole === "administrador"
                                ? `<button class="btn-delete" onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>`
                                : `<button class="btn-delete" disabled title="Solo administradores pueden eliminar">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>`
                            }
                        </div>
                    </td>
                </tr>
            `;
        })
        .join("");
}

// Abre el modal para editar
async function editProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/productos/${productId}`, {
            headers: getAuthHeaders(),
        });

        const product = await response.json();

        // Llenar el formulario
        document.getElementById("productName").value = product.nombre;
        document.getElementById("productDescription").value = product.descripcion || "";
        document.getElementById("productPrice").value = product.precio;
        document.getElementById("productStock").value = product.stock;
        document.getElementById("productImage").value = product.imagen || "";

        currentProductId = productId;
        document.getElementById("modalTitle").textContent = "Editar Producto";

        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        modal.show();
    } catch (error) {
        console.error("Error:", error);
        showAlert("Error al cargar el producto", "error");
    }
}

// Guardar producto (crear o actualizar)
async function saveProduct() {
    const nombre = document.getElementById("productName").value.trim();
    const descripcion = document.getElementById("productDescription").value.trim();
    const precio = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);
    const imagen = document.getElementById("productImage").value.trim();

    // Validaciones
    if (!nombre) {
        showAlert("El nombre del producto es requerido", "error");
        return;
    }

    if (precio <= 0) {
        showAlert("El precio debe ser mayor a 0", "error");
        return;
    }

    if (stock < 0) {
        showAlert("El stock no puede ser negativo", "error");
        return;
    }

    const productData = {
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
    };

    try {
        const url = currentProductId ? `${API_URL}/productos/${currentProductId}` : `${API_URL}/productos`;
        const method = currentProductId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error("Error al guardar producto");

        const data = await response.json();
        showAlert(
            currentProductId ? "Producto actualizado exitosamente" : "Producto creado exitosamente",
            "success"
        );

        // Cerrar modal y recargar productos
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
        resetForm();
        loadProducts();
    } catch (error) {
        console.error("Error:", error);
        showAlert("Error al guardar el producto", "error");
    }
}

// Eliminar producto
async function deleteProduct(productId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
        const response = await fetch(`${API_URL}/productos/${productId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (response.status === 403) {
            showAlert("No tienes permiso para eliminar productos", "error");
            return;
        }

        if (!response.ok) throw new Error("Error al eliminar producto");

        showAlert("Producto eliminado exitosamente", "success");
        loadProducts(); // Recargar lista
    } catch (error) {
        console.error("Error:", error);
        showAlert("Error al eliminar el producto", "error");
    }
}

// Resetear el formulario
function resetForm() {
    document.getElementById("productForm").reset();
    currentProductId = null;
    document.getElementById("modalTitle").textContent = "Nuevo Producto";
}

// Mostrar alertas
function showAlert(message, type) {
    const alertContainer = document.getElementById("alertContainer");
    const alertClass = type === "error" ? "alert-error" : "alert-success";
    const alertHTML = `<div class="alert ${alertClass}" role="alert">${message}</div>`;
    alertContainer.innerHTML = alertHTML;

    // Auto-desaparecer después de 5 segundos
    setTimeout(() => {
        alertContainer.innerHTML = "";
    }, 5000);
}

// Logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// Debounce para búsqueda
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Inicializar cuando carg la página
window.addEventListener("load", initDashboard);
