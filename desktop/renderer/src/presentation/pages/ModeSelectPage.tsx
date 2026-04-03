import './ModeSelectPage.css';

interface ModeSelectPageProps {
  onSelectOrganizador: () => void;
  onSelectRecepcion: () => void;
}

export function ModeSelectPage({ onSelectOrganizador, onSelectRecepcion }: ModeSelectPageProps) {
  return (
    <div className="mode-select-page">
      <div className="mode-select-container">
        <h1 className="mode-select-title">Planning Manager</h1>
        <p className="mode-select-tagline">La eficiencia al servicio de tus eventos</p>

        <div className="mode-select-buttons">
          <button
            type="button"
            className="mode-btn mode-organizador"
            onClick={onSelectOrganizador}
          >
            <span className="mode-icon">🖥️</span>
            <span className="mode-label">Entrar al modo Organizador</span>
            <span className="mode-desc">Gestionar eventos, invitados, mesas, timeline y sincronización</span>
          </button>

          <button
            type="button"
            className="mode-btn mode-recepcion"
            onClick={onSelectRecepcion}
          >
            <span className="mode-icon">💻</span>
            <span className="mode-label">Entrar al modo Recepción</span>
            <span className="mode-desc">Conectar al organizador y realizar check-in de invitados</span>
          </button>
        </div>

        <p className="mode-select-help">
          Ambas computadoras deben estar en la misma red local (WiFi o cable). No se requiere internet.
        </p>
      </div>
    </div>
  );
}
