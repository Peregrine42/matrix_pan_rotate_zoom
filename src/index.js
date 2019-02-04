import waitForDOM from "./utils/waitForDOM"
import SVG from "svg.js"
import {
    Tile,
    deferredSetupTile,
    resizeTile,
    showTiles
} from "./model/tile"
import keyHandler from "./utils/keyHandler"
import {
    update,
    step,
    requestFrame
} from "./animationLoop"
import getJSON from "./utils/getJSON"

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

function main(domWindow, selector) {
    let selection = domWindow.document.querySelectorAll(selector)

    for (let i = 0; i < selection.length; i++) {

        let selected = selection[i]
        let map = SVG.adopt(selected)

        getJSON(selected.dataset.url).then(initialize.bind(null, domWindow, map))
    }
}

function initialize(domWindow, map, data) {
    let tiles = data.tiles.map(function(tileData) {
        return (
            new Tile(
                tileData.x, tileData.y,
                tileData.url,
                tileData.group,
                tileData.visible,
                tileData.rotation, tileData.scale
            )
        )
    })

    let state = initializeState.bind(domWindow)(map, tiles)
    let tilePromises = tiles.map(deferredSetupTile.bind(map))

    domWindow.addEventListener("keyup", keyHandler.bind(state, false))
    domWindow.addEventListener("keydown", keyHandler.bind(state, true))

    return Promise.all(tilePromises)
        .then(showTiles.bind(state))
        .then(requestFrame.bind(state))
}

waitForDOM().then(() => {
    main(window, ".map")
})
