import { es } from "date-fns/locale";

export class User {
  constructor({ id, nombre, usuario, roles, estado }) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.roles = roles;
    this.estado = estado;
  }

  static fromApi(apiResponse) {
    return new User({
      id: apiResponse._id,
      nombre: apiResponse.nombre,
      usuario: apiResponse.usuario,
      roles: apiResponse.roles,
      estado: apiResponse.estado,
    });
  }
}
