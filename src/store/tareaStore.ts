import { create } from "zustand";
import type { ITarea } from "../types/ITarea";

interface ItareaStore{
    tareas: ITarea[];
    tareaActiva: ITarea | null;
    setTareaActiva: (tarea: ITarea | null) => void;
    setArrayTareas: (arrayDeTareas: ITarea[]) => void;
    agregarNuevaTarea: (nuevaTarea: ITarea) => void;
    editarUnaTarea: (tareaActualizada: ITarea) => void;
    eliminarUnaTarea: (id: string) => void;
}

export const tareaStore = create<ItareaStore>((set) => ({
    tareas: [],
    tareaActiva: null,

    // setear tarea activa
    setTareaActiva: (tareaActivaIn) => set(() => ({ tareaActiva: tareaActivaIn  })),

    // setear array de tareas
    setArrayTareas: (arrayDeTareas) => set(() =>({tareas : arrayDeTareas})),

    // agregar tarea al array
    agregarNuevaTarea: (nuevaTarea) => set((state) => ({tareas: [...state.tareas, nuevaTarea]  })),

    // editar tarea en el array
    editarUnaTarea: (tareaActualizada) => 
        set((state) => {
            const arregloTareas = state.tareas.map((tarea) => tarea.id === tareaActualizada.id ? {...tarea, ...tareaActualizada} : tarea);
            return { tareas: arregloTareas };
    }),

    // eliminar tarea del array
    eliminarUnaTarea: (id) => 
        set((state) => {
            const arregloTareas = state.tareas.filter((tarea) => tarea.id !== id);
            return { tareas: arregloTareas };
        })
}))