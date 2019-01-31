import {
    rotateDEG,
    applyToPoint,
    compose,
    scale
} from 'transformation-matrix'

const normalize = (x, y, rotation, zoom) => {
    return applyToPoint(
        compose(
            scale(2/zoom),
            rotateDEG(-rotation),
        ), {
            x: x,
            y: y
        }
    )
}

export default normalize
