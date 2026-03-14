'use client';
import { useEffect, useRef } from 'react';
import { buildFragmentShader, VERTEX_SHADER } from '@/lib/shader';
import type { GeometryParams, ColorPalette } from '@/lib/memoryEngine';

interface Props {
  geometry: GeometryParams;
  palette:  ColorPalette;
  seed:     number;
  className?: string;
}

export default function ShaderCanvas({ geometry, palette, seed, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const glRef     = useRef<WebGLRenderingContext | null>(null);
  const progRef   = useRef<WebGLProgram | null>(null);
  const startRef  = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') as WebGLRenderingContext;
    if (!gl) return;
    glRef.current = gl;

    const fragSrc = buildFragmentShader({
      ...geometry,
      seed,
      primary:   palette.primary,
      secondary: palette.secondary,
      accent:    palette.accent,
      voidColor: palette.void,
    });

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vert = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = compile(gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    progRef.current = prog;

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      canvas.width  = canvas.clientWidth  * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (now: number) => {
      const t = (now - startRef.current) / 1000;
      gl.useProgram(prog);
      const u = (name: string) => gl.getUniformLocation(prog, name);
      gl.uniform1f(u('u_time'),         t);
      gl.uniform2f(u('u_resolution'),   canvas.width, canvas.height);
      gl.uniform1f(u('u_seed'),         seed);
      gl.uniform1f(u('u_complexity'),   geometry.complexity);
      gl.uniform1f(u('u_turbulence'),   geometry.turbulence);
      gl.uniform1f(u('u_crystallinity'),geometry.crystallinity);
      gl.uniform1f(u('u_luminosity'),   geometry.luminosity);
      gl.uniform1f(u('u_speed'),        geometry.temporalSpeed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [geometry, palette, seed]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
