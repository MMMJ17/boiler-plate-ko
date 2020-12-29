const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,    // 문자열의 공백을 제거해준다.
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {      // 알반 유저와 관리자 유저를 구분하기 위해 사용
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSchema);   // 스키마를 모델이 감싼다.

module.exports = { User };    // 이 모델을 다른 곳에서도 쓸 수 있게 export한다.