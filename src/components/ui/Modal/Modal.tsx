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

    const terminalPrompt = "listatareas@ubuntu:~$ ";

    useEffect(() => {
        if (tareaActiva) {
            setFormValues({
                ...tareaActiva,
                titulo: terminalPrompt + tareaActiva.titulo,
                descripcion: terminalPrompt + tareaActiva.descripcion
            });
        } else {
            setFormValues({
                titulo: terminalPrompt,
                descripcion: terminalPrompt,
                fechaLimite: ""
            });
        }
     },[tareaActiva]);
     
     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'fechaLimite') {
            setFormValues((prev) => ({ ...prev, [name]: value }));
            return;
        }
        
        // Prevent deleting the terminal prompt
        if (value.length < terminalPrompt.length) {
            return;
        }
        
        // Ensure terminal prompt is always at the beginning
        if (!value.startsWith(terminalPrompt)) {
            setFormValues((prev) => ({ ...prev, [name]: terminalPrompt + value }));
            return;
        }
        
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name } = target;
        
        if (name === 'fechaLimite') return;
        
        // Prevent backspace/delete if cursor is within terminal prompt area
        if ((e.key === 'Backspace' || e.key === 'Delete') && 
            target.selectionStart !== null && 
            target.selectionStart <= terminalPrompt.length) {
            e.preventDefault();
        }
        
        // Prevent moving cursor before terminal prompt
        if ((e.key === 'ArrowLeft' || e.key === 'Home') && 
            target.selectionStart !== null && 
            target.selectionStart <= terminalPrompt.length) {
            if (e.key === 'Home') {
                e.preventDefault();
                target.setSelectionRange(terminalPrompt.length, terminalPrompt.length);
            }
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name } = target;
        
        if (name === 'fechaLimite') return;
        
        // Prevent clicking before terminal prompt
        setTimeout(() => {
            if (target.selectionStart !== null && target.selectionStart < terminalPrompt.length) {
                target.setSelectionRange(terminalPrompt.length, terminalPrompt.length);
            }
        }, 0);
    }

    const handleSumbit = (e: FormEvent) => {
        e.preventDefault();
        
        // Remove terminal prompt from data before submitting
        const cleanFormValues = {
            ...formValues,
            titulo: formValues.titulo.replace(terminalPrompt, '').trim(),
            descripcion: formValues.descripcion.replace(terminalPrompt, '').trim()
        };
        
        // Validate that there's actual content beyond the prompt
        if (!cleanFormValues.titulo || !cleanFormValues.descripcion) {
            return;
        }
        
        if (tareaActiva) {
            putTareaEditar({...cleanFormValues, id: tareaActiva.id});
        } else {
            crearTarea({...cleanFormValues, id: crypto.randomUUID()});
        }

        setTareaActiva(null);
        handleCloseModal();
    }

  return (
    <div className={styles.containerPrincipalModal}>
        <div className={styles.contentPopUp}>
            <div className={styles.modalHeader}>
                <h3>listatareas@ubuntu: ~</h3>
                <div className={styles.windowControls}>
                    <button className={`${styles.windowButton} ${styles.minimizeButton}`} />
                    <button className={`${styles.windowButton} ${styles.maximizeButton}`} />
                    <button className={`${styles.windowButton} ${styles.closeButton}`} onClick={handleCloseModal} />
                </div>
            </div>

            <form onSubmit={handleSumbit} className={styles.formContent}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        required
                        value={formValues.titulo}
                        autoComplete='off'
                        name='titulo'
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onClick={handleClick}
                        className={styles.terminalInput}
                    />
                    
                    <textarea
                        name="descripcion"
                        required
                        value={formValues.descripcion}
                        autoComplete='off'
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onClick={handleClick}
                        className={styles.terminalInput}
                    />
                    
                    <input
                        type="date"
                        required
                        autoComplete='off'
                        name='fechaLimite'
                        value={formValues.fechaLimite}
                        onChange={handleChange}
                        className={styles.terminalInput}
                    />
                </div>

                <div className={styles.buttonCards}>
                    <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
                    <button className={styles.actionButton} type="submit">
                        {tareaActiva ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}
