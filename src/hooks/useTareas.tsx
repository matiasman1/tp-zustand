import { useShallow } from "zustand/shallow"
import { tareaStore } from "../store/tareaStore";
import { editarTareas, eliminarTareaPorId, getAllTareas, postNuevaTareas } from "../http/tareas";
import type { ITarea } from "../types/ITarea";
import Swal from "sweetalert2";

export const useTareas = () => {
    const {tareas, setArrayTareas, agregarNuevaTarea, eliminarUnaTarea, editarUnaTarea} = tareaStore(useShallow((state)=> ({
        tareas: state.tareas,
        setArrayTareas: state.setArrayTareas,
        agregarNuevaTarea: state.agregarNuevaTarea,
        eliminarUnaTarea: state.eliminarUnaTarea,
        editarUnaTarea: state.editarUnaTarea,
    })));

    const getTareas = async () => { 
        const data = await getAllTareas();
        if (data) setArrayTareas(data);
    }
    
    const crearTarea = async (nuevaTarea: ITarea) => {
        agregarNuevaTarea(nuevaTarea);
        try {
            await postNuevaTareas(nuevaTarea);
            Swal.fire({
                title: "Tarea creada",
                text: "La tarea fue creada con exito",
                icon: "success",
                background: '#383838',
                color: '#FFFFFF',
                confirmButtonColor: '#E95420',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            eliminarUnaTarea(nuevaTarea.id!);
            console.error("Error creando tarea:", error);
        }
    }

    const putTareaEditar = async (tareaEditada: ITarea) => {
        const estadoPrevio = tareas.find((tarea) => tarea.id === tareaEditada.id);
        editarUnaTarea(tareaEditada);
        try {
            await editarTareas(tareaEditada);
            Swal.fire({
                title: "Tarea editada",
                text: "La tarea fue editada con exito",
                icon: "success",
                background: '#383838',
                color: '#FFFFFF',
                confirmButtonColor: '#E95420',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            if (estadoPrevio) editarUnaTarea(estadoPrevio);
            console.error("Error editando tarea:", error);
        }
    }
    
    const eliminarTarea = async (idTarea: string) => {
        const estadoPrevio = tareas.find((tarea) => tarea.id === idTarea);
        const confirm = await Swal.fire({
            title: "¿Estas seguro?",
            text: "No podras revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
            background: '#383838',
            color: '#FFFFFF',
            confirmButtonColor: '#E01B24',
            cancelButtonColor: '#6C6C6C'
        });
        if (!confirm.isConfirmed) return;
        eliminarUnaTarea(idTarea);
        try {
            await eliminarTareaPorId(idTarea);
            Swal.fire({
                title: "Tarea eliminada",
                text: "La tarea fue eliminada con exito",
                icon: "success",
                background: '#383838',
                color: '#FFFFFF',
                confirmButtonColor: '#E95420',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
            console.error("Error eliminando tarea:", error);
        }
    }

  return {
    tareas,
    getTareas,
    crearTarea,
    putTareaEditar,
    eliminarTarea,
  }
}
