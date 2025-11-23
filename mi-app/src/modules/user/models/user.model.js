export class User {
  constructor({ id, nombre, usuario, rol }) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.rol = rol;
  }

  static fromApi(apiResponse) {
    return new User({
      id: apiResponse._id,
      nombre: apiResponse.nombre,
      usuario: apiResponse.usuario,
      rol: apiResponse.rol
    });
  }
}
