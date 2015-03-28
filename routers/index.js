/**
 * Created by Andrey on 18.03.2015.
 */

"use strict"
var logg='';
var iChangeUnit=true;

var uni = require('./../other/units.js');

var unit_Vasya = new uni.Unit('Vasya na koni');
var dracon_Vasya = new uni.Unit_2('Vasya na drakoni');

var whatUnit = {
    currentUser : function(){
        return iChangeUnit===true ? unit_Vasya : dracon_Vasya
    },

    enemyUnit : function(){
        return iChangeUnit===false ? unit_Vasya : dracon_Vasya
    }
    };


module.exports = function(app) {

    app.get('/', function (req, res) {
        logg += 'Perform an action please (Chosen character :  ' +whatUnit.currentUser().name+')'+'\n';
        res.status(200).send(logg);
    });

    app.get('/change', function (req, res) {
        iChangeUnit = !iChangeUnit;
        logg += 'You changed the character (Chosen character :  ' +whatUnit.currentUser().name+')'+'\n';
        res.status(200).send(logg);
    });

    app.get('/moveTo/:myX/:myY', function (req, res) {
        logg += whatUnit.currentUser().moveTo(req.params.myX, req.params.myY) + '\n';
        res.status(200).send(logg);
    });

    app.get('/move', function (req, res) {
        logg += whatUnit.currentUser().move() +'\n';
        res.status(200).send(logg);
    });

    app.get('/fight', function (req, res) {
        logg += whatUnit.currentUser().fight(whatUnit.enemyUnit())+ '\n';
        res.status(200).send(logg);
    });

}