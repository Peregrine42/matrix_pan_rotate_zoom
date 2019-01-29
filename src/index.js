import waitForDOM from "./utils/waitForDOM"
import {scale, rotateDEG, translate, compose, applyToPoint} from 'transformation-matrix';
import SVG from 'svg.js'
import { Tile } from './model/tile'

let props = {}

const update = (tiles, map, screenX, screenY, x, y, rotation, zoom) => {
    tiles.forEach((tile) => { 
        let m = compose(
            translate(screenX, screenY),
            scale(zoom),
            translate(-x, -y),
            rotateDEG(rotation, x, y),

            translate(tile.x, tile.y),
            scale(tile.scale),
            translate(-tile.width/2, -tile.height/2),
            rotateDEG(tile.rotation, tile.width/2, tile.height/2),
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
        let screenX = map1.width()/2
        let screenY = map1.height()/2
        let x = 0
        let y = 0
        let rotation = 0
        let zoom = 0.5

        update(visibleImageTiles, map1, screenX, screenY, x, y, rotation, zoom)

        window.addEventListener("keyup", (e) => {
            if (e.key === "ArrowUp") {
                let v = applyToPoint(rotateDEG(-rotation), {x: 0, y: -10})
                x += v.x
                y += v.y
            } else if (e.key === "ArrowDown") {
                let v = applyToPoint(rotateDEG(-rotation), {x: 0, y: 10})
                x += v.x
                y += v.y
            } else if (e.key === "ArrowLeft") {
                let v = applyToPoint(rotateDEG(-rotation), {x: -10, y: 0})
                x += v.x
                y += v.y
            } else if (e.key === "ArrowRight") {
                let v = applyToPoint(rotateDEG(-rotation), {x: 10, y: 0})
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
                console.log(e)
                return
            }
            update(visibleImageTiles, map1, screenX, screenY, x, y, rotation, zoom)
        })
    }, 2000)
}

waitForDOM()
    .then(() => { main(props) })
