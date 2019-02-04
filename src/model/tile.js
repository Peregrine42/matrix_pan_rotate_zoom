import {
    applyToPoint
} from 'transformation-matrix';

export class Tile {
    constructor(
        x = 0,
        y = 0,
        url = false,
        group = false,
        visible = false,
        rotation = 0,
        scale = 1.0,
        color = null,
        width = null,
        height = null
    ) {
        this.x = x
        this.y = y

        this.rotation = rotation
        this.scale = scale

        this.url = url
        this.visible = visible

        this.group = group

        this.color = color
        this.width = width
        this.height = height
    }
}

export function setupTile(tile, resolve, _reject) {
    tile.element = this.image(tile.url).hide()
    tile.element.loaded(resizeTile.bind(tile, resolve))
}

export function deferredSetupTile(tile) {
    return new Promise(setupTile.bind(this, tile))
}

export function resizeTile(resolve, image) {
    this.element.size(image.width, image.height)

    this.width = image.width
    this.height = image.height

    resolve(this)
}

export function showTiles(tiles) {
    this.update.bind(this)()
    tiles.forEach((tile) => { tile.element.show() })
    this.requestFrame(this.step.bind(this))
}
