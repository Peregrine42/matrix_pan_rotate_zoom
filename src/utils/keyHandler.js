export default function handler(down, e) {
    if (e.key === "ArrowUp") {
        this.up = down
    } else if (e.key === "ArrowDown") {
        this.down = down
    } else if (e.key === "ArrowLeft") {
        this.left = down
    } else if (e.key === "ArrowRight") {
        this.right = down
    } else if (e.key === "=") {
        this.zoomin = down
    } else if (e.key === "-") {
        this.zoomout = down
    } else if (e.key === "[") {
        this.rotateleft = down
    } else if (e.key === "]") {
        this.rotateright = down
    }
}
