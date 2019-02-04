import buildTransform from "../../src/utils/geometry/buildTransform"

test("camera at the origin returns identical coordinates, offset by the object's width", () => {
    let screenX = 0
    let screenY = 0
    let cameraX = 0
    let cameraY = 0
    let cameraRotation = 0
    let cameraZoom = 1
    let objectX = 0
    let objectY = 0
    let objectRotation = 0
    let objectScale = 1
    let objectWidth = 50
    let objectHeight = 50
    expect(
        buildTransform(
            screenX, screenY,
            cameraX, cameraY,
            cameraRotation,
            cameraZoom,
            objectX, objectY,
            objectRotation,
            objectScale,
            objectWidth, objectHeight
        )
    ).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: -25,
        f: -25
    })
})

test("camera offset from the origin", () => {
    let screenX = 0
    let screenY = 0
    let cameraX = 10
    let cameraY = -10
    let cameraRotation = 0
    let cameraZoom = 1
    let objectX = 0
    let objectY = 0
    let objectRotation = 0
    let objectScale = 1
    let objectWidth = 50
    let objectHeight = 50
    expect(
        buildTransform(
            screenX, screenY,
            cameraX, cameraY,
            cameraRotation,
            cameraZoom,
            objectX, objectY,
            objectRotation,
            objectScale,
            objectWidth, objectHeight
        )
    ).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: -35,
        f: -15
    })
})

test("camera on an offset origin", () => {
    let screenX = 500
    let screenY = 500
    let cameraX = 0
    let cameraY = 0
    let cameraRotation = 0
    let cameraZoom = 1
    let objectX = 0
    let objectY = 0
    let objectRotation = 0
    let objectScale = 1
    let objectWidth = 50
    let objectHeight = 50
    expect(
        buildTransform(
            screenX, screenY,
            cameraX, cameraY,
            cameraRotation,
            cameraZoom,
            objectX, objectY,
            objectRotation,
            objectScale,
            objectWidth, objectHeight
        )
    ).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 475,
        f: 475
    })
})

test("offset object", () => {
    let screenX = 500
    let screenY = 500
    let cameraX = 0
    let cameraY = 0
    let cameraRotation = 0
    let cameraZoom = 1
    let objectX = 100
    let objectY = 0
    let objectRotation = 0
    let objectScale = 1
    let objectWidth = 50
    let objectHeight = 50
    expect(
        buildTransform(
            screenX, screenY,
            cameraX, cameraY,
            cameraRotation,
            cameraZoom,
            objectX, objectY,
            objectRotation,
            objectScale,
            objectWidth, objectHeight
        )
    ).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 500 + 100 - 25,
        f: 500 + 0 - 25
    })
})

test("camera with zoom", () => {
    let screenX = 500
    let screenY = 500
    let cameraX = 0
    let cameraY = 0
    let cameraRotation = 0
    let cameraZoom = 1.5
    let objectX = 100
    let objectY = 0
    let objectRotation = 0
    let objectScale = 1
    let objectWidth = 50
    let objectHeight = 50
    expect(
        buildTransform(
            screenX, screenY,
            cameraX, cameraY,
            cameraRotation,
            cameraZoom,
            objectX, objectY,
            objectRotation,
            objectScale,
            objectWidth, objectHeight
        )
    ).toEqual({
        a: 1.5,
        b: 0,
        c: 0,
        d: 1.5,
        e: 500 + (1.5 * 100) - (1.5 * 25),
        f: 500 + (1.5 * 0) - (1.5 * 25)
    })
})

test("camera with rotation", () => {
    let screenX = 500
    let screenY = 500
    let cameraX = 0
    let cameraY = 0
    let cameraRotation = 45
    let cameraZoom = 1
    let objectX = 100
    let objectY = 0
    let objectRotation = 0
    let objectScale = 1
    let objectWidth = 50
    let objectHeight = 50

    let matrix = buildTransform(
        screenX, screenY,
        cameraX, cameraY,
        cameraRotation,
        cameraZoom,
        objectX, objectY,
        objectRotation,
        objectScale,
        objectWidth, objectHeight
    )
    expect(matrix.a).toBeCloseTo(0.71)
    expect(matrix.b).toBeCloseTo(0.71)
    expect(matrix.c).toBeCloseTo(-0.71)
    expect(matrix.d).toBeCloseTo(0.71)
    expect(matrix.e).toBeCloseTo(570.71)
    expect(matrix.f).toBeCloseTo(535.36)
})
