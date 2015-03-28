/**
 * Created by Andrey on 28.03.2015.
 */

"use strict"

var wind = [20, -50];                          //������, �� ���� �������� �� ���� ����
var MAX_LVL = 30;                              //������������ �����, ����� ������ ������� ��������

var Vekt = require('./../other/vektor.js');
var Const = require('./../other/constants.js');

//�-���, �� ����� 1-�� ���� - �������� �1
function Unit (uName) {
    this.name = uName;                      //��'� ���������
    this.maxHp = 1000;                      //������������ ����� ������'�
    this.currentHp = 1000;                  //�������� ����� ������'� (0 - 1000)
    this.maxSpeed = 2;                      //����������� �������� ���������
    this.currentSpeed = 300 ;                // <������> ������� �������� ��������� - ������� ������ ������� ��������� �� ���� ���
    this.speedReserve = 0;
    this.canFly = false;                    //��������� �����
    //this.route=[{x:50,y:20},{x:70,y:30},{x:80,y:20},{x:50,y:20}];
    this.route=[ {x:0,y:0} , {x:0,y:100} , {x:100,y:100} , {x:100,y:200} ];
    this.currentLoc = this.route[0];        //������� ������������ ��������� (���������� � 2D)
    this.lvl = 1;                           //����� ���������
    this.currentEXP = 0;                    //
    this.lvlUp_EXP = 400;                   //
    this.atBase = 50;                       //������ ���� �����
    this.atRange = 50;                      //�������� �����
    this.atCrtChns = 0.15;                  //���� �� ������� ���������� ���� (0.0 - 1.0)
    this.atCrtPow = 1.2;                    //���� ����������� �����
    this.atAccur = 0.15;                    //������� ��������� ����� (0.0 - 0.95)
    this.atEvas = 0.1;                      //���� ��������� �� ����� ���������� (0.0 - 1.0)
    this.atArmor = 20;                      //


    //�����, ���� ����� �������������� ��������� ��� �������� ���� ����
    this.lvl_UP = function () {
        this.maxHp *= 1.1;
        this.currentHp = this.maxHp;
        if (this.maxEnergy){
            this.maxEnergy *= 1.1;
            this.currentEnergy = this.maxEnergy;
        }
        this.currentSpeed += 0.1;
        this.lvl += 1;
        console.log('>>> '+this.name + ' LVL UP --> ' + this.lvl + ' !!!');
        this.currentEXP -= this.lvlUp_EXP;
        this.lvlUp_EXP *= 1.2;
        this.atBase *= 1.2;
        this.atCrtChns += 0.05;
        this.atCrtPow += 0.1;
        this.atAccur += 0.05;
        this.atEvas += 0.015;
        this.atArmor += 2;
    }

    //�����, ���� ����� ��� ���������
    this.moveTo = function(x,y) {
        if (this.currentLoc.x == x && this.currentLoc.y == y) {
            console.log('�� ��� ��� !!!');
        } else {
            var myVek = Vekt.poinToVek(this.currentLoc, {x: +x, y: +y});
            console.log('=1 myVek ' + this.currentLoc.x + '    ' + this.currentLoc.y);
            console.log('=1 myVek ' + x + '    ' + y);
            var currentSpeed = (arguments[2]!==undefined && arguments[2]!==0) ? Math.abs(arguments[2]) : this.currentSpeed;
            console.log('=2 currentSpeed ' + currentSpeed);
            var coef = currentSpeed / Vekt.leng(myVek);
            console.log('=3 coef ' + coef);
            this.speedReserve = (Vekt.leng(myVek) - currentSpeed)<0 ? Math.abs(Vekt.leng(myVek) - currentSpeed) : 0 ;
            console.log('=4 speedReserve ' + this.speedReserve);
            var resVek = Vekt.multNom(myVek, (coef < 1 ? coef : 1));
            this.currentLoc = Vekt.summ(this.currentLoc, resVek);

            if (arguments[2] !== undefined) {
                this.route.shift();
                if (this.speedReserve == 0) {
                    this.route.unshift(this.currentLoc)
                }
                ;
            } else {
                this.route = [this.currentLoc, {x: +x, y: +y}];
            };

            console.log('�������� : ' + Vekt.leng(resVek) + ' � ' + Vekt.leng(myVek) + ' ����� ���� : ' + this.speedReserve);
            console.log('=====');
            console.log(this.route);
            console.log('=====');
        };

    };

    this.move = function() {
        var arr = this.route;
        var speedReserve;
        for (var i = 1; i <arr.length; i++) {
            do {
                if (speedReserve === 0) {
                    this.speedReserve=0;
                    return
                };
                this.moveTo(arr[i].x, arr[i].y, this.speedReserve);
                speedReserve = this.speedReserve;
            } while (speedReserve !== 0);
        }
    };

    //�����, ���� ����� ���� �� ������ ��������� (prey)
    this.fight = function (prey) {
        if (Vekt.leng(Vekt.poinToVek(this.currentLoc, prey.currentLoc)) <= this.atRange) {

            var atBase = this.atBase;
            var atCrtChns = this.atCrtChns;
            var atCrtPow = this.atCrtPow;
            var atAccur = this.atAccur;
            var atEvas = prey.atEvas;
            var atArmor = prey.atArmor;
            var pow = (Math.random() <= atCrtChns ? atBase + atBase * atCrtPow : atBase);   //� ������� ��������� �������� ���������� ����,
            pow = (pow - pow * (atArmor / 100)) * (Math.random() <= atEvas ? 0 : 1);          //���� ��������� � ��������� �� ������� ��'���� �� ���� ��������� ���������
            prey.currentHp = prey.currentHp - pow;
            //console.log('>>> ' + this.name + ' <' + pow + ' dmg>  --> ' + prey.name + ' [ ' + prey.maxHp + '/' + prey.currentHp + ' ]');
            this.currentEXP += pow;                                                         //����� ���� ������� ���������� �������� �� �����, ���� �� ����
            if (this.currentEXP >= this.lvlUp_EXP && this.lvl < Const.MAX_LVL) {
                this.lvl_UP()
            };
            return '>>> ' + this.name + ' <' + pow + ' dmg>  --> ' + prey.name + ' [ ' + prey.maxHp + '/' + prey.currentHp + ' ]';
        } else {
            return '�� ������� ������ �� ��� ��� ������� ���� !!!';
        }
    }
}

//�-���, �� ����� 2-�� ���� - �������� �2
function Unit_2(uName) {
    this.name = uName;
    this.canFly = true;
    this.maxSpeed = 4;
    this.currentSpeed = 70;
    this.maxEnergy = 1000;                  //����������� ������� ����㳿
    this.currentEnergy = 1000;              //������� ������� ����㳿
    this.fireBallEnCost = 800;              //������� ����㳿 ������� ��� ������� ���� "fireBall"

    //�����, ���� ����� ��� ������������ �� ��'��� (prey)
    this.fireBall = function (prey) {
        var fireDemage = ((prey.maxHp - prey.currentHp)/2) * (1 + this.lvl / 100);     //����� �-�� ��� ���������� ���� �����
        var atEvas = prey.atEvas;
        var energy = this.fireBallEnCost;
        var pow = 1;
        if (this.currentEnergy >= energy) {
            this.currentEnergy -= energy;
            pow += (Math.random() <= atEvas ? 0 : 1)*fireDemage;
            prey.currentHp = prey.currentHp - pow;
            console.log('>>> ' + this.name + ' FIREball <'+pow+' dmg>  --> ' + prey.name + ' [ ' + prey.maxHp + '/' + prey.currentHp+' ]');
            this.currentEXP += pow;
            if (this.currentEXP >= this.lvlUp_EXP && this.lvl < Const.MAX_LVL) { this.lvl_UP() };
        } else {
            console.log('�� ��������� ����㳿');
        }

    }
}


Unit_2.prototype = new Unit;
Unit_2.prototype.constructor = Unit_2;




module.exports.Unit = Unit;
module.exports.Unit_2 = Unit_2;