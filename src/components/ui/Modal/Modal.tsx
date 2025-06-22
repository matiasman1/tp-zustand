import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import { tareaStore } from '../../../store/tareaStore';
import styles from './Modal.module.css';
import type { ITarea } from '../../../types/ITarea';
import { useTareas } from '../../../hooks/useTareas';

type IModal = {
    handleCloseModal: VoidFunction;
};

const initialState: ITarea= {
    titulo: "",
    descripcion: "",
    fechaLimite: "",
}

export const Modal :FC<IModal> = ({handleCloseModal}) => {
    const tareaActiva = tareaStore((state) => state.tareaActiva);
    const setTareaActiva = tareaStore((state) => state.setTareaActiva);

    const [formValues, setFormValues] = useState<ITarea>(initialState);

    const {crearTarea, putTareaEditar} = useTareas();

    useEffect(() => {
        if (tareaActiva) setFormValues(tareaActiva);
     },[]);
     
     
     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;   
        setFormValues((prev) => ({ ...prev, [`${name}`]: value }));
    }

    const handleSumbit = (e: FormEvent) => {
        e.preventDefault();
        if (tareaActiva) {
            putTareaEditar(formValues);
        }else {
            crearTarea({...formValues, id: crypto.randomUUID()});
        }

        setTareaActiva(null);
        handleCloseModal();
    }

  return (
    <div className={styles.containerPrincipalModal}>
        <div className={styles.contentPopUp}>
            <div className={styles.modalHeader}>
                <h3>{tareaActiva ? "Editar Tarea" : "Crear Tarea"}</h3>
            </div>

            <form onSubmit={handleSumbit} className={styles.formContent}>
                <div className={styles.inputGroup}>
                    <input placeholder="Ingrese un titulo" type="text" required value={formValues.titulo} autoComplete='off' name='titulo' onChange={handleChange}/>
                    <textarea placeholder="Ingrese una descripcion" name="descripcion" required value={formValues.descripcion} autoComplete='off' onChange={handleChange}></textarea>
                    <input type="date" required autoComplete='off' name='fechaLimite' value={formValues.fechaLimite} onChange={handleChange} />
                </div>

                <div className={styles.buttonCards}>
                    <button className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
                    <button className={styles.actionButton} type="submit">
                        {tareaActiva ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}
