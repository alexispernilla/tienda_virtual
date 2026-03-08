# 🛒 Sistema de Gestión de Tienda - Documentación

## ✅ Procesos Implementados

### **Proceso 1: Login y Registro con Roles (Admin/Vendedor)**

#### Endpoints de Autenticación:
- **POST /api/auth/login** - Login de usuario
- **POST /api/auth/register** - Registro de nuevo usuario

#### Características:
✅ Login con usuario y contraseña
✅ Registro de nuevos usuarios
✅ Dos roles: **Administrador** y **Vendedor**
✅ Almacenamiento seguro en localStorage
✅ Validaciones de contraseña (mínimo 6 caracteres)
✅ Confirmación de contraseña en registro

#### Credenciales de Prueba:
```
Admin:
  Usuario: admin
  Contraseña: admin12345
  
Vendedor:
  Usuario: vendedor
  Contraseña: vendedor123
```

#### Archivos:
- Backend: `src/controllers/authController.js`
- Backend: `src/routes/authRoutes.js`
- Frontend: `login.html`
- Frontend: `register.html`

---

### **Proceso 2: CRUD de Productos en el Dashboard**

#### Endpoints de Productos:
- **GET /api/productos** - Obtener todos los productos
- **GET /api/productos/:id** - Obtener producto por ID
- **GET /api/productos/search?q=término** - Buscar productos
- **POST /api/productos** - Crear producto
- **PUT /api/productos/:id** - Actualizar producto
- **DELETE /api/productos/:id** - Eliminar producto

#### Características del CRUD:
✅ **Crear**: Formulario modal para agregar nuevos productos
✅ **Leer**: Tabla con todos los productos
✅ **Actualizar**: Editar productos existentes
✅ **Eliminar**: Eliminar productos (restringido a Administradores)

#### Campos del Producto:
- **Nombre** (requerido)
- **Descripción** (opcional)
- **Precio** (requerido, decimal)
- **Stock** (requerido, entero positivo)
- **Imagen** (opcional, URL)

#### Validaciones:
- Solo usuarios autenticados pueden acceder
- Precio debe ser mayor a 0
- Stock no puede ser negativo
- Nombre es obligatorio

#### Archivos:
- Backend: `src/controllers/productosController.js`
- Backend: `src/routes/productosRoutes.js`
- Backend: `src/middleware/auth.js`
- Frontend: `dashboard.html`
- Frontend: `js/dashboard.js`

---

### **Proceso 3: Buscador de Productos y Restricción por Rol**

#### Buscador:
✅ Búsqueda en tiempo real por nombre o descripción
✅ Búsqueda case-insensitive
✅ Botón para limpiar búsqueda
✅ El servidor maneja la búsqueda con LIKE SQL

#### Restricciones por Rol:

| Acción | Administrador | Vendedor |
|--------|---------------|----------|
| Ver productos | ✅ | ✅ |
| Crear productos | ✅ | ✅ |
| Editar productos | ✅ | ✅ |
| Eliminar productos | ✅ | ❌ |
| Botón de eliminar | Visible | Deshabilitado |

#### Implementación:
- Middleware de autenticación valida el rol
- El endpoint DELETE verifica que solo administradores puedan eliminar
- El frontend oculta/deshabilita el botón de eliminar para vendedores

#### Archivos:
- Backend: `src/controllers/productosController.js` (línea: restricción en deleteProducto)
- Frontend: `js/dashboard.js` (línea: renderización condicional basada en rol)

---

## 🚀 Cómo Iniciar

### Backend:

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` con configuración:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_db
```

3. Inicializar base de datos:
```bash
npm run init-db
```

4. Iniciar servidor:
```bash
npm run dev  # (con nodemon para desarrollo)
# o
npm start    # (producción)
```

### Frontend:

1. Servir los archivos HTML (puede usar Live Server de VS Code)
2. Asegurarse que el backend esté corriendo en `http://localhost:3000`
3. Acceder a `login.html` en el navegador

---

## 📋 Flujo de Uso

### Para Usuarios Nuevos:
1. Ir a `register.html`
2. Llenar formulario de registro (usuario, rol, contraseña)
3. Hacer clic en "Crear Cuenta"
4. Ir automáticamente a `login.html`
5. Ingresar credenciales

### Para Usuarios Existentes:
1. Ir a `login.html`
2. Ingresar usuario y contraseña
3. Automáticamente se redirige a `dashboard.html`

### En el Dashboard:
1. **Crear Producto**: Botón "Nuevo Producto" → Llenar formulario → Guardar
2. **Ver Productos**: Se muestra tabla con todos
3. **Buscar**: Escribir en barra de búsqueda (busca en tiempo real)
4. **Editar**: Botón "Editar" en cada fila
5. **Eliminar**: Botón "Eliminar" (solo para Administradores)
6. **Logout**: Botón en esquina superior derecha

---

## 🔧 Configuración/Personalización

### Cambiar URL del API:
En `login.html`, `register.html` y `dashboard.html`:
```javascript
const API_URL = "http://localhost:3000/api";  // Cambiar aquí
```

### Estilo:
- Colores primarios: `#667eea` y `#764ba2`
- Puede editarse en las etiquetas `<style>` de cada HTML
- O importar un CSS externo

### Agregar más campos a productos:
1. Actualizar tabla `productos` en MySQL
2. Actualizar formulario en `dashboard.html`
3. Actualizar validaciones en `productosController.js`

---

## 🔐 Seguridad

⚠️ **IMPORTANTE - Para Producción:**
- Las contraseñas NO se hashean. Usar bcrypt en producción
- Usar HTTPS solamente
- Implementar JWT tokens en lugar de headers simples
- Usar CORS restrictivo
- Añadir rate limiting
- Validar y sanitizar todas las entradas

---

## 📝 Estructura de la Base de Datos

```sql
-- Tabla de Usuarios/Roles
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rol VARCHAR(50),
  usuario VARCHAR(50) UNIQUE,
  contrasena VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Tabla de Productos
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  descripcion VARCHAR(255),
  precio DECIMAL(10, 2),
  stock INT DEFAULT 0,
  imagen VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre)
)
```

---

## ⚠️ Posibles Errores y Soluciones

### "Error de conexión. Verifica que el servidor esté activo"
**Causa**: Backend no está corriendo  
**Solución**: Ejecutar `npm run dev` en la carpeta del backend

### "Credenciales incorrectas"
**Causa**: Usuario o contraseña incorrectos  
**Solución**: Usar credenciales de prueba (admin/admin12345 o vendedor/vendedor123)

### "Acceso denegado"
**Causa**: Headers de autenticación no se envían correctamente  
**Solución**: Verificar que el navegador esté obteniendo el usuario de localStorage

### Tabla vacía pero sin mensaje
**Causa**: JavaScript no está cargando  
**Solución**: Verificar consola del navegador (F12) para errores

---

## 📞 Soporte

Para reportar bugs o sugerencias, revisar los archivos:
- `docs/ESTRUCTURA.md`
- `docs/QUICK-START.md`
- `docs/REFACTORING.md`

---

## ✨ Características Adicionales Implementadas

✅ Indicador visual del nivel de stock (bajo/medio/alto)
✅ Formulario modal reutilizable para crear/editar
✅ Búsqueda en tiempo real con debounce
✅ Validaciones del lado del cliente y servidor
✅ Alertas visuales de éxito/error
✅ Interfaz responsive
✅ Indicador del rol del usuario en navbar
✅ Botones deshabilitados para acciones no permitidas
✅ Imágenes de productos con placeholder
✅ Formatos de moneda localizados

---

**Sistema desarrollado para CESDE 3 SEMESTRE**  
**Última actualización: Marzo 2026**
