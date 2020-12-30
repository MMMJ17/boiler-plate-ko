const express = require('express')    // express 모듈을 가져온다.
const app = express()                 // express 메소드를 이용해 새로운 app을 만든다.
const port = 5000       
const bodyParser = require('body-parser');
const { User } = require("./models/Use");

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true}));   

app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  // 에러가 발생하는 것을 막아준다.
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/register', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {         // sava는 몽고DB에서 오는 메서드
      if(err) return res.json({ success: false, err})
      return res.status(200).json({        // status(200) 성공했다는 의미
        success: true
      })
    })  
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})