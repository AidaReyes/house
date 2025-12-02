export class User {
  constructor({ id, nombre, usuario, roles }) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.roles = roles;
  }

  static fromApi(apiResponse) {
    return new User({
      id: apiResponse._id,
      nombre: apiResponse.nombre,
      usuario: apiResponse.usuario,
      roles: apiResponse.roles
    });
  }
}
