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
    currentUnit : function(){
        return iChangeUnit===true ? unit_Vasya : dracon_Vasya
    },

    enemyUnit : function(){
        return iChangeUnit===false ? unit_Vasya : dracon_Vasya
    }
    };

/*
        �� 䳿 ����������� �������� ���������� (�� ������������ "unit_Vasya")(����� ������ �� ��������� '/change'). ��� ���� �� �������� ������������� '/move',
     �� ���� ���� �������� ��������� ����� �-��� �����, ���� ���� ������� ��������. ���� ����������� ����� '/moveTo/:myX/:myY', ����� ��� �� ������ �����, ��
     ������� ��������������. ����� '/fight' �������� ���� ����������, ���� ��� ����������� ����� �������� �����.

*/

module.exports = function(app) {

    app.get('/', function (req, res) {
        logg += 'Perform an action please (Chosen character :  ' +whatUnit.currentUnit().name+')'+'\n';
        res.status(200).send(logg);
    });

    //������ ��������� ���������
    app.get('/change', function (req, res) {
        iChangeUnit = !iChangeUnit;
        logg += 'You changed the character (Chosen character :  ' +whatUnit.currentUnit().name+')'+'\n';
        res.status(200).send(logg);
    });

    //����� �� ����� � ������������ (myX,myY)
    app.get('/moveTo/:myX/:myY', function (req, res) {
        if (whatUnit.currentUnit().currentHp>0) {
            logg += whatUnit.currentUnit().moveTo(req.params.myX, req.params.myY) + '\n';
        }else{
            logg += "Sorry, but you're dead \n";
        };
        res.status(200).send(logg);
    });

    //�������� �� �������� ��������
    /*app.get('/move', function (req, res) {
        if (whatUnit.currentUnit().currentHp>0) {
            logg += whatUnit.currentUnit().move() +'\n';
        }else{
            logg += "Sorry, but you're dead \n";
        }
        res.status(200).send(logg);
    });*/

    //�������� ���� ����������
    app.get('/fight', function (req, res) {
        if (whatUnit.currentUnit().health>0) {
            logg += whatUnit.currentUnit().fight(whatUnit.enemyUnit())+ '\n';
        }else{
            logg += "Sorry, but you're dead \n";
        }
        res.status(200).send(logg);
    });

}