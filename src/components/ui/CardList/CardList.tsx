import {type FC } from 'react';
import type { ITarea } from '../../../types/ITarea';
import styles from './CardList.module.css';
import { useTareas } from '../../../hooks/useTareas';

type ICardList = {
    tarea: ITarea
    handleOpenModalEdit: (tarea: ITarea) => void;
}

export const CardList: FC<ICardList>= ({tarea, handleOpenModalEdit}) => {

    const {eliminarTarea} = useTareas();

    const eliminarTareaById = () => {
        eliminarTarea(tarea.id!);
    }

    const editarTarea = () => {
        handleOpenModalEdit(tarea);
    }


  return (
    <div className={styles.containerCardList}>
        <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>Titulo: {tarea.titulo}</h3>
            <p className={styles.cardDescription}>Descripción: {tarea.descripcion}</p>
            <p className={styles.cardDate}><b>Fecha limite: {tarea.fechaLimite}</b></p>
        </div>

        <div className={styles.actionCard}>
            <button className={styles.deleteButton} onClick={eliminarTareaById}>Eliminar</button>
            <button className={styles.editButton} onClick={editarTarea}>Editar</button>
        </div>
        
    </div>
  )
}
