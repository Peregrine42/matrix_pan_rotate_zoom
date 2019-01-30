import {applyToPoint} from 'transformation-matrix';

export default class Tile {
    constructor(x = 0, y = 0, url = false, group = false, visible = false, rotation = 0, scale = 1.0) {
        this.x = x
        this.y = y

        this.rotation = rotation
        this.scale = scale

        this.url = url
        this.visible = visible

        this.group = group
    }
}
