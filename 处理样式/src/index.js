import './style.scss'
import './index.css'

const createDom = NodeType => document.createElement(NodeType),
    div = createDom('div'),
    span = createDom('span'),
    p = createDom('p')
div.setAttribute('class', 'content')
span.innerText = '我是span标签'
p.innerText = '我是p标签'
div.appendChild(span)
div.appendChild(p)

document.getElementById('app').appendChild(div)
