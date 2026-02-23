import React from 'react';

function MultiPlayerGame({ player1Score, player2Score, playerTurn }) {
  const isP1Turn = playerTurn === 1;

  // ── Shared tokens ──────────────────────────────────────────────────────────
  const p1Color   = '#4ea8de';   // cool blue   – Player 1
  const p2Color   = '#ff6b6b';   // coral red   – Player 2
  const activeP1  = isP1Turn;
  const activeP2  = !isP1Turn;

  const cardStyle = {
    display: 'flex',
    alignItems: 'stretch',
    background: 'rgba(10, 10, 20, 0.82)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
    overflow: 'hidden',
    width: '480px',
    maxWidth: '96vw',
    fontFamily: "'Playfair Display', serif",
    userSelect: 'none',
    marginBottom: '16px',
    marginTop: '8px',
  };

  const panelBase = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px 24px',
    position: 'relative',
    transition: 'background 0.35s',
  };

  const p1Panel = {
    ...panelBase,
    background: activeP1
      ? `linear-gradient(160deg, rgba(78,168,222,0.22) 0%, rgba(78,168,222,0.06) 100%)`
      : 'transparent',
    borderRight: '1px solid rgba(255,255,255,0.07)',
  };

  const p2Panel = {
    ...panelBase,
    background: activeP2
      ? `linear-gradient(160deg, rgba(255,107,107,0.22) 0%, rgba(255,107,107,0.06) 100%)`
      : 'transparent',
    borderLeft: '1px solid rgba(255,255,255,0.07)',
  };

  const labelStyle = (color, isActive) => ({
    fontFamily: "'Lato', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: isActive ? color : 'rgba(255,255,255,0.35)',
    marginBottom: '6px',
    transition: 'color 0.35s',
  });

  const scoreStyle = (color, isActive) => ({
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1,
    color: isActive ? color : 'rgba(255,255,255,0.25)',
    textShadow: isActive ? `0 0 20px ${color}66` : 'none',
    transition: 'color 0.35s, text-shadow 0.35s',
  });

  const turnBadge = (color) => ({
    marginTop: '10px',
    padding: '3px 10px',
    borderRadius: '20px',
    background: `${color}22`,
    border: `1px solid ${color}55`,
    color: color,
    fontFamily: "'Lato', sans-serif",
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    animation: 'pulseBadge 1.6s ease-in-out infinite',
  });

  const hiddenBadge = {
    marginTop: '10px',
    padding: '3px 10px',
    fontSize: '10px',
    opacity: 0,
    pointerEvents: 'none',
  };

  const vsWrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    position: 'relative',
  };

  const vsDiamond = {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    transform: 'rotate(45deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const vsText = {
    transform: 'rotate(-45deg)',
    fontFamily: "'Lato', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.4)',
  };

  // Active turn arrow (points left for P1's turn, right for P2's)
  const arrowStyle = {
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    marginTop: '10px',
    transition: 'all 0.35s',
    ...(isP1Turn
      ? { borderRight: `8px solid ${p1Color}`, borderLeft: 'none' }
      : { borderLeft: `8px solid ${p2Color}`, borderRight: 'none' }),
  };

  return (
    <>
      {/* Keyframe injected once via a style tag */}
      <style>{`
        @keyframes pulseBadge {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
      `}</style>

      <div style={cardStyle}>
        {/* ── Player 1 Panel ── */}
        <div style={p1Panel}>
          <span style={labelStyle(p1Color, activeP1)}>Player 1</span>
          <span style={scoreStyle(p1Color, activeP1)}>{player1Score}</span>
          {activeP1
            ? <span style={turnBadge(p1Color)}>Your Turn</span>
            : <span style={hiddenBadge}>—</span>
          }
        </div>

        {/* ── VS Divider ── */}
        <div style={vsWrapper}>
          <div style={vsDiamond}>
            <span style={vsText}>VS</span>
          </div>
          <div style={arrowStyle} />
        </div>

        {/* ── Player 2 Panel ── */}
        <div style={p2Panel}>
          <span style={labelStyle(p2Color, activeP2)}>Player 2</span>
          <span style={scoreStyle(p2Color, activeP2)}>{player2Score}</span>
          {activeP2
            ? <span style={turnBadge(p2Color)}>Your Turn</span>
            : <span style={hiddenBadge}>—</span>
          }
        </div>
      </div>
    </>
  );
}

export default MultiPlayerGame;