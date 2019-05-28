const express = require('express')
const app = express()

app.get('/api/user', (req, res) => {
    res.json({
        name: '电风扇的方式',
        age: 16
    })
})

app.get('/api1/name', (req, res) => {
    res.json({
        name: 'name'
    })
})

app.listen(9300, () => {
    console.log('Servering is Running at http://localhost:9300');
})
