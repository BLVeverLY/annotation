var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userApi');
var fileRouter = require('./routes/fileApi');
var annotationRouter = require('./routes/annotationApi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(cors({
    origin: ['http://localhost:8080'], // 允许这个域的访问
    methods: ['GET', 'POST'],
    //只允许GET和POST请求
    alloweHeaders: ['Conten-Type ', ' Authorization'] // 只允许带这两种请求头的连接访问
}));

//设置跨域请求
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
    );
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/file', fileRouter);
app.use('/api/annotation', annotationRouter);
app.use('/static', express.static('public'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// app.listen(520)
console.log('success')

module.exports = app;