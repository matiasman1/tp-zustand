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
            Swal.fire("Tarea creada", "La tarea fue creada con exito", "success");
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
            Swal.fire("Tarea editada", "La tarea fue editada con exito", "success");
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
        });
        if (!confirm.isConfirmed) return;
        eliminarUnaTarea(idTarea);
        try {
            await eliminarTareaPorId(idTarea);
            Swal.fire("Tarea eliminada", "La tarea fue eliminada con exito", "success");
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
