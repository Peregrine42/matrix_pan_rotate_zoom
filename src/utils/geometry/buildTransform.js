import {
    scale,
    rotateDEG,
    translate,
    compose
} from 'transformation-matrix';

const buildTransform = (
    screenX, screenY, 
    x, y, 
    rotation, 
    zoom, 
    objectX, objectY, 
    objectRotation, 
    objectScale, 
    objectWidth, objectHeight
) => {
    return compose(
        translate(screenX, screenY),
        scale(zoom),
        translate(-x, -y),
        rotateDEG(rotation, x, y),

        translate(objectX, objectY),
        scale(objectScale),
        translate(-objectWidth / 2, -objectHeight / 2),
        rotateDEG(objectRotation, objectWidth / 2, objectHeight / 2),
    )
}

export default buildTransform
