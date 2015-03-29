/**
 * Created by Andrey on 28.03.2015.
 */

"use strict"

var wind = [20, -50];                          //вектор, що задає напрямок та силу вітру

var Vekt = require('./../other/vektor.js');
var Const = require('./../other/constants.js');
var Marsh = require('./../other/marshrut.js');


//ф-ція, що описує 1-ий клас - Персонаж №1
function Unit (uName) {
    this.name = uName;                      //ім'я персонажа
    this.maxHp = 1000;                      //максимальний запас здоров'я
    this.currentHp = 1000;                  //поточний запас здоров'я (0 - 1000)
    this.maxSpeed = 2;                      //максимальна швидкість персонажа
    this.currentSpeed = Marsh.speed_1 ;     // <змінено> поточна швидкість персонажа - кількість певних одиниць пройдених за один хід
    this.speedReserve = 0;                  //при русі по маршруту - вказує запас ходу
    this.canFly = false;                    //можливість літати
    this.route=Marsh.route_1;               //маршрут персонажа
    this.currentLoc = this.route[0];        //поточне розташування персонажа (координати в 2D)
    this.lvl = 1;                           //рівень персонажа
    this.currentEXP = 0;                    //
    this.lvlUp_EXP = 300;                   //
    this.atBase = 50;                       //базова сила удару
    this.atRange = 40;                      //дальність удару
    this.atCrtChns = 0.15;                  //шанс на нанести додатковий урон (0.0 - 1.0)
    this.atCrtPow = 1.2;                    //сила додаткового урона
    this.atAccur = 0.15;                    //точність нанесення ударів (0.0 - 0.95)
    this.atEvas = 0.1;                      //шанс ухилитись від удару противника (0.0 - 1.0)
    this.atArmor = 20;                      //


    //метод, який змінює характеристики персонажа при збільшенні його рівня
    this.lvl_UP = function () {
        this.maxHp *= 1.1;
        this.currentHp = this.maxHp;
        if (this.maxEnergy){
            this.maxEnergy *= 1.1;
            this.currentEnergy = this.maxEnergy;
        }
        this.currentSpeed += 2;
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
        return '>>> '+this.name + ' LVL UP --> ' + this.lvl + ' !!!';
    }

    //метод, який описує рух персонажа в точку (x,y)
    this.moveTo = function(x,y) {
        var forLog='('+this.currentLoc.x.toFixed(1)+' ; '+this.currentLoc.y.toFixed(1)+')';
        if ((this.currentLoc.x == x && this.currentLoc.y == y) || ((this.route.length<2) && (arguments[2] !== undefined))) {
            return 'Your current location : ('+this.currentLoc.x.toFixed(1)+' ; '+this.currentLoc.y.toFixed(1)+'). You have arrived to your destination';
        } else {
            if (x<0 || x>Const.MAX_X || y<0 || y>Const.MAX_Y) {
                return 'Sorry, but you will go out of sight . Select coordinates from the (0-' + Const.MAX_X + ' ; 0-' + Const.MAX_Y + ')';
            } else {
                var myVek = Vekt.poinToVek(this.currentLoc, {x: +x, y: +y});
                var currentSpeed = (arguments[2] !== undefined && arguments[2] !== 0) ? Math.abs(arguments[2]) : this.currentSpeed;
                var coef = currentSpeed / Vekt.leng(myVek);

                this.speedReserve = (Vekt.leng(myVek) - currentSpeed) < 0 ? Math.abs(Vekt.leng(myVek) - currentSpeed) : 0;

                var resVek = Vekt.multNom(myVek, (coef < 1 ? coef : 1));
                this.currentLoc = Vekt.summ(this.currentLoc, resVek);

                if (arguments[2] !== undefined) {
                    this.route.shift();
                    if ((this.currentLoc.x != this.route[0].x) && (this.currentLoc.y != this.route[0].y)){
                        if (this.speedReserve == 0) {
                        this.route.unshift(this.currentLoc)
                        }
                    }
                } else {
                    if ((this.currentLoc.x != x) && (this.currentLoc.y != y)){
                        this.route = [this.currentLoc, {x: +x, y: +y}];
                    } else {
                        this.route = [{x: +x, y: +y}];
                    }
                };

                //console.log('пройдено : ' + Vekt.leng(resVek) + ' з ' + Vekt.leng(myVek) + ' запас ходу : ' + this.speedReserve);
                return this.name + ' moved from point  ' + forLog + ' ===> to point  (' +
                    this.currentLoc.x.toFixed(1) + ' ; ' + this.currentLoc.y.toFixed(1) + ')';
            }
        };

    };

    //метод, який описує рух персонажа по заданому маршруту
    /* по суті застосовує метод moveTo(х,у) до кожного відрізка маршруту */
    this.move = function() {
        var arr = this.route;
        var log=this.name+' moved from point  ('+this.currentLoc.x.toFixed(1)+
            ' ; '+this.currentLoc.y.toFixed(1)+')';
        var forLog='';
        var speedReserve;
        if (arr.length>1) {
            for (var i = 1; i < arr.length; i++) {
                do {
                    if ((speedReserve === 0) || (this.route.length<2)) {
                        this.speedReserve = 0;
                        return log += ' ===> to point  ('+
                            this.currentLoc.x.toFixed(1)+' ; '+this.currentLoc.y.toFixed(1)+')';
                    };
                    log += forLog;
                    this.moveTo(arr[i].x, arr[i].y, this.speedReserve);
                    speedReserve = this.speedReserve;
                    forLog = ' ===> through the point ('+this.currentLoc.x.toFixed(1)+
                        ' ; '+this.currentLoc.y.toFixed(1)+')';
                } while (speedReserve !== 0);
            }
        } else {
            return 'Your current location : ('+this.currentLoc.x.toFixed(1)+' ; '+this.currentLoc.y.toFixed(1)+'). You have arrived to your destination';
        };
        return log += ' ===> to point  ('+
            this.currentLoc.x.toFixed(1)+' ; '+this.currentLoc.y.toFixed(1)+')';
    };

    //метод, який описує удар по іншому персонажу (prey)
    this.fight = function (prey) {
        if (Vekt.leng(Vekt.poinToVek(this.currentLoc, prey.currentLoc)) <= this.atRange) {    //провіряэмо чи противник в зоны удару
            if (prey.currentHp>0){
            var atBase = this.atBase;
            var atCrtChns = this.atCrtChns;
            var atCrtPow = this.atCrtPow;
            var atAccur = this.atAccur;
            var atEvas = prey.atEvas;
            var atArmor = prey.atArmor;
            var pow = (Math.random() <= atCrtChns ? atBase + atBase * atCrtPow : atBase);     //з заданою імовірністю наносить додатковий урон,
            pow = (pow - pow * (atArmor / 100)) * (Math.random() <= atEvas ? 0 : 1);          //який змінюється в залежності від захисту об'єкта та його можливості ухилитися
            prey.currentHp = (prey.currentHp - pow)>=0 ? prey.currentHp - pow : 0;

            this.currentEXP += pow;                                                           //нехай опит набутий персонажем залежить від урона, який він наніс
            var forLog = '>>> ' + this.name + ' <' + pow.toFixed(2) + ' dmg>  --> ' + prey.name + ' [ ' + prey.maxHp.toFixed(2) + '/' + prey.currentHp.toFixed(2) + ' ]';
            if (prey.currentHp==0){forLog +='\nYour enemy is dead'}
            if (this.currentEXP >= this.lvlUp_EXP && this.lvl < Const.MAX_LVL) {
                forLog += '\n'+this.lvl_UP();
            };
            return forLog;
            } else {
                return 'You can`t strike your enemy, because he is already dead';
            }
        } else {
            return 'You are too far from the target to strike !!!';
        }
    }
}

//ф-ція, що описує 2-ий клас - Персонаж №2
function Unit_2(uName) {
    this.name = uName;
    this.canFly = true;
    this.maxSpeed = 4;
    this.currentSpeed = Marsh.speed_2;
    this.maxEnergy = 1000;                  //максимальна кількість енергії
    this.currentEnergy = 1000;              //поточна кількість енергії
    this.fireBallEnCost = 800;              //кількість енергії потрібна для певного скіла "fireBall"
    this.route=Marsh.route_2;
    this.currentLoc = this.route[0];
    this.atRange = 60;

    //метод, який описує скіл використаний на об'єкт (prey)
    this.fireBall = function (prey) {
        var fireDemage = ((prey.maxHp - prey.currentHp)/2) * (1 + this.lvl / 100);     //деяка ф-ла для визначення сили урона
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
            console.log('Not enough energy !!!');
        }

    }
}


Unit_2.prototype = new Unit;
Unit_2.prototype.constructor = Unit_2;




module.exports.Unit = Unit;
module.exports.Unit_2 = Unit_2;