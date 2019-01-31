import waitForDOM from "./utils/waitForDOM"
import SVG from 'svg.js'
import Tile from './model/tile'
import buildTransform from './utils/geometry/buildTransform'
import normalize from './utils/geometry/normalize'

function keyHandler(down, e) {
    if (e.key === "ArrowUp") {
        this.up = down
    } else if (e.key === "ArrowDown") {
        this.down = down
    } else if (e.key === "ArrowLeft") {
        this.left = down
    } else if (e.key === "ArrowRight") {
        this.right = down
    } else if (e.key === "=") {
        this.zoomin = down
    } else if (e.key === "-") {
        this.zoomout = down
    } else if (e.key === "[") {
        this.rotateleft = down
    } else if (e.key === "]") {
        this.rotateright = down
    }
}

function update() {
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

function clamp(val, bound) {
    if (val > bound) {
        val = bound
    } else if (val < -bound) {
        val = -bound
    }
    return val
}

function main() {
    let tiles = [
        new Tile(0, 0, "/images/card1.png", "card1", true, 0, 0.25),
        new Tile(100, 0, "/images/card1.png", "card1", true, 0, 0.25),
        new Tile(-100, 0, "/images/card1.png", "card1", true, 90, 0.25),
    ]
    let map1 = SVG("map1")

    let images = tiles.map((tile) => {
        let element = map1
            .image(tile.url)
            .hide()
            .loaded(function(loader) {
                this.size(loader.width, loader.height)

                tile.width = loader.width
                tile.height = loader.height
            })
        tile.element = element
    })

    let state = {
        width: map1.width(),
        height: map1.height(),
        screenX: 0,
        screenY: 0,
        x: 0,
        y: 0,
        rotation: 0,
        zoom: 0.5,

        up: false,
        down: false,
        left: false,
        right: false,

        zoomin: false,
        zoomout: false,

        rotateleft: false,
        rotateright: false,

        stride: 5,
        zoomFactor: 0.950,
        tiles: tiles
    }

    state.screenX = state.width / 2
    state.screenY = state.height / 2

    window.addEventListener("keyup", keyHandler.bind(state, false))

    window.addEventListener("keydown", keyHandler.bind(state, true))

    window.setTimeout(() => {
        tiles.forEach((tile) => { tile.element.show() })
        update.bind(state)()
    }, 2000)
    window.requestAnimationFrame(step.bind(state))
}

function step() {
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

    window.requestAnimationFrame(step.bind(this))
}

waitForDOM()
    .then(() => {
        main()
    })
