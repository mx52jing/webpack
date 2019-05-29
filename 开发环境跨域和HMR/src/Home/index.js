import createEl from '../CreateEl'

export default () => {
    const  div = createEl('div'),
        span = createEl('span')
    div.setAttribute('class', 'home')
    span.innerText = 4300
    div.append(span)
    document.getElementById('app').appendChild(div)
}
