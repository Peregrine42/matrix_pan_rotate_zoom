import waitForDOM from "./utils/waitForDOM"
import {scale, rotate, translate, compose, applyToPoint} from 'transformation-matrix';

let props = {}

const main = (props) => {
    console.log("Hi!")
}

waitForDOM()
    .then(() => { main(props) })
