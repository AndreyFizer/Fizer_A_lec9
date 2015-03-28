/**
 * Created by Andrey on 18.03.2015.
 */

var express = require ('express');
var app = express();
var uni = require('./other/units.js');

var unit_Vasya = new uni.Unit('Vasya na koni');
var dracon_Vasya = new uni.Unit_2('Vasya na drakoni');
var loc='';

app.get('/moveTo/:myX/:myY',function(req,res){
    unit_Vasya.moveTo(req.params.myX,req.params.myY);
    loc += unit_Vasya.currentLoc.x+' --- '+unit_Vasya.currentLoc.y+'\n';
    //console.log(unit_Vasya.currentLoc);
    res.status(200).send(loc);
});

app.get('/move',function(req,res){
    unit_Vasya.move();
    loc += unit_Vasya.currentLoc.x+' --- '+unit_Vasya.currentLoc.y+'\n';
    //console.log(unit_Vasya.currentLoc);
    res.status(200).send(loc);
});

//unit_Vasya.move();
//unit_Vasya.move();
//unit_Vasya.move();

app.listen(3000,function(){
    console.log('--- SUCCESS ---');
});