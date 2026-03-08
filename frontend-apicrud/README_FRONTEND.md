# 🚀 Inicio Rápido - Frontend

## ¿Qué ha cambiado?

Este frontend ahora incluye:

### ✅ Autenticación Completa
- `login.html` - Página de inicio de sesión mejorada
- `register.html` - Registro de nuevos usuarios con selección de rol
- Almacenamiento seguro de datos en localStorage

### ✅ Dashboard de Gestión
- `dashboard.html` - Panel principal después del login
- `js/dashboard.js` - Lógica de CRUD de productos

### ✅ Funcionalidades
1. **Login/Registro** - Dos roles: Admin y Vendedor
2. **CRUD Productos** - Crear, leer, actualizar, eliminar
3. **Búsqueda** - Búsqueda en tiempo real de productos
4. **Restricciones** - Vendedores no pueden eliminar productos

---

## 📖 Cómo Acceder

### Página de Login
Abre en tu navegador:
```
login.html
```

### Credenciales de Prueba

**Usuario Administrador:**
- Usuario: `admin`
- Contraseña: `admin12345`
- Permisos: Todo (crear, editar, eliminar productos)

**Usuario Vendedor:**
- Usuario: `vendedor`
- Contraseña: `vendedor123`
- Permisos: crear y editar productos (NO puede eliminar)

---

## 🔄 Flujo de Uso

```
Login/Register → Dashboard → Gestionar Productos → Logout
```

### En el Dashboard:
- **Tabla de Productos**: Ver todos los productos con precios, stock, etc.
- **Buscador**: Escribe el nombre del producto para buscar en tiempo real
- **Nuevo Producto**: Clic en botón azul para crear producto
- **Editar**: Clic en botón amarillo "Editar" en cada fila
- **Eliminar**: Clic en botón rojo "Eliminar" (solo Administrador)
- **Salir**: Botón en arriba a la derecha

---

## ⚙️ Configuración

### URL del Backend

Si tu backend NO está en `http://localhost:3000`, edita:

1. `login.html` - Busca la línea:
```javascript
const API_URL = "http://localhost:3000/api";
```

2. `register.html` - Misma línea

3. `js/dashboard.js` - Misma línea

Cambia `http://localhost:3000` por tu URL real.

---

## 🛠️ Archivo Importante

`js/dashboard.js` contiene:
- Carga de productos
- Búsqueda
- Crear/Editar/Eliminar
- Validaciones
- Autenticación

No borres este archivo, es esencial para que funcione.

---

## 💡 Tips

- Si ves botón "Eliminar" gris/deshabilitado, es porque eres Vendedor
- Las búsquedas se hacen automáticamente al escribir
- Los precios se dan formato automáticamente (ej: $1.234,56)
- El stock se muestra con colores: Rojo (bajo), Naranja (medio), Verde (alto)
- Las imágenes de productos muestran un placeholder si la URL no es válida

---

## ❌ Si Algo Falla

1. **Abre la Consola del Navegador** (F12)
2. **Revisa los errores** (pestaña Console)
3. **Verifica**:
   - ✅ Backend está corriendo (`npm run dev`)
   - ✅ URL del API es correcta
   - ✅ Tienes internet (CORS puede bloquearte)
   - ✅ No hay typos en los datos del formulario

---

**¡Listo para empezar! 🎉**
