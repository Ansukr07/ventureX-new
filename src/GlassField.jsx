import { useEffect, useRef } from 'react'

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentSource = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_hover;

float roundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 q = abs(p) - halfSize + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

vec3 backdrop(vec2 p) {
  vec2 uv = p / u_resolution;
  vec3 white = vec3(1.0, 0.996, 1.0);
  vec3 lilac = vec3(0.79, 0.72, 0.95);
  vec3 blue = vec3(0.018, 0.29, 0.98);
  float bluePool = 1.0 - smoothstep(0.05, 0.83, length((uv - vec2(0.02, 0.05)) * vec2(0.88, 1.05)));
  float lilacPool = 1.0 - smoothstep(0.03, 0.72, length((uv - vec2(0.28, 0.56)) * vec2(0.95, 1.05)));
  vec3 color = mix(white, lilac, lilacPool * 0.83);
  color = mix(color, blue, bluePool * 0.98);
  return color;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  float cell = u_resolution.x / 10.35;
  vec2 tileIndex = floor(p / cell);
  vec2 center = (tileIndex + 0.5) * cell;
  float influence = exp(-pow(length(center - u_mouse) / (cell * 2.0), 2.0)) * u_hover;

  // Each square behaves as a softly raised piece of translucent glass.
  vec2 local = (p - center) / cell;
  vec2 lens = local / (1.0 + influence * 0.17);
  float distanceToTile = roundedBox(lens, vec2(0.486), 0.065);
  float aa = 1.5 / cell;
  float tileMask = 1.0 - smoothstep(-aa, aa, distanceToTile);
  float innerRim = (1.0 - smoothstep(-0.065, -0.012, distanceToTile)) * tileMask;
  float outerRim = (1.0 - smoothstep(0.0, 0.018, abs(distanceToTile)));

  vec2 refraction = lens * cell * (0.10 + influence * 0.29);
  vec3 base = backdrop(p);
  vec3 glass = backdrop(p + refraction);
  float topLeft = clamp(0.55 + (lens.y - lens.x) * 0.48, 0.0, 1.0);
  glass = mix(glass, vec3(1.0), 0.105 + 0.105 * topLeft);
  glass += vec3(0.035, 0.025, 0.085) * innerRim * topLeft;
  glass -= vec3(0.035, 0.045, 0.075) * innerRim * (1.0 - topLeft);
  glass += vec3(0.12, 0.12, 0.16) * outerRim * topLeft;

  // A broad pointer light and a narrow specular highlight track the cursor.
  float pointerDistance = length(p - u_mouse);
  float light = exp(-pow(pointerDistance / (cell * 2.6), 2.0)) * u_hover;
  float glint = exp(-pow(pointerDistance / (cell * 0.45), 2.0)) * u_hover;
  glass = mix(glass, vec3(1.0), light * 0.25 + glint * 0.2);
  vec3 color = mix(base * 0.91, glass, tileMask);
  color += vec3(0.045, 0.05, 0.09) * light * (1.0 - tileMask);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('VentureX glass shader:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function GlassField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { alpha: false, antialias: true, powerPreference: 'low-power' })
    if (!gl) return undefined

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertex || !fragment) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('VentureX glass program:', gl.getProgramInfoLog(program))
      return undefined
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const resolutionUniform = gl.getUniformLocation(program, 'u_resolution')
    const mouseUniform = gl.getUniformLocation(program, 'u_mouse')
    const hoverUniform = gl.getUniformLocation(program, 'u_hover')

    let frame = 0
    let hover = 0
    let hoverTarget = 0
    let mouseX = -10000
    let mouseY = -10000
    let targetX = mouseX
    let targetY = mouseY

    const draw = () => {
      frame = 0
      mouseX += (targetX - mouseX) * 0.18
      mouseY += (targetY - mouseY) * 0.18
      hover += (hoverTarget - hover) * 0.13
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height)
      gl.uniform2f(mouseUniform, mouseX, mouseY)
      gl.uniform1f(hoverUniform, hover)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (Math.abs(hover - hoverTarget) > 0.003 || (hoverTarget && (Math.abs(mouseX - targetX) > 0.5 || Math.abs(mouseY - targetY) > 0.5))) {
        frame = requestAnimationFrame(draw)
      }
    }
    const scheduleDraw = () => { if (!frame) frame = requestAnimationFrame(draw) }
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio))
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio))
      scheduleDraw()
    }
    const move = (event) => {
      const bounds = canvas.getBoundingClientRect()
      targetX = (event.clientX - bounds.left) * canvas.width / bounds.width
      targetY = (bounds.bottom - event.clientY) * canvas.height / bounds.height
      hoverTarget = 1
      scheduleDraw()
    }
    const leave = () => { hoverTarget = 0; scheduleDraw() }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    resize()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas ref={canvasRef} className="glass-canvas" aria-hidden="true" />
}
