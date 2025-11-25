export class User {
  constructor({ id, nombre, usuario, rol, token, permisos }) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.rol = rol;
    this.token = token;
    this.permisos = permisos || [];
  }

  // Acepta el objeto `user` que devuelve la API (no un objeto anidado `user`)
  static fromApi(apiResponse, token) {
    if (!apiResponse) return null;

    return new User({
      id: apiResponse._id || apiResponse.id,
      nombre: apiResponse.nombre || apiResponse.nombreCompleto || apiResponse.name,
      usuario: apiResponse.usuario || apiResponse.username,
      rol: apiResponse.rol,
      permisos: apiResponse.permisos || apiResponse.roles || [],
      token: token || apiResponse.token,
    });
  }
}
