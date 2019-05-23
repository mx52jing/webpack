import './index.scss'
import dog from './img/apple.png'

const createDom = NodeType => document.createElement(NodeType),
    div = createDom('div'),
    span = createDom('span'),
    p = createDom('p'),
    i = createDom('i')
div.setAttribute('class', 'content')
div.appendChild(span)
div.appendChild(p)
i.setAttribute('class', 'icon iconfont icon-add')
div.appendChild(i)
const img = new Image()
img.src = dog
div.appendChild(img)
document.getElementById('app').appendChild(div)
