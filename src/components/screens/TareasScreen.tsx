import { Header } from '../ui/Header/Header'
import { ListTareas } from '../ui/ListTareas/ListTareas'

export const TareasScreen = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--ubuntu-light-grey)',
      color: 'var(--ubuntu-text-grey)'
    }}>
      <Header />
      <ListTareas />
    </div>
  )
}
