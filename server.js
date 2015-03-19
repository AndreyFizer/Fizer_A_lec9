/**
 * Created by Andrey on 18.03.2015.
 */

var express = require ('express');
var app = express();
var index = require('./routers/index.js');
//var Unit = index.Unit;
//var a = new Unit('ddd');
//index(app);

//console.log(a);

var unit_Vasya = new index.Unit('Vasya na koni');
var dracon_Vasya = new index.Unit_2('Vasya na drakoni');

console.dir(unit_Vasya);
console.dir(dracon_Vasya);

console.log('---------------------');
console.log(unit_Vasya.currentLoc);
console.log(dracon_Vasya.currentLoc);
unit_Vasya.moveTo();
dracon_Vasya.moveTo();
console.log(unit_Vasya.currentLoc);
console.log(dracon_Vasya.currentLoc);
console.log('=====================');
unit_Vasya.fight(dracon_Vasya);
unit_Vasya.fight(dracon_Vasya);
console.log('=====================');
dracon_Vasya.fight(unit_Vasya);
dracon_Vasya.fight(unit_Vasya);
dracon_Vasya.fireBall(unit_Vasya);
dracon_Vasya.fireBall(unit_Vasya);








app.listen(3000,function(){
    console.log('--- SUCCESS ---');
});