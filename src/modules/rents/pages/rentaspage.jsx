import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSearch } from "../../product/hooks/useSearch";
import { rentService } from "../service/rents.service";
import Can from "../../../components/can";

export default function RentasPage() {
    const [rentas, setRentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipoVista, setTipoVista] = useState("solicitante");
    const [statusFiltro, setStatusFiltro] = useState("");

    const {
        query,
        filteredItems: rentasFiltradas,
        onChange: onSearchChange,
        clear: clearSearch,
    } = useSearch(rentas || [], (r, q) => {
        const queryLower = q.toLowerCase();

        const usuario = String(r.usuario?.nombre ?? "").toLowerCase();
        const cuarto = String(r.cuarto?.titulo ?? "").toLowerCase();
        const propietario = String(
            r.cuarto?.propietario?.nombre ?? ""
        ).toLowerCase();
        const status = String(r.status ?? "").toLowerCase();
        const inicio = String(r.fechainicio ?? "").toLowerCase();
        const fin = String(r.fechafin ?? "").toLowerCase();

        return (
            usuario.includes(queryLower) ||
            cuarto.includes(queryLower) ||
            propietario.includes(queryLower) ||
            status.includes(queryLower) ||
            inicio.includes(queryLower) ||
            fin.includes(queryLower)
        );
    });

    const cargarRentas = async () => {
        try {
            setLoading(true);
            const data = await rentService.getAll({
                tipo: tipoVista,
                status: statusFiltro,
            });
            setRentas(data);
        } catch (error) {
            console.error("Error cargando rentas:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar las rentas",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarRentas();
    }, [tipoVista, statusFiltro]);

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                icon: "warning",
                title: "¿Eliminar renta?",
                text: "Esta acción no se puede deshacer",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (!result.isConfirmed) return;

            await rentService.delete(id);

            Swal.fire({
                icon: "success",
                title: "Eliminada",
                text: "La renta fue eliminada correctamente",
            });

            cargarRentas();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "No se pudo eliminar",
            });
        }
    };

    const handleCambiarStatus = async (id, nuevoStatus) => {
        try {
            await rentService.update(id, { status: nuevoStatus });

            Swal.fire({
                icon: "success",
                title: "Actualizado",
                text: `Estado cambiado a "${nuevoStatus}"`,
            });

            cargarRentas();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo actualizar el estado",
            });
        }
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case "pendiente":
                return "bg-warning text-dark";
            case "aprobada":
                return "bg-info text-dark";
            case "rechazada":
                return "bg-danger";
            case "activa":
                return "bg-success";
            case "finalizada":
                return "bg-secondary";
            case "cancelada":
                return "bg-dark";
            default:
                return "bg-secondary";
        }
    };

    return (
        <div className="rentas-page container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Rentas</h2>
            </div>

            <div className="d-flex gap-2 mb-3">
                <button
                    className={`btn ${tipoVista === "solicitante"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                    onClick={() => setTipoVista("solicitante")}
                >
                    Mis solicitudes
                </button>
                <Can permiso="RENT_READ">

                    <button
                        className={`btn ${tipoVista === "propietario"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                        onClick={() => setTipoVista("propietario")}
                    >
                        Mis cuartos
                    </button>
                </Can>
            </div>

            <div className="row g-2 mb-3">
                <div className="col-12 col-md-4">
                    <input
                        type="text"
                        placeholder="Buscar por solicitante, cuarto, propietario o estado..."
                        className="form-control"
                        value={query}
                        onChange={onSearchChange}
                    />
                </div>

                <div className="col-12 col-md-3">
                    <select
                        className="form-select"
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                        <option value="activa">Activa</option>
                        <option value="finalizada">Finalizada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>

                <div className="col-12 col-md-2">
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={clearSearch}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            ) : rentasFiltradas.length === 0 ? (
                <div className="alert alert-light text-center">
                    No hay rentas
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Solicitante</th>
                                <th>Cuarto</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rentasFiltradas.map((renta, index) => {
                                const rentaId = renta._id || renta.id;

                                return (
                                    <tr key={rentaId}>
                                        <td>{index + 1}</td>
                                        <td>{renta.usuario?.nombre || "—"}</td>
                                        <td>{renta.cuarto?.titulo || "—"}</td>

                                        <td>
                                            {renta.fechainicio
                                                ? new Date(renta.fechainicio).toLocaleDateString()
                                                : "—"}
                                        </td>

                                        <td>
                                            {renta.fechafin
                                                ? new Date(renta.fechafin).toLocaleDateString()
                                                : "—"}
                                        </td>

                                        <td>
                                            <span className={`badge ${getBadgeClass(renta.status)}`}>
                                                {renta.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {tipoVista === "propietario" &&
                                                    renta.status === "pendiente" && (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() =>
                                                                    handleCambiarStatus(rentaId, "aprobada")
                                                                }
                                                            >
                                                                Aprobar
                                                            </button>

                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleCambiarStatus(rentaId, "rechazada")
                                                                }
                                                            >
                                                                Rechazar
                                                            </button>
                                                        </>
                                                    )}

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(rentaId)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}