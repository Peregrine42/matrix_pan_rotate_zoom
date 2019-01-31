import waitForDOM from "./utils/waitForDOM"
import SVG from 'svg.js'
import Tile from './model/tile'
import buildTransform from './utils/geometry/buildTransform'
import normalize from './utils/geometry/normalize'

let props = {}

const update = (tiles, map, screenX, screenY, x, y, rotation, zoom) => {
    tiles.forEach((tile) => {
        let m = buildTransform(
            screenX, screenY,
            x, y,
            rotation,
            zoom,
            tile.x, tile.y,
            tile.rotation,
            tile.scale,
            tile.width, tile.height
        )
        tile.element.transform(m)
    })
}

const clamp = (val, bound) => {
    if (val > bound) {
        val = bound
    } else if (val < -bound) {
        val = -bound
    }
    return val
}

const main = (props) => {
    let tiles = [
        new Tile(0, 0, "/images/card1.png", "card1", true, 0, 0.25),
        new Tile(100, 0, "/images/card1.png", "card1", true, 0, 0.25),
        new Tile(-100, 0, "/images/card1.png", "card1", true, 90, 0.25),
    ]
    let visibleImageTiles = tiles.filter(t => t.visible && t.url)
    let map1 = SVG("map1")

    let images = visibleImageTiles.map((tile) => {
        let element = map1
            .image(tile.url)
            .hide()
            .loaded(function(loader) {
                this.size(loader.width, loader.height)
                this.show()

                tile.width = loader.width
                tile.height = loader.height
            })
        tile.element = element
    })

    setTimeout(() => {
        let width = map1.width()
        let height = map1.height()
        let screenX = width / 2
        let screenY = height / 2
        let x = 0
        let y = 0
        let rotation = 0
        let zoom = 0.5

        let up = false
        let down = false
        let left = false
        let right = false

        let zoomin = false
        let zoomout = false

        let rotateleft = false
        let rotateright = false

        update(tiles, map1, screenX, screenY, x, y, rotation, zoom)

        const step = () => {
            let dirty = false
            let stride = 5
            let zoomFactor = 0.950

            if (up) {
                const v = normalize(0, -stride, rotation, zoom)
                x += v.x
                y += v.y
                dirty = true
            }
            if (down) {
                const v = normalize(0, stride, rotation, zoom)
                x += v.x
                y += v.y
                dirty = true
            }
            if (left) {
                const v = normalize(-stride, 0, rotation, zoom)
                x += v.x
                y += v.y
                dirty = true
            }
            if (right) {
                const v = normalize(stride, 0, rotation, zoom)
                x += v.x
                y += v.y
                dirty = true
            }
            if (zoomin) {
                zoom = zoom * (2-zoomFactor)
                dirty = true
            }
            if (zoomout) {
                zoom = zoom * zoomFactor
                dirty = true
            }
            if (rotateleft) {
                rotation -= 3
                dirty = true
            }
            if (rotateright) {
                rotation += 3
                dirty = true
            }

            if (dirty) {
                x = clamp(x, width)
                y = clamp(y, height)
                update(tiles, map1, screenX, screenY, x, y, rotation, zoom)
            }

            window.requestAnimationFrame(step)
        }

        window.requestAnimationFrame(step)

        window.addEventListener("keyup", (e) => {
            if (e.key === "ArrowUp") {
                up = false
            } else if (e.key === "ArrowDown") {
                down = false
            } else if (e.key === "ArrowLeft") {
                left = false
            } else if (e.key === "ArrowRight") {
                right = false
            } else if (e.key === "=") {
                zoomin = false
            } else if (e.key === "-") {
                zoomout = false
            } else if (e.key === "[") {
                rotateleft = false
            } else if (e.key === "]") {
                rotateright = false
            }
        })

        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") {
                up = true
            } else if (e.key === "ArrowDown") {
                down = true
            } else if (e.key === "ArrowLeft") {
                left = true
            } else if (e.key === "ArrowRight") {
                right = true
            } else if (e.key === "=") {
                zoomin = true
            } else if (e.key === "-") {
                zoomout = true
            } else if (e.key === "[") {
                rotateleft = true
            } else if (e.key === "]") {
                rotateright = true
            }
        })
    }, 2000)
}

waitForDOM()
    .then(() => {
        main(props)
    })
