import createEl from '../CreateEl'

export default () => {
    const  div = createEl('div'),
        btn = createEl('button'),
        span = createEl('span')
    btn.innerText = 'increase'
    span.innerText = 1
    btn.addEventListener('click', () => {
        span.innerText = +span.innerText + 1
    })
    div.appendChild(btn)
    div.append(span)
    document.getElementById('app').appendChild(div)
}



