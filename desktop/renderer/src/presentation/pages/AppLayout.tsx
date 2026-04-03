import { useState } from 'react';
import { DashboardOrganizador } from './DashboardOrganizador';
import { EventosListPage } from './EventosListPage';
import { InvitadosPage } from './InvitadosPage';
import { MesasPage } from './MesasPage';
import { EventoDashboardPage } from './EventoDashboardPage';
import { TimelinePage } from './TimelinePage';
import { ServiciosPage } from './ServiciosPage';
import { ProveedoresPage } from './ProveedoresPage';
import { ConnectionPage } from './ConnectionPage';
import { RecepcionPage } from './RecepcionPage';
import { ModeSelectPage } from './ModeSelectPage';
import { useSyncClient } from '../hooks/useSyncClient';
import './AppLayout.css';

type Page = 'dashboard' | 'eventos' | 'invitados' | 'mesas' | 'evento-dashboard' | 'timeline' | 'servicios' | 'proveedores';
type AppMode = 'organizador' | 'recepcion';

const MODE_STORAGE_KEY = 'planning-manager-mode';

export function AppLayout() {
  const [hasChosenMode, setHasChosenMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(MODE_STORAGE_KEY);
      return saved === 'organizador' || saved === 'recepcion';
    } catch {
      return false;
    }
  });
  const [appMode, setAppMode] = useState<AppMode>(() => {
    try {
      const saved = localStorage.getItem(MODE_STORAGE_KEY) as AppMode | null;
      return saved === 'recepcion' ? 'recepcion' : 'organizador';
    } catch {
      return 'organizador';
    }
  });
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedEvento, setSelectedEvento] = useState<{ id: string; nombre: string } | null>(null);
  const [recepcionEvento, setRecepcionEvento] = useState<{ id: string; nombre: string } | null>(null);
  const sync = useSyncClient();
  const { isConnected, connect, isConnecting, connectionError, syncEvento, eventoData, isLoading, checkConnection } = sync;

  const handleSelectOrganizador = () => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, 'organizador');
    } catch {}
    setHasChosenMode(true);
    setAppMode('organizador');
  };

  const handleSelectRecepcion = () => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, 'recepcion');
    } catch {}
    setHasChosenMode(true);
    setAppMode('recepcion');
  };

  // Pantalla inicial: selección de modo (Plan Fase 3.2)
  if (!hasChosenMode) {
    return (
      <ModeSelectPage
        onSelectOrganizador={handleSelectOrganizador}
        onSelectRecepcion={handleSelectRecepcion}
      />
    );
  }

  // Si está en modo recepción, mostrar páginas de recepción
  if (appMode === 'recepcion') {
    if (!recepcionEvento) {
      return (
        <ConnectionPage
          connect={connect}
          isConnecting={isConnecting}
          connectionError={connectionError}
          isConnected={isConnected}
          syncEvento={syncEvento}
          isLoadingSync={isLoading}
          onEventoSelected={(evento) => setRecepcionEvento(evento)}
          onSwitchToOrganizador={() => {
            setAppMode('organizador');
            setRecepcionEvento(null);
          }}
        />
      );
    }

    return (
      <RecepcionPage
        eventoId={recepcionEvento.id}
        eventoNombre={recepcionEvento.nombre}
        eventoData={eventoData}
        isConnected={isConnected}
        syncEvento={syncEvento}
        checkConnection={checkConnection}
        isLoadingSync={isLoading}
        onDisconnect={() => setRecepcionEvento(null)}
      />
    );
  }

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Planning Manager</h2>
        </div>
        <ul className="nav-menu">
          <li>
            <button
              className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${currentPage === 'eventos' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('eventos');
                setSelectedEvento(null);
              }}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-label">Eventos</span>
            </button>
          </li>
          {selectedEvento && (
            <>
              <li>
                <button
                  className={`nav-item ${currentPage === 'invitados' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('invitados')}
                >
                  <span className="nav-icon">👥</span>
                  <span className="nav-label">Invitados</span>
                </button>
              </li>
              <li>
                <button
                  className={`nav-item ${currentPage === 'mesas' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('mesas')}
                >
                  <span className="nav-icon">🪑</span>
                  <span className="nav-label">Mesas</span>
                </button>
              </li>
              <li>
                <button
                  className={`nav-item ${currentPage === 'timeline' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('timeline')}
                >
                  <span className="nav-icon">⏰</span>
                  <span className="nav-label">Timeline</span>
                </button>
              </li>
              <li>
                <button
                  className={`nav-item ${currentPage === 'servicios' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('servicios')}
                >
                  <span className="nav-icon">💼</span>
                  <span className="nav-label">Servicios</span>
                </button>
              </li>
            </>
          )}
          <li>
            <button
              className={`nav-item ${currentPage === 'proveedores' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage('proveedores');
                setSelectedEvento(null);
              }}
            >
              <span className="nav-icon">🏢</span>
              <span className="nav-label">Proveedores</span>
            </button>
          </li>
          <li className="nav-divider" />
          <li>
            <button
              type="button"
              className="nav-item nav-item-recepcion"
              onClick={() => {
                setAppMode('recepcion');
                setRecepcionEvento(null);
              }}
            >
              <span className="nav-icon">💻</span>
              <span className="nav-label">Modo Recepción</span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <DashboardOrganizador
            onSelectEvento={(evento) => {
              setSelectedEvento({ id: evento.id, nombre: evento.nombre });
              setCurrentPage('evento-dashboard');
            }}
          />
        )}
        {currentPage === 'eventos' && (
          <EventosListPage
            onSelectEvento={(evento) => {
              setSelectedEvento({ id: evento.id, nombre: evento.nombre });
              setCurrentPage('invitados');
            }}
            onViewDashboard={(evento) => {
              setSelectedEvento({ id: evento.id, nombre: evento.nombre });
              setCurrentPage('evento-dashboard');
            }}
          />
        )}
        {currentPage === 'evento-dashboard' && selectedEvento && (
          <EventoDashboardPage
            eventoId={selectedEvento.id}
            onBack={() => setCurrentPage('eventos')}
            onVerInvitados={() => setCurrentPage('invitados')}
            onVerMesas={() => setCurrentPage('mesas')}
          />
        )}
        {currentPage === 'invitados' && selectedEvento && (
          <InvitadosPage
            eventoId={selectedEvento.id}
            eventoNombre={selectedEvento.nombre}
          />
        )}
        {currentPage === 'mesas' && selectedEvento && (
          <MesasPage
            eventoId={selectedEvento.id}
            eventoNombre={selectedEvento.nombre}
          />
        )}
        {currentPage === 'timeline' && selectedEvento && (
          <TimelinePage
            eventoId={selectedEvento.id}
            eventoNombre={selectedEvento.nombre}
          />
        )}
        {currentPage === 'servicios' && selectedEvento && (
          <ServiciosPage
            eventoId={selectedEvento.id}
            eventoNombre={selectedEvento.nombre}
          />
        )}
        {currentPage === 'proveedores' && (
          <ProveedoresPage />
        )}
      </main>
    </div>
  );
}

