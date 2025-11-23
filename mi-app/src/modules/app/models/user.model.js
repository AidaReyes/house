export class User {
  constructor({ id, nombre, usuario, rol, token }) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.rol = rol;
    this.token = token;
  }

  static fromApi(apiResponse) {
    return new User({
      id: apiResponse.user.id,
      nombre: apiResponse.user.nombre,
      usuario: apiResponse.user.usuario,
      rol: apiResponse.user.rol,
      token: apiResponse.token,
    });
  }
}
