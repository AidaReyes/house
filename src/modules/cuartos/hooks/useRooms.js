import { useEffect, useState } from "react";

export const useRooms = () => {

    const [rooms, setRooms] = useState([]);

    // cargar datos guardados
    useEffect(() => {
        const savedRooms = localStorage.getItem("rooms");
        if (savedRooms) {
            setRooms(JSON.parse(savedRooms));
        }
    }, []);

    // guardar en localStorage
    useEffect(() => {
        localStorage.setItem("rooms", JSON.stringify(rooms));
    }, [rooms]);

    const createRoom = (room) => {
        const newRoom = {
            ...room,
            _id: Date.now()
        };

        setRooms(prev => [...prev, newRoom]);
    };

    const deleteRoom = (id) => {
        setRooms(prev => prev.filter(r => r._id !== id));
    };

    return {
        rooms,
        createRoom,
        deleteRoom
    };
};