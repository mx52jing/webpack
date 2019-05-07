import { fn } from './a'
import './b.css'
import './a.css'
import './index.scss'

fn()
console.log(666);

const el = `<div class="content">
    <span>我是span</span>
    <p>我是p</p>
</div>`

document.getElementById('app').innerHTML = el
