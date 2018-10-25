var express = require('express');
var app = express();
var router = require('./router/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use("/css",express.static(__dirname + "/css")); //해당하는 폴더를 사용할 수 있게
app.use("/images",express.static(__dirname + "/images"));
app.use("/js",express.static(__dirname + "/js"));
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});