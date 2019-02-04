import buildTransform from "./utils/geometry/buildTransform"
import normalize from "./utils/geometry/normalize"

export function clamp(val, bound) {
    if (val > bound) {
        val = bound
    } else if (val < -bound) {
        val = -bound
    }
    return val
}

export function step() {
    let dirty = false

    if (this.up) {
        const v = normalize(0, -this.stride, this.rotation, this.zoom)
        this.x += v.x
        this.y += v.y
        dirty = true
    }
    if (this.down) {
        const v = normalize(0, this.stride, this.rotation, this.zoom)
        this.x += v.x
        this.y += v.y
        dirty = true
    }
    if (this.left) {
        const v = normalize(-this.stride, 0, this.rotation, this.zoom)
        this.x += v.x
        this.y += v.y
        dirty = true
    }
    if (this.right) {
        const v = normalize(this.stride, 0, this.rotation, this.zoom)
        this.x += v.x
        this.y += v.y
        dirty = true
    }
    if (this.zoomin) {
        this.zoom = this.zoom * (2 - this.zoomFactor)
        dirty = true
    }
    if (this.zoomout) {
        this.zoom = this.zoom * this.zoomFactor
        dirty = true
    }
    if (this.rotateleft) {
        this.rotation -= 3
        dirty = true
    }
    if (this.rotateright) {
        this.rotation += 3
        dirty = true
    }

    if (dirty) {
        this.x = clamp(this.x, this.width)
        this.y = clamp(this.y, this.height)
        update.bind(this)()
    }

    this.requestFrame(step.bind(this))
}

export function update() {
    this.tiles.forEach(function(tile) {
        let m = buildTransform(
            this.screenX, this.screenY,
            this.x, this.y,
            this.rotation,
            this.zoom,
            tile.x, tile.y,
            tile.rotation,
            tile.scale,
            tile.width, tile.height
        )
        tile.element.transform(m)
    }.bind(this))
}

export function requestFrame() {
    this.domWindow.requestAnimationFrame(this.step.bind(this))
}
