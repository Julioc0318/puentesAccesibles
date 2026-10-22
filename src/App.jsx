import React, { useState } from "react";

const screens = [
  { id: "seguimiento", label: "Seguimiento", short: "01", icon: "◎" },
  { id: "cambios", label: "Cambios de aula", short: "02", icon: "↗" },
  { id: "plan-b", label: "Plan B", short: "03", icon: "＋" },
];

function App() {
  const [screen, setScreen] = useState("seguimiento");
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [roomChanged, setRoomChanged] = useState(true);
  const [planStarted, setPlanStarted] = useState(false);
  const [aiStarted, setAiStarted] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  function announce(message) {
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(message), 30);
  }

  function confirmAttendance() {
    const nextValue = !attendanceConfirmed;
    setAttendanceConfirmed(nextValue);
    announce(
      nextValue
        ? "Tu asistencia está confirmada. Carlos también ha confirmado."
        : "Tu confirmación se ha retirado.",
    );
  }

  function triggerRoomChange() {
    setRoomChanged((current) => !current);
    announce(
      roomChanged
        ? "Aviso de cambio de aula retirado. Aula 4B-202."
        : "Cambio de aula detectado. Nueva aula 4B-205. Aviso enviado al estudiante y a Carlos.",
    );
  }

  function startPlan() {
    setPlanStarted(true);
    announce("Plan B activado. Buscando una persona suplente.");
  }

  function activateAi() {
    setAiStarted(true);
    announce("Copiloto de transcripción activado. La transcripción en directo está lista.");
  }

  function readPage() {
    if (!("speechSynthesis" in window)) {
      announce("La lectura por voz no está disponible en este navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const text =
      screen === "seguimiento"
        ? "Solicitud 1024. Intérprete para tutoría. Carlos M. está asignado y ha confirmado asistencia. La tutoría es mañana a las diez."
        : screen === "cambios"
          ? `Cambio de aula detectado. ${roomChanged ? "La clase se ha movido al aula 4B-205." : "La clase será en el aula 4B-202."} Estudiante y personal de apoyo notificados.`
          : "Plan B. El intérprete no ha confirmado. Puedes buscar una persona suplente o activar el Copiloto de transcripción.";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
    announce("Lectura de pantalla iniciada.");
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <aside className="sidebar" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="Puentes, inicio">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="brand-name">
            puentes<span>accesibles</span>
          </span>
        </a>

        <div className="profile">
          <div className="avatar student-avatar" aria-hidden="true">
            ER
          </div>
          <div>
            <strong>Elena Ruiz</strong>
            <span>Estudiante · UPV</span>
          </div>
          <span className="online-dot" aria-label="En línea" />
        </div>

        <nav className="screen-nav" aria-label="Vistas de demostración">
          {screens.map((item) => (
            <button
              className={`nav-item ${screen === item.id ? "active" : ""}`}
              key={item.id}
              type="button"
              aria-current={screen === item.id ? "page" : undefined}
              onClick={() => setScreen(item.id)}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className="nav-short">{item.short}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-footer">
            <span className="footer-status"><span /> UPV</span>
          </div>
        </div>
      </aside>

      <main className="main-area" id="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Mi espacio</span>
            <span aria-hidden="true">/</span>
            <strong>{screens.find((item) => item.id === screen)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <button className="icon-button voice-button" type="button" onClick={readPage}>
              <span aria-hidden="true">◖</span> Leer en voz alta
            </button>
            <button className="user-menu" type="button" aria-label="Perfil de Elena Ruiz">
              <span className="avatar small-avatar" aria-hidden="true">ER</span>
              <span>Elena</span>
              <span aria-hidden="true">⌄</span>
            </button>
          </div>
        </header>

        <section className="content-wrap" aria-label="Contenido de la demostración">
          {/* <div className="demo-strip">
            <span className="demo-live"><span /> DEMO</span>
            <span>Selecciona un escenario.</span>
          </div> */}

          {screen === "seguimiento" && (
            <TrackingScreen
              attendanceConfirmed={attendanceConfirmed}
              onConfirm={confirmAttendance}
              onRead={readPage}
              onOpenPlan={() => setScreen("plan-b")}
            />
          )}
          {screen === "cambios" && (
            <RoomChangeScreen
              roomChanged={roomChanged}
              onToggle={triggerRoomChange}
              onRead={readPage}
            />
          )}
          {screen === "plan-b" && (
            <PlanBScreen
              planStarted={planStarted}
              aiStarted={aiStarted}
              onStart={startPlan}
              onActivateAi={activateAi}
              onRead={readPage}
            />
          )}
        </section>

        <footer className="main-footer">
          <span>Puentes Accesibles · Apoyo claro, siempre conectado.</span>
          <a href="mailto:accesibilidad@upv.es">Centro de accesibilidad <span aria-hidden="true">↗</span></a>
        </footer>
      </main>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="section-title-row">
      <div>
        <div className="section-eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function TrackingScreen({ attendanceConfirmed, onConfirm, onRead, onOpenPlan }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);

  return (
    <>
      <SectionTitle
        eyebrow="SEGUIMIENTO"
        title="Solicitud #1024"
        description="Intérprete · Tutoría de Matemáticas"
        action={<button className="text-button" type="button" onClick={onRead}><span aria-hidden="true">◖</span> Escuchar</button>}
      />

      <div className="tracking-grid">
        <article className="card journey-card">
          <div className="card-topline">
            <div className="service-icon" aria-hidden="true">✳</div>
            <div className="service-title">
              <span className="tag tag-green">SOLICITUD ACTIVA</span>
              <h3>Intérprete para tutoría</h3>
              <p>Tutoría · Mañana, 10:00</p>
            </div>
            <button className="icon-button more-button" type="button" aria-label="Más opciones">···</button>
          </div>

          <div className="timeline" aria-label={`Estado de la solicitud: asignada, confirmación ${attendanceConfirmed ? "confirmada" : "pendiente"}`}>
            <div className="timeline-step done">
              <span className="step-marker" aria-hidden="true">✓</span>
              <div><strong>Solicitud recibida</strong><span>19 oct</span></div>
              <span className="step-state">COMPLETADO</span>
            </div>
            <div className="timeline-step done">
              <span className="step-marker" aria-hidden="true">✓</span>
              <div><strong>Apoyo asignado</strong><span>Carlos M. · Intérprete</span></div>
              <span className="step-state">COMPLETADO</span>
            </div>
            <div className="timeline-step current">
              <span className="step-marker" aria-hidden="true"><span /></span>
              <div><strong>Tu confirmación</strong><span>{attendanceConfirmed ? "Asistencia confirmada." : "Pendiente de confirmar."}</span></div>
              <span className="step-state pending-state">{attendanceConfirmed ? "CONFIRMADO" : "PENDIENTE"}</span>
            </div>
          </div>

          <div className="assigned-person">
            <div className="avatar interpreter-avatar" aria-hidden="true">CM</div>
            <div className="person-copy">
              <strong>Carlos M. <span className="verified" aria-label="Perfil verificado">✓</span></strong>
              <span>Intérprete · Confirmado</span>
            </div>
            <span className="person-status"><span /> DISPONIBLE</span>
            <button className="message-button" type="button" onClick={() => setNoteOpen((open) => !open)}>
              <span aria-hidden="true">↗</span> {noteSent ? "Nota enviada" : "Enviar nota"}
            </button>
          </div>
          {noteOpen && (
            <form
              className="anonymous-note"
              onSubmit={(event) => {
                event.preventDefault();
                if (note.trim()) {
                  setNoteSent(true);
                  setNoteOpen(false);
                  setNote("");
                }
              }}
            >
              <label htmlFor="support-note">Nota para Carlos</label>
              <span>Se enviará de forma anónima.</span>
              <div>
                <input
                  id="support-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Escribe una nota..."
                  required
                />
                <button type="submit" disabled={!note.trim()}>Enviar</button>
              </div>
            </form>
          )}
          {noteSent && !noteOpen && <p className="note-success" role="status">Tu nota anónima se ha enviado a Carlos.</p>}
        </article>

        <aside className="card next-card">
          <div className="next-label"><span aria-hidden="true">◷</span> PRÓXIMA TUTORÍA</div>
          <div className="countdown"><strong>02</strong><span>h</span><strong>15</strong><span>min</span></div>
          <p className="countdown-caption">para empezar</p>
          <div className="next-divider" />
          <div className="event-date">
            <div className="calendar-tile"><span>OCT</span><strong>22</strong></div>
            <div><strong>Mañana · 10:00</strong><span>Matemáticas</span></div>
          </div>
          <div className="event-location"><span aria-hidden="true">⌖</span> Edificio 4B <span>·</span> Aula 202</div>
          <div className="confirmation-note">
            <span className="confirmed-check" aria-hidden="true">✓</span>
            <span>Carlos confirmó</span>
          </div>
          <button className={`primary-button ${attendanceConfirmed ? "confirmed-button" : ""}`} type="button" onClick={onConfirm}>
            <span aria-hidden="true">{attendanceConfirmed ? "✓" : "→"}</span>
            {attendanceConfirmed ? "Asistencia confirmada" : "Confirmar mi asistencia"}
          </button>
          <p className="button-hint">Confirma con un toque.</p>
        </aside>
      </div>

      <div className="bottom-grid">
        <article className="card reminder-card">
          <span className="reminder-icon" aria-hidden="true">◉</span>
          <div><strong>Recordatorios activos</strong><span>24 h y 1 h antes de la tutoría</span></div>
        </article>
        <button className="plan-preview" type="button" onClick={onOpenPlan}>
          <span className="plan-preview-icon" aria-hidden="true">↗</span>
          <span><strong>¿Y si algo cambia?</strong><small>Plan B disponible</small></span>
          <span className="preview-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </>
  );
}

function RoomChangeScreen({ roomChanged, onToggle, onRead }) {
  const room = roomChanged ? "4B-205" : "4B-202";
  return (
    <>
      <SectionTitle
        eyebrow="CAMBIO DE AULA"
        title="La clase se ha movido."
        description="Aviso enviado a Elena, Carlos y al profesor."
        action={<button className="text-button" type="button" onClick={onRead}><span aria-hidden="true">◖</span> Escuchar</button>}
      />
      <div className="alert-banner" role="status">
        <span className="alert-symbol" aria-hidden="true">!</span>
        <div><strong>{roomChanged ? "NUEVA AULA · 4B-205" : "AULA ORIGINAL · 4B-202"}</strong><span>{roomChanged ? "Tutoría de las 10:00 · Cambio notificado" : "Tutoría de las 10:00 · Ubicación restaurada"}</span></div>
        <span className="priority-chip">AVISO ENVIADO</span>
      </div>

      <div className="change-grid">
        <article className="card location-card">
          <div className="card-heading">
            <div><span className="section-eyebrow">TUTORÍA · 10:00</span><h3>Aula {room}</h3></div>
            <span className="live-chip"><span /> ACTUALIZADA</span>
          </div>
          <div className="location-comparison">
            <div><span className="location-label">ANTES</span><span className="old-room">Aula {roomChanged ? "4B-202" : "4B-205"}</span></div>
            <span className="change-arrow" aria-hidden="true">→</span>
            <div><span className="location-label">AHORA</span><strong className="new-room">Aula {room}</strong></div>
            <span className="change-time">Edificio 4B</span>
          </div>
        </article>

        <aside className="card notified-card">
          <div className="notify-heading"><span className="notify-icon" aria-hidden="true">✓</span><div><span className="section-eyebrow">NOTIFICADOS</span><h3>Todo el equipo</h3></div></div>
          <div className="notified-person">
            <div className="avatar student-avatar" aria-hidden="true">ER</div>
            <div><strong>Elena Ruiz <span className="you-tag">TÚ</span></strong></div>
            <span className="delivered"><span>✓</span> Notificada</span>
          </div>
          <div className="notified-person">
            <div className="avatar interpreter-avatar" aria-hidden="true">CM</div>
            <div><strong>Carlos M. · Intérprete</strong></div>
            <span className="delivered"><span>✓</span> Notificado</span>
          </div>
          <div className="notified-person">
            <div className="avatar professor-avatar" aria-hidden="true">JL</div>
            <div><strong>Prof. Javier L.</strong></div>
            <span className="delivered"><span>✓</span> Notificado</span>
          </div>
        </aside>
      </div>

      <div className="demo-control">
        <span><strong>Demo</strong><small>Simular el cambio de aula</small></span>
        <button className="secondary-button" type="button" onClick={onToggle}>{roomChanged ? "Restablecer aula original" : "Simular cambio de aula"} <span aria-hidden="true">→</span></button>
      </div>
    </>
  );
}

function PlanBScreen({ planStarted, aiStarted, onStart, onActivateAi, onRead }) {
  return (
    <>
      <SectionTitle
        eyebrow="PLAN B"
        title="El apoyo continúa."
        description="Si Carlos no puede asistir, hay alternativas."
        action={<button className="text-button" type="button" onClick={onRead}><span aria-hidden="true">◖</span> Escuchar</button>}
      />
      <div className="emergency-banner">
        <span className="emergency-icon" aria-hidden="true">!</span>
        <div><span className="emergency-kicker">TUTORÍA · 10:00</span><strong>{planStarted ? "Buscando un suplente." : "Carlos aún no ha confirmado."}</strong><span>{planStarted ? "Solicitud enviada a la red de apoyo." : "Faltan 15 minutos."}</span></div>
        <span className={`countdown-pill ${planStarted ? "searching-pill" : ""}`}>{planStarted ? "BUSCANDO APOYO" : "15 MIN"}</span>
      </div>

      <div className="plan-layout">
        <article className="card response-card">
          <div className="card-heading">
            <div><span className="section-eyebrow">ALTERNATIVAS</span><h3>Dos opciones de apoyo</h3></div>
          </div>
          <div className="response-steps">
            <div className={`response-step ${planStarted ? "step-complete" : "step-active"}`}>
              <span className="response-marker">{planStarted ? "✓" : "1"}</span>
              <div><strong>1. Buscar suplente</strong><span>{planStarted ? "Solicitud enviada a la red." : "Avisar a intérpretes disponibles."}</span></div>
              <span className={`response-status ${planStarted ? "status-done" : ""}`}>{planStarted ? "ACTIVADO" : "PASO 1"}</span>
            </div>
          </div>
          <div className="response-footer"><span className="privacy-icon" aria-hidden="true">♢</span><span>La transcripción es temporal; no sustituye al intérprete.</span></div>
        </article>

        <aside className="card ai-card">
          <div className="ai-orb" aria-hidden="true"><span>✳</span></div>
          <span className="ai-label">ALTERNATIVA</span>
          <h3>Transcripción en directo</h3>
          <p>Apoyo temporal mientras llega un suplente.</p>
          <div className="ai-features"><span>✓ Voz a texto</span><span>✓ Notas de la tutoría</span></div>
          <button className="ai-button" type="button" onClick={onActivateAi} disabled={aiStarted}>
            <span aria-hidden="true">{aiStarted ? "✓" : "✳"}</span>
            {aiStarted ? "Copiloto activado" : "Activar Copiloto IA"}
          </button>
          <span className="ai-footnote">Actívala cuando la necesites.</span>
        </aside>
      </div>

      <div className="demo-control plan-control">
        <span><strong>{planStarted ? "Búsqueda activada." : "¿Probar el Plan B?"}</strong><small>Demostración: no envía avisos reales.</small></span>
        <button className="secondary-button" type="button" onClick={onStart} disabled={planStarted}>{planStarted ? "Búsqueda activada" : "Activar Plan B"} <span aria-hidden="true">→</span></button>
      </div>
    </>
  );
}

export default App;
