// ═══════════════════════════════════════════════════════════════
// ROYAL LOGS — GLSL Shader Generator
// 12-layer liquid-crystal temporal art, unique per memory seed
// ═══════════════════════════════════════════════════════════════

export function buildFragmentShader(params: {
  complexity:    number;
  turbulence:    number;
  crystallinity: number;
  luminosity:    number;
  temporalSpeed: number;
  seed:          number;
  primary:       string;
  secondary:     string;
  accent:        string;
  voidColor:     string;
}): string {
  const hexToVec3 = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;
    return `vec3(${r.toFixed(3)},${g.toFixed(3)},${b.toFixed(3)})`;
  };

  return `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform float u_seed;
uniform float u_complexity;
uniform float u_turbulence;
uniform float u_crystallinity;
uniform float u_luminosity;
uniform float u_speed;

const vec3 C_PRIMARY   = ${hexToVec3(params.primary)};
const vec3 C_SECONDARY = ${hexToVec3(params.secondary)};
const vec3 C_ACCENT    = ${hexToVec3(params.accent)};
const vec3 C_VOID      = ${hexToVec3(params.voidColor)};

// ── Hash / Noise ─────────────────────────────────────────────
float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345) + u_seed);
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),           hash(i + vec2(1,0)), f.x),
    mix(hash(i+vec2(0,1)), hash(i + vec2(1,1)), f.x),
    f.y
  );
}

// ── Fractal Brownian Motion (6 octaves) ───────────────────────
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p  = rot * p * 2.1 + vec2(u_seed * 0.1);
    a *= 0.5;
  }
  return v;
}

// ── Crystal Lattice ───────────────────────────────────────────
float crystal(vec2 p, float sharpness) {
  vec2 g = fract(p * 4.0) - 0.5;
  float d = length(g);
  return smoothstep(0.5, 0.5 - sharpness * 0.3, d);
}

// ── Voronoi Field ─────────────────────────────────────────────
float voronoi(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minDist = 1.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash(i + neighbor) * vec2(0.9) + neighbor;
      minDist = min(minDist, length(f - point));
    }
  }
  return minDist;
}

// ── Liquid Membrane ───────────────────────────────────────────
float membrane(vec2 p, float t) {
  float f1 = fbm(p * 1.5 + vec2(t * 0.08 * u_speed));
  float f2 = fbm(p * 2.0 - vec2(t * 0.05 * u_speed) + f1);
  float f3 = fbm(p + vec2(f1 * u_turbulence, f2 * u_turbulence));
  return f3;
}

// ── Glow Ring ─────────────────────────────────────────────────
float ring(vec2 uv, float r, float width) {
  float d = length(uv) - r;
  return smoothstep(width, 0.0, abs(d));
}

// ── Main ──────────────────────────────────────────────────────
void main() {
  vec2 uv  = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
  float t  = u_time;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  // Layer 1: Deep void background
  vec3 col = C_VOID;

  // Layer 2: Liquid membrane base
  float mem = membrane(uv * (1.0 + u_complexity * 0.8), t);
  col = mix(col, C_PRIMARY * 0.4, mem * u_luminosity);

  // Layer 3: Secondary turbulence
  float turb = fbm(uv * 2.5 + vec2(t * 0.06 * u_speed, u_seed));
  col = mix(col, C_SECONDARY * 0.6, turb * u_turbulence * 0.7);

  // Layer 4: Voronoi cellular structure
  float vor = voronoi(uv * (2.0 + u_complexity * 3.0) + t * 0.03 * u_speed);
  col += C_ACCENT * vor * 0.15 * u_crystallinity;

  // Layer 5: Crystal lattice overlay
  float crys = crystal(uv + vec2(fbm(uv + t * 0.02)), u_crystallinity);
  col = mix(col, C_PRIMARY, crys * u_crystallinity * 0.5);

  // Layer 6: Temporal pulse rings (3 rings = 3/6/9 editions)
  float pulse1 = ring(uv, 0.3 + sin(t * 0.7 * u_speed) * 0.05, 0.015);
  float pulse2 = ring(uv, 0.55 + sin(t * 0.4 * u_speed + 2.094) * 0.04, 0.01);
  float pulse3 = ring(uv, 0.78 + sin(t * 0.5 * u_speed + 4.189) * 0.03, 0.008);
  col += C_ACCENT    * pulse1 * 0.9;
  col += C_SECONDARY * pulse2 * 0.7;
  col += C_PRIMARY   * pulse3 * 0.5;

  // Layer 7: Diagonal scan lines
  float scan = sin(uv.y * 180.0 + t * u_speed * 2.0) * 0.5 + 0.5;
  col += C_PRIMARY * scan * 0.015;

  // Layer 8: Central radial glow
  float radial = 1.0 - smoothstep(0.0, 0.6, length(uv));
  col += C_PRIMARY * radial * 0.12 * u_luminosity;

  // Layer 9: Corner vignette
  float vign = 1.0 - smoothstep(0.5, 1.2, length(uv * vec2(1.0 / aspect, 1.0)));
  col *= vign;

  // Layer 10: Chromatic aberration on edges
  float ca = length(uv) * 0.06;
  col.r += fbm(uv + vec2(ca, 0.0) + t * 0.01) * 0.08;
  col.b += fbm(uv - vec2(ca, 0.0) + t * 0.01) * 0.08;

  // Layer 11: Temporal drift overlay
  float drift = fbm(uv * 4.0 + vec2(t * 0.12 * u_speed, -t * 0.08 * u_speed));
  col += C_SECONDARY * drift * 0.06;

  // Layer 12: Final crystalline shimmer
  float shimmer = hash(uv * 100.0 + fract(t * 0.5)) * 0.03;
  col += shimmer * C_ACCENT * u_crystallinity;

  // Tone map + gamma
  col = col / (col + 0.7);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.4545));

  gl_FragColor = vec4(col, 1.0);
}
`;
}

export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
