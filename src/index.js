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
        let screenX = map1.width() / 2
        let screenY = map1.height() / 2
        let x = 0
        let y = 0
        let rotation = 0
        let zoom = 0.5

        update(visibleImageTiles, map1, screenX, screenY, x, y, rotation, zoom)

        window.addEventListener("keyup", (e) => {
            if (e.key === "ArrowUp") {
                const v = normalize(0, -40, rotation, zoom)
                x += v.x
                y += v.y
            } else if (e.key === "ArrowDown") {
                const v = normalize(0, 40, rotation, zoom)
                x += v.x
                y += v.y
            } else if (e.key === "ArrowLeft") {
                const v = normalize(-40, 0, rotation, zoom)
                x += v.x
                y += v.y
            } else if (e.key === "ArrowRight") {
                const v = normalize(40, 0, rotation, zoom)
                x += v.x
                y += v.y
            } else if (e.key === "=") {
                zoom = zoom * 1.25
            } else if (e.key === "-") {
                zoom = zoom * 0.75
            } else if (e.key === "[") {
                rotation -= 10
            } else if (e.key === "]") {
                rotation += 10
            } else {
                // console.log(e)
                return
            }
            update(visibleImageTiles, map1, screenX, screenY, x, y, rotation, zoom)
        })
    }, 2000)
}

waitForDOM()
    .then(() => {
        main(props)
    })
