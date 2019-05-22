import './index.scss'
import dog from './img/apple.png'

const createDom = NodeType => document.createElement(NodeType),
    div = createDom('div'),
    span = createDom('span'),
    p = createDom('p')
div.setAttribute('class', 'content')
div.appendChild(span)
div.appendChild(p)

const img = new Image()
img.src = dog
div.appendChild(img)
document.getElementById('app').appendChild(div)
