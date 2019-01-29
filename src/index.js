import waitForDOM from "./utils/waitForDOM"
import {scale, rotateDEG, translate, compose} from 'transformation-matrix';
import SVG from 'svg.js'
import { Tile } from './model/tile'

let props = {}

const main = (props) => {
    let tiles = [
        new Tile(100, 0, "/images/card1.png", "card1", true, 0, 1),
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
        let x = map1.width()/2
        let y = map1.height()/2
        let rotation = 90

        visibleImageTiles.forEach((tile) => { 
            let m = compose(
                rotateDEG(rotation, map1.width()/2, map1.height()/2),
                translate(x,y),
                translate(tile.x, tile.y),
                translate(-tile.width/2, -tile.height/2),
                rotateDEG(tile.rotation, tile.width/2, tile.height/2),
            )
            tile.element.transform(m)
        })
    }, 2000)
}

waitForDOM()
    .then(() => { main(props) })
