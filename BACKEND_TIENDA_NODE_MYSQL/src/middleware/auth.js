// Middleware para verificar autenticación y autorización

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token o datos de usuario del header o sesión
    const userRole = req.headers["x-user-role"]
    const userId = req.headers["x-user-id"]
    const userName = req.headers["x-user-name"]

    if (!userId || !userRole) {
      return res.status(401).json({ message: "No autorizado. Token requerido" })
    }

    // Adjuntar datos del usuario a la solicitud
    req.user = {
      id: userId,
      role: userRole,
      name: userName,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: "Error de autenticación" })
  }
}

// Middleware para verificar que el usuario sea administrador
const authAdminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" })
  }

  if (req.user.role !== "administrador") {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores" })
  }

  next()
}

module.exports = {
  authMiddleware,
  authAdminMiddleware,
}
