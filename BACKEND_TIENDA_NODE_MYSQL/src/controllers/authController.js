const { getPool } = require("../database/connection")
const { handleError } = require("../utils/errorHandler")

// Login de usuario
const login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body

    if (!usuario || !contrasena) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" })
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    const [rows] = await connection.query("SELECT id, rol, usuario FROM roles WHERE usuario = ? AND contrasena = ?", [
      usuario,
      contrasena,
    ])
    connection.release()

    if (rows.length > 0) {
      const user = rows[0]
      res.status(200).json({
        success: true,
        message: "Login exitoso",
        user: {
          id: user.id,
          usuario: user.usuario,
          rol: user.rol,
        },
      })
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" })
    }
  } catch (error) {
    handleError(res, error, "Error al verificar el inicio de sesión")
  }
}

// Registro de usuario
const register = async (req, res) => {
  try {
    const { usuario, contrasena, confirmarContrasena, rol } = req.body

    // Validaciones
    if (!usuario || !contrasena || !confirmarContrasena) {
      return res.status(400).json({ message: "Usuario, contraseña y confirmación son requeridos" })
    }

    if (contrasena !== confirmarContrasena) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" })
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" })
    }

    const rolesValidos = ["administrador", "vendedor"]
    const userRol = rol && rolesValidos.includes(rol) ? rol : "vendedor"

    const pool = getPool()
    const connection = await pool.getConnection()

    // Verificar si el usuario ya existe
    const [existente] = await connection.query("SELECT id FROM roles WHERE usuario = ?", [usuario])

    if (existente.length > 0) {
      connection.release()
      return res.status(409).json({ message: "El usuario ya existe" })
    }

    // Crear usuario
    const [result] = await connection.query("INSERT INTO roles (rol, usuario, contrasena) VALUES (?, ?, ?)", [
      userRol,
      usuario,
      contrasena,
    ])

    connection.release()

    res.status(201).json({
      success: true,
      message: "Usuario registrado con éxito",
      userId: result.insertId,
      rol: userRol,
    })
  } catch (error) {
    handleError(res, error, "Error al registrar usuario")
  }
}

module.exports = {
  login,
  register,
}
