import { useDrag } from 'react-dnd';
import { Invitado } from '@shared/types/Invitado';

interface DraggableInvitadoProps {
  invitado: Invitado;
  children: React.ReactNode;
}

export function DraggableInvitado({ invitado, children }: DraggableInvitadoProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'invitado',
    item: { invitado },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
}

