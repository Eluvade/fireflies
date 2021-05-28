import { rng, rcg, distance } from './utils.js'

let canvas, c, animationID
const mouse = {
  x: undefined,
  y: undefined
}
let maxRadius
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
  static initialize(quantity = Math.floor((window.innerHeight + window.innerWidth) / 100), radius = [5, 25 + Math.floor((window.innerHeight + window.innerWidth) / 100)], color = [{ fill: '#ffffea', glow: '#ff881b' }], collision = false, pulse = true, flicker = true, connect = false, charge = 1) {
    this.terminate() // Terminates all previously initialized instances
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    c = canvas.getContext('2d') // Get context to access 2D canvas functions
    canvas.width = window.innerWidth // Set canvas' width to full width of the window
    canvas.height = window.innerHeight // Set canvas' height to full height of the window
    c.globalCompositeOperation = 'screen'
    for (let i = 0; i < quantity; i++){
      let r
      if (Object.prototype.toString.call(radius) === '[object Array]') {
        r = rng(radius[0], radius[1])
        maxRadius = radius[1]
      } else {
        r = radius
        maxRadius = radius
      }
      const x = rng(r, canvas.width - r)
      const y = rng(r, canvas.height - r)
      const randomColor = rcg(color)
      fireflies[i] = new Firefly(x, y, r, randomColor, collision, pulse, flicker, connect, charge)
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
  constructor(x, y, radius, color, collision, pulse, flicker, connect, charge) {
    this.x = x
    this.y = y
    this.radius = radius
    this.charge = charge
    this.color = {
      fill: color.fill,
      glow: color.glow
    }
    this.velocity = {
      x: Math.random() * Math.PI,
      y: Math.random() * Math.PI
    }
    this.glow = {
      pulse: pulse,
      flicker: flicker,
      default: undefined,
      strength: pulse ? rng(16, 255) : 191,
      growing: true
    }
    this.collision = collision
    this.connect = connect
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    const gradient = c.createRadialGradient(this.x, this.y, this.radius / 10, this.x, this.y, this.radius)
    gradient.addColorStop(1, this.color.glow + '00')
    gradient.addColorStop(0.1, this.color.glow + this.glow.strength.toString(16))
    gradient.addColorStop(0, this.color.fill)
    c.fillStyle = gradient
    c.fill()
    c.closePath()
  }
  fly() {
    this.collide()
    this.field();
    this.stayWithinView() // Screenbound
    this.x += 0.75 * Math.cos(this.velocity.x) // The number is the speed modifier
    this.y += 0.75 * Math.sin(this.velocity.y) // The number is the speed modifier
    this.calcGlow()
    // this.leaveTrail()
    this.draw()
  }
  field() {
    if (this.charge == 0) return;
    const k = 3 //Kind of like coloumbs constant

    let deltaX = this.x - mouse.x // Horizontal distance between firefly and mouse
    let deltaY = this.y - mouse.y // Vertical distance between firefly and mouse

    let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) // Distance between firefly and mouse
    let angle = Math.atan(Math.abs(deltaY) / Math.abs(deltaX)) // Angle of firefly with respect to mouse

    let velocity = k * this.charge / Math.pow(distance/maxRadius, 2) // Velocity is modelled after electric field (inaccurate more conversions needed for true velocity)
    if (velocity > k * this.charge) velocity = k * this.charge // Sets limit on field strength, this is in case mouse is within the radius

    let vx = velocity * Math.cos(angle) * (deltaX/Math.abs(deltaX)) // Horizontal component of v is cos of angle times net velocity as well as the direction
    let vy = velocity * Math.sin(angle) * (deltaY/Math.abs(deltaY)) // Vertical component of v is sin of angle times net velocity as well as the direction

    if (Number.isFinite(vx)) this.x += vx //Arctan function causes some NaN numbers for fireflies, ignore these
    if (Number.isFinite(vy)) this.y += vy
  }
  stayWithinView() {
    // particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH ), 0 );
    // particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT ), 0 );
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
  }
  collide() {
    if (this.collision) {
      const thisIndex = fireflies.indexOf(this)
      for (let i = 0; i < fireflies.length; i++) {
        if (fireflies[i] != fireflies[thisIndex]) {
          const dist = distance(this.x, this.y, fireflies[i].x, fireflies[i].y)
          const radii = this.radius + fireflies[i].radius
          if (dist <= radii) {
            this.velocity.x -= 0.035
            this.velocity.y -= 0.035
            if (this.connect) {
              c.save()
              c.beginPath()
              c.moveTo(this.x, this.y)
              c.lineTo(fireflies[i].x, fireflies[i].y)
              c.strokeStyle = `#ffffff${(Math.floor(255 - (238 * dist / radii))).toString(16)}`
              c.stroke()
              c.closePath()
              c.restore()
            }
          }
        }
      }
    }
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
      if (Math.random() > 0.99) {
        this.glow.strength = rng(16, 255)
      } else {
        this.glow.strength = this.glow.default
      }
    }
  }
}

class Trail extends Firefly {
  constructor() {
    this.body = []
    this.length = super.radius
  }
  draw() {

  }
}
