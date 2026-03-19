import { useState, useMemo, useEffect } from "react";

const TableWrapper = ({
    data = [],
    renderRow,
    headers = [],
    searchable = true
}) => {

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const itemsPerPage = 2;

    // 🔍 FILTRO GLOBAL
    const filteredData = useMemo(() => {

        if (!query) return data;

        const q = query.toLowerCase();

        return data.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(q)
        );

    }, [data, query]);

    // 🔁 RESET PAGE cuando buscas
    useEffect(() => {
        setPage(1);
    }, [query]);

    // 📄 PAGINACIÓN
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, page]);

    return (

        <div className="table-wrapper">
            <div className="actions">

                {searchable && (
                    <div className="search">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Buscar..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <div className="table-container">

                <table >

                    <thead>
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i}>{h}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length}>
                                    Sin resultados
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map(renderRow)
                        )}
                    </tbody>

                </table>

            </div>

            <div className="actions">

                <button className="btn btn-danger btn-sm" onClick={() => setPage(p => Math.max(p - 1, 1))}>
                    Anterior
                </button>

                <span>
                    {page} / {totalPages || 1}
                </span>

                <button className="btn btn-danger btn-sm" onClick={() => setPage(p => Math.min(p + 1, totalPages))}>
                    Siguiente
                </button>

            </div>

        </div>
    );
};

export default TableWrapper;