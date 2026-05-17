// src/components/islands/MeshGradient.tsx
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vert = /* glsl */`
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const frag = /* glsl */`
  precision highp float;
  uniform float u_time;
  uniform vec2  u_resolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y;

    // Two value-noise layers at different scales and drift speeds
    float n1 = noise(uv * 2.4 + u_time * 0.07);
    float n2 = noise(uv * 5.1 - u_time * 0.045 + vec2(3.7, 1.9));
    float n  = n1 * 0.65 + n2 * 0.35;

    // 3-stop ramp:
    //   c0 — warm off-white  oklch(0.98 0.005 90)  ≈ #FAF9F7
    //   c1 — mid cobalt      oklch(0.62 0.10  240) ≈ #6E8EC5
    //   c2 — deep cobalt     oklch(0.44 0.14  240) ≈ #39589E
    vec3 c0 = vec3(0.980, 0.975, 0.968);
    vec3 c1 = vec3(0.430, 0.557, 0.773);
    vec3 c2 = vec3(0.224, 0.345, 0.620);

    vec3 col = n < 0.5
      ? mix(c0, c1, n * 2.0)
      : mix(c1, c2, (n - 0.5) * 2.0);

    // Fade gradient toward background at the bottom — blends into page body
    float fade = smoothstep(0.60, 1.0, uv.y);
    col = mix(col, c0, fade);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function MeshGradient() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new Renderer({ canvas, alpha: false, antialias: false });
    const gl = renderer.gl;

    const program = new Program(gl, {
      vertex:   vert,
      fragment: frag,
      uniforms: {
        u_time:       { value: 0 },
        u_resolution: { value: [1, 1] as [number, number] },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const w = canvas.clientWidth  || canvas.parentElement?.clientWidth  || window.innerWidth;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      (program.uniforms.u_resolution.value as number[]) = [w, h];
    };
    resize();

    const draw = (t: number) => {
      program.uniforms.u_time.value = t * 0.001;
      renderer.render({ scene: mesh });
    };

    // prefers-reduced-motion: render one static frame and exit
    if (prefersReduced) {
      draw(0);
      return () => {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(canvas);

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (visibleRef.current) draw(t);
    };
    rafRef.current = requestAnimationFrame(loop);

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      io.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
