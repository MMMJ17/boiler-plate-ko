const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
// const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

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

userSchema.pre('save', function ( next ) {   // moongose에서 가져온 메소드. 'save'하기 전에 function을 한다.

    var user = this;
    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})  

userSchema.methods.comparePassword = function (plainPassword, cb) {
    
    // plainPassword 1234567     암호화된 비밀번호 $2b$10$v9oPFrrlS6/7MUjaNUmSoutEjTl/sy2qwLH7aDYk/Pt3RGTjNGm06"
    // 암호화된 비밀번호 복구 불가능
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    
    var user = this;

    // jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token;
    user.save(function (err, user) {
        if(err) return cb(err)
        cb(null, user)
    })

}


userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라인언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token": token }, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
    
}


const User = mongoose.model('User', userSchema);   // 스키마를 모델이 감싼다.

module.exports = { User };    // 이 모델을 다른 곳에서도 쓸 수 있게 export한다.