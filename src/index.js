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

function resizeTile(resolve, image) {
    this.element.size(image.width, image.height)

    this.width = image.width
    this.height = image.height

    resolve(this)
}

function setupTile(tile, resolve, _reject) {
    tile.element = this.image(tile.url).hide()
    tile.element.loaded(resizeTile.bind(tile, resolve))
}

function deferredSetupTile(tile) {
    return new Promise(setupTile.bind(this, tile))
}

function requestFrame() {
    this.domWindow.requestAnimationFrame(this.step.bind(this))
}

function initializeState(map, tiles) {
    let mapWidth = map.width()
    let mapHeight = map.height()

    return {
        width: mapWidth,
        height: mapHeight,
        screenX: mapWidth / 2,
        screenY: mapHeight / 2,

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

        stride: 2,
        zoomFactor: 0.950,

        tiles: tiles,
        map: map,

        update: update,
        step: step,
        requestFrame: requestFrame,
        domWindow: this
    }
}

function showTiles(tiles) {
    this.update.bind(this)()
    tiles.forEach((tile) => { tile.element.show() })
    this.requestFrame(this.step.bind(this))
}

function main(domWindow, id) {
    let tiles = [
        new Tile(0, 0, "/images/card1.png", "card1", true, 0, 0.25),
        new Tile(100, 0, "/images/card1.png", "card1", true, 0, 0.25),
        new Tile(-100, 0, "/images/card1.png", "card1", true, 90, 0.25),
    ]

    let map = SVG(id)

    let state = initializeState.bind(domWindow)(map, tiles)
    let tilePromises = tiles.map(deferredSetupTile.bind(map))

    domWindow.addEventListener("keyup", keyHandler.bind(state, false))
    domWindow.addEventListener("keydown", keyHandler.bind(state, true))

    Promise.all(tilePromises)
        .then(showTiles.bind(state))
        .then(requestFrame.bind(state))
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

    this.requestFrame(step.bind(this))
}

waitForDOM()
    .then(() => { main(window, "map1") })
    .then(() => { main(window, "map2") })
