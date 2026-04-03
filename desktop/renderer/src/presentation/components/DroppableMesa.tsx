import { useDrop } from 'react-dnd';
import { Mesa } from '../services/api/mesas.api';

interface DroppableMesaProps {
  mesa: Mesa;
  onDrop: (invitadoId: string, mesaId: string) => void;
  children: React.ReactNode;
}

export function DroppableMesa({ mesa, onDrop, children }: DroppableMesaProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'invitado',
    drop: (item: { invitado: { id: string } }) => {
      onDrop(item.invitado.id, mesa.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? '#e3f2fd' : 'transparent',
        border: isOver ? '2px dashed #2196F3' : '2px solid transparent',
        borderRadius: '8px',
        padding: isOver ? '8px' : '10px',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </div>
  );
}

