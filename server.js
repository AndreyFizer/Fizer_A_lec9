/**
 * Created by Andrey on 18.03.2015.
 */

"use strict"

var express = require ('express');
var app = express();

require('./routers/index')(app);

app.listen(3000,function(){
    console.log('--- SUCCESS ---');
});