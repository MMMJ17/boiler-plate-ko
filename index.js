const express = require('express')    // express 모듈을 가져온다.
const app = express()                 // express 메소드를 이용해 새로운 app을 만든다.
const port = 5000       


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://MJ:kevin17@boilerplate.dylfl.mongodb.net/boilerplate?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  // 에러가 발생하는 것을 막아준다.
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})