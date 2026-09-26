import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface PlanetData {
  name: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: string; // Earth days/years
  color: string;
  orbitRadius: number; // px for display
  size: number; // px for display
  speed: number; // base animation duration in seconds
  description: string;
  emoji: string;
}

const planets: PlanetData[] = [
  {
    name: "Mercury",
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: "88 days",
    color: "#b5b5b5",
    orbitRadius: 80,
    size: 8,
    speed: 3,
    description: "The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.",
    emoji: "☿",
  },
  {
    name: "Venus",
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: "225 days",
    color: "#e8cda0",
    orbitRadius: 115,
    size: 12,
    speed: 7.5,
    description: "The hottest planet with a thick toxic atmosphere. It rotates in the opposite direction to most planets.",
    emoji: "♀",
  },
  {
    name: "Earth",
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: "365.25 days",
    color: "#4da6ff",
    orbitRadius: 155,
    size: 13,
    speed: 12,
    description: "Our home planet — the only known world with liquid water on the surface and life.",
    emoji: "🌍",
  },
  {
    name: "Mars",
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: "687 days",
    color: "#e07050",
    orbitRadius: 195,
    size: 10,
    speed: 22,
    description: "The Red Planet, known for its iron oxide surface. Home to the tallest volcano in the solar system.",
    emoji: "♂",
  },
  {
    name: "Jupiter",
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: "11.86 years",
    color: "#d4a574",
    orbitRadius: 260,
    size: 28,
    speed: 60,
    description: "The largest planet with a Great Red Spot storm. It has at least 95 known moons.",
    emoji: "♃",
  },
  {
    name: "Saturn",
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: "29.46 years",
    color: "#e8d5a0",
    orbitRadius: 330,
    size: 24,
    speed: 100,
    description: "Famous for its stunning ring system made of ice and rock. It could float in water if there were a big enough bathtub!",
    emoji: "♄",
  },
  {
    name: "Uranus",
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: "84.01 years",
    color: "#7de8e8",
    orbitRadius: 390,
    size: 18,
    speed: 180,
    description: "An ice giant that rotates on its side. It has a blue-green color from methane in its atmosphere.",
    emoji: "♅",
  },
  {
    name: "Neptune",
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: "164.8 years",
    color: "#4466ff",
    orbitRadius: 440,
    size: 17,
    speed: 260,
    description: "The windiest planet with speeds up to 2,100 km/h. It's the farthest planet from the Sun.",
    emoji: "♆",
  },
];

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * 360));
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 1 + "px",
          height: Math.random() * 2 + 1 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          opacity: Math.random() * 0.8 + 0.2,
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ));
  }, []);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setAngles((prev) =>
        prev.map((angle, i) => {
          const speed = (360 / planets[i].speed) * speedMultiplier;
          return (angle + speed * delta) % 360;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    },
    [speedMultiplier]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const getPlanetPosition = (planet: PlanetData, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * planet.orbitRadius,
      y: Math.sin(rad) * planet.orbitRadius,
    };
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-500 bg-clip-text text-transparent">
          ☀️ Solar System Explorer
        </h1>
        <p className="text-gray-400 text-sm mt-1">Click on any planet to learn more</p>
      </header>

      {/* Solar System Container */}
      <div className="relative z-10 flex items-center justify-center" style={{ height: "calc(100vh - 200px)" }}>
        <div className="solar-system-wrapper">
          <div ref={containerRef} className="relative" style={{ width: "900px", height: "900px" }}>
          {/* Sun */}
          <div
            className="absolute rounded-full cursor-pointer transition-transform hover:scale-110"
            style={{
              width: "60px",
              height: "60px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, #ffffff 0%, #fff700 20%, #ff8c00 60%, #ff4500 100%)",
              boxShadow: "0 0 40px 15px rgba(255, 165, 0, 0.5), 0 0 80px 30px rgba(255, 69, 0, 0.3), 0 0 120px 50px rgba(255, 69, 0, 0.15)",
              animation: "sunPulse 3s ease-in-out infinite",
            }}
          >
            <div className="absolute inset-[-4px] rounded-full opacity-40" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />
          </div>

          {/* Orbit paths */}
          {planets.map((planet, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute rounded-full border border-white/10"
              style={{
                width: planet.orbitRadius * 2 + "px",
                height: planet.orbitRadius * 2 + "px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Planets */}
          {planets.map((planet, i) => {
            const pos = getPlanetPosition(planet, angles[i]);
            const isSelected = selectedPlanet?.name === planet.name;
            return (
              <div
                key={`planet-${i}`}
                className="absolute cursor-pointer transition-all duration-200 group"
                style={{
                  width: planet.size + "px",
                  height: planet.size + "px",
                  top: `calc(50% + ${pos.y}px)`,
                  left: `calc(50% + ${pos.x}px)`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isSelected ? 20 : 10,
                }}
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
              >
                {/* Planet body */}
                <div
                  className={`w-full h-full rounded-full transition-all duration-200 overflow-hidden ${isSelected ? "scale-150" : "hover:scale-125"}`}
                  style={{
                    background: planet.name === "Jupiter"
                      ? `linear-gradient(180deg, ${lightenColor(planet.color, 20)} 0%, ${planet.color} 25%, ${adjustColor(planet.color, -30)} 40%, ${lightenColor(planet.color, 10)} 55%, ${planet.color} 70%, ${adjustColor(planet.color, -20)} 100%)`
                      : planet.name === "Saturn"
                      ? `linear-gradient(180deg, ${lightenColor(planet.color, 15)} 0%, ${planet.color} 40%, ${adjustColor(planet.color, -30)} 100%)`
                      : `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 40)}, ${planet.color} 50%, ${adjustColor(planet.color, -50)})`,
                    boxShadow: isSelected
                      ? `0 0 15px 5px ${planet.color}80, 0 0 30px 10px ${planet.color}40`
                      : `0 0 8px 2px ${planet.color}60`,
                  }}
                >
                  {/* Earth's continents hint */}
                  {planet.name === "Earth" && (
                    <div className="absolute inset-0 rounded-full" style={{
                      background: "radial-gradient(circle at 60% 40%, rgba(34,139,34,0.4) 0%, transparent 30%), radial-gradient(circle at 30% 60%, rgba(34,139,34,0.3) 0%, transparent 25%)",
                    }} />
                  )}
                </div>
                {/* Saturn's ring */}
                {planet.name === "Saturn" && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d4b896]/60 pointer-events-none"
                    style={{
                      width: planet.size * 1.8 + "px",
                      height: planet.size * 0.5 + "px",
                      transform: "translate(-50%, -50%) rotateX(75deg)",
                    }}
                  />
                )}
                {/* Planet label */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 text-[10px] text-white/80 whitespace-nowrap pointer-events-none font-medium"
                  style={{ top: planet.size + 4 + "px" }}
                >
                  {planet.name}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl p-5 animate-slideIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 30)}, ${selectedPlanet.color})`,
                  boxShadow: `0 0 10px 3px ${selectedPlanet.color}60`,
                }}
              />
              <h2 className="text-xl font-bold text-white">{selectedPlanet.name}</h2>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selectedPlanet.description}</p>
          <div className="space-y-2">
            <InfoRow label="Diameter" value={`${selectedPlanet.diameter.toLocaleString()} km`} />
            <InfoRow label="Distance from Sun" value={`${selectedPlanet.distanceFromSun} million km`} />
            <InfoRow label="Orbital Period" value={selectedPlanet.orbitalPeriod} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-medium"
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Play
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            <span className="text-gray-400 text-sm">Speed:</span>
            <div className="flex items-center gap-1">
              {[0.25, 0.5, 1, 2, 5, 10].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    speedMultiplier === speed
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setAngles(planets.map(() => Math.random() * 360));
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Planet Legend */}
      <div className="fixed bottom-16 left-4 z-40 hidden md:block">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
          <p className="text-xs text-gray-400 mb-2 font-medium">Planets</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {planets.map((planet, i) => (
              <button
                key={i}
                onClick={() => setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet)}
                className={`flex items-center gap-2 text-xs py-0.5 px-1 rounded transition-colors ${
                  selectedPlanet?.name === planet.name ? "bg-gray-700/50" : "hover:bg-gray-800/50"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: planet.color }}
                />
                <span className="text-gray-300">{planet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-700/50 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lightenColor(hex: string, amount: number): string {
  return adjustColor(hex, amount);
}

export default App;
