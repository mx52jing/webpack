import Counter from './Counter'
import Home from './Home'

import './index.scss'
// const xhr = new XMLHttpRequest()
//
// xhr.open('GET', '/api/user', true)
//
// // xhr.open('GET', '/api1/name', true)
//
// xhr.onreadystatechange = function() {
//     if(xhr.status === 200) {
//         console.log(xhr.response);
//     }
// }
//
// xhr.send()

Counter()
Home()

if(module.hot){
    module.hot.accept('./Home', () => {
        const home = document.getElementsByClassName('home')[0]
        document.getElementById('app').removeChild(home)
        Home()
        console.log('Home update');
    })
}

