import React from 'react';
import cardBackImage from "../../images/cardBack.png";

// ── Per-deck color themes ──────────────────────────────────────────────────────
const DECK_THEMES = {
  "Black and White": {
    bg: "linear-gradient(145deg, #1c1c1e 0%, #3a3a3c 100%)",
    accent: "#c0c0c0",
    glow: "rgba(192,192,192,0.25)",
  },
  "Superheroes": {
    bg: "linear-gradient(145deg, #0d0d2b 0%, #1a1a5e 100%)",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
  },
  "Disney Princesses": {
    bg: "linear-gradient(145deg, #3b0a2a 0%, #7b2358 100%)",
    accent: "#FFB7D5",
    glow: "rgba(255,183,213,0.3)",
  },
  "Pokemon": {
    bg: "linear-gradient(145deg, #0a1f3d 0%, #1a3a7a 100%)",
    accent: "#FFCB05",
    glow: "rgba(255,203,5,0.3)",
  },
  "Baseball Teams": {
    bg: "linear-gradient(145deg, #07122a 0%, #162448 100%)",
    accent: "#e03030",
    glow: "rgba(224,48,48,0.25)",
  },
  "Baby Animals": {
    bg: "linear-gradient(145deg, #0d2b1a 0%, #1e5232 100%)",
    accent: "#a8e6b0",
    glow: "rgba(168,230,176,0.3)",
  },
};

const DEFAULT_THEME = {
  bg: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
  accent: "#c9a84c",
  glow: "rgba(201,168,76,0.25)",
};

// ── Filigree corner SVG ────────────────────────────────────────────────────────
// One corner ornament (top-left orientation); rotated 90/180/270 for others.
// The path draws:
//   • Two bracket arms (horizontal + vertical)
//   • A scroll/curl at the tip of each arm
//   • A small leaf loop midway along each arm
//   • A solid dot anchoring the corner
function FiligreeCorner({ color, style }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      style={{
        position: "absolute",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Bracket arms */}
      <path
        d="M 3,3 L 21,3"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 3,3 L 3,21"
        stroke={color}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Horizontal end scroll */}
      <path
        d="M 21,3 C 24,3 25,5.5 23,7.5 C 21,9.5 18.5,7.5 20,5.5"
        stroke={color}
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Vertical end scroll */}
      <path
        d="M 3,21 C 3,24 5.5,25 7.5,23 C 9.5,21 7.5,18.5 5.5,20"
        stroke={color}
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small leaf flourish on horizontal arm */}
      <path
        d="M 11,3 C 11,5.5 14,5.5 14,3 C 14,0.5 11,0.5 11,3 Z"
        stroke={color}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small leaf flourish on vertical arm */}
      <path
        d="M 3,11 C 5.5,11 5.5,14 3,14 C 0.5,14 0.5,11 3,11 Z"
        stroke={color}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Corner anchor dot */}
      <circle cx="3" cy="3" r="2" fill={color} />
    </svg>
  );
}

// Four corners placed absolutely
function FiligreeOverlay({ theme }) {
  const { accent, glow } = theme;
  return (
    <>
      <FiligreeCorner
        color={accent}
        style={{ top: 0, left: 0, transform: "rotate(0deg)" }}
      />
      <FiligreeCorner
        color={accent}
        style={{ top: 0, right: 0, transform: "rotate(90deg)" }}
      />
      <FiligreeCorner
        color={accent}
        style={{ bottom: 0, right: 0, transform: "rotate(180deg)" }}
      />
      <FiligreeCorner
        color={accent}
        style={{ bottom: 0, left: 0, transform: "rotate(270deg)" }}
      />

      {/* Thin inner border */}
      <div
        style={{
          position: "absolute",
          inset: "7px",
          border: `1px solid ${accent}`,
          borderRadius: "5px",
          opacity: 0.35,
          pointerEvents: "none",
          boxShadow: `inset 0 0 8px ${glow}`,
        }}
      />

      {/* Subtle center glow behind the image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
          pointerEvents: "none",
          borderRadius: "8px",
        }}
      />
    </>
  );
}

// ── Card face layout ──────────────────────────────────────────────────────────
function CardFace({ src, theme }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.bg,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Image — inset so filigree has breathing room */}
      <img
        src={src}
        alt="Card"
        style={{
          width: "68%",
          height: "68%",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.6))`,
        }}
      />

      {/* Filigree sits above image via z-index */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <FiligreeOverlay theme={theme} />
      </div>
    </div>
  );
}

// ── Main Card component ───────────────────────────────────────────────────────
function Card({ front, isFlipped, onFlip, deckName }) {
  const theme = DECK_THEMES[deckName] || DEFAULT_THEME;

  return (
    <div className="card" onClick={onFlip}>
      {isFlipped ? (
        <CardFace src={front} theme={theme} />
      ) : (
        <img src={cardBackImage} alt="Card Back" />
      )}
    </div>
  );
}

export default Card;