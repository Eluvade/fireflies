import { rng, rcg, distance } from './utils.js'

let canvas, c, animationID
const mouse = {
  x: undefined,
  y: undefined
}
const fireflies = []
const particles = []
const animationLoop = _ => {
  animationID = requestAnimationFrame(animationLoop) // Create an animation loop
  c.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].fly()
  }
}
const resizeEH = _ => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
const mouseEH = _ => {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

export default class Fireflies {
  static initialize(quantity = 50, radius = [5, 50], color = [{ fill: '#ffffea', shadow: '#ff881b' }], pulse = true, flicker = false) {
    this.terminate() // Terminates all previously initialized instances
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    c = canvas.getContext('2d') // Get context to access 2D canvas functions
    canvas.width = window.innerWidth // Set canvas' width to full width of the window
    canvas.height = window.innerHeight // Set canvas' height to full height of the window
    for (let i = 0; i < quantity; i++){
      let r
      if (Object.prototype.toString.call(radius) === '[object Array]') {
        r = rng(radius[0], radius[1])
      } else {
        r = radius
      }
      const x = rng(r, canvas.width - r)
      const y = rng(r, canvas.height - r)
      const randomColor = rcg(color)
      fireflies[i] = new Firefly(x, y, r, randomColor.fill, randomColor.shadow, pulse, flicker)
    }
    addEventListener('resize', resizeEH)
    addEventListener('mousemove', mouseEH)
    animationLoop()
  }
  static terminate() {
    cancelAnimationFrame(animationID)
    removeEventListener('resize', resizeEH)
    removeEventListener('mousemove', mouseEH)
    for (let i = 0; i < fireflies.length; i++){
      fireflies.splice(0, fireflies.length)
    }
    if (canvas) {
      canvas.remove()
    }
  }
}

export class Firefly {
  constructor(x, y, radius, fillColor, shadowColor, pulse, flicker) {
    this.x = x
    this.y = y
    this.radius = radius
    this.fillColor = fillColor
    this.shadowColor = shadowColor
    this.velocity = {
      x: rng(-5, 5),
      y: rng(-5, 5)
    }
    this.glow = {
      pulse: pulse,
      flicker: flicker,
      default: undefined,
      strength: pulse ? rng(16, 255) : 191,
      growing: true
    }
  }
  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    const gradient = c.createRadialGradient(this.x, this.y, this.radius / 10, this.x, this.y, this.radius)
    gradient.addColorStop(0, this.fillColor)
    gradient.addColorStop(0.1, this.shadowColor + this.glow.strength.toString(16))
    gradient.addColorStop(1, 'transparent')
    c.fillStyle = gradient
    c.fill()
    c.closePath()
    c.restore()
  }
  fly() {
    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.velocity.x -= 0.07
    } else {
      this.velocity.x += Math.random() * 20 * Math.PI / 180 - 10 * Math.PI / 180 // Math.random() * 0.34 - 0.17 for short
    }
    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.velocity.y -= 0.07
    } else {
      this.velocity.y += Math.random() * 20 * Math.PI / 180 - 10 * Math.PI / 180 // Math.random() * 0.34 - 0.17 for short
    }
    // if mousey and if distance to another firefly

    this.x += 0.75 * Math.cos(this.velocity.x) // The number is the speed modifier
    this.y += 0.75 * Math.sin(this.velocity.y) // The number is the speed modifier
    this.calcGlow()
    this.draw()
  }
  calcGlow() {
    if (this.glow.default === undefined) {
      this.glow.default = this.glow.strength
    }
    if (this.glow.pulse) {
      if (this.glow.default >= 255) {
        this.glow.growing = false
      } else if (this.glow.default <= 48) {
        this.glow.growing = true
      }
      if (this.glow.growing) {
        this.glow.default ++
        this.glow.strength = this.glow.default
      } else {
        this.glow.default --
        this.glow.strength = this.glow.default
      }
    }
    if (this.glow.flicker) {
      if (Math.random() > 0.95) {
        this.glow.strength = rng(16, 255)
      } else {
        this.glow.strength = this.glow.default
      }
    }
  }
  dash() {
  }
}
