/**
 * Created by Andrey on 18.03.2015.
 */


"use strict"

var wind = [20, -50];                          //вектор, що задає напрямок та силу вітру
var MAX_LVL = 30;                              //максимальний рівень, якого можуть досягти персонажі

var marshUnit = [{x:50,y:20},{x:70,y:30},{x:80,y:20},{x:50,y:20}];
var marshUnit_2 = [{},{}];
//console.log("Пов'язало");

//ф-ція, що описує 1-ий клас - Персонаж №1
function Unit (uName) {
        this.name = uName;                      //ім'я персонажа
        this.maxHp = 1000;                      //максимальний запас здоров'я
        this.currentHp = 1000;                  //поточний запас здоров'я (0 - 1000)
        this.maxSpeed = 2;                      //максимальна швидкість персонажа
        this.currentSpeed = 60 ;                // <змінено> поточна швидкість персонажа - кількість певних одиниць пройдених за один хід
        this.speedReserve = 0;
        this.canFly = false;                    //можливість літати
        //this.route=[{x:50,y:20},{x:70,y:30},{x:80,y:20},{x:50,y:20}];
        this.route=[{x:0,y:0},{x:0,y:90},{x:0,y:210}];
        this.currentLoc = this.route[0];        //поточне розташування персонажа (координати в 2D)
        this.lvl = 1;                           //рівень персонажа
        this.currentEXP = 0;                    //
        this.lvlUp_EXP = 400;                   //
        this.atBase = 50;                       //базова сила удару
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

        //метод, який описує рух персонажа
        this.moveTo = function(x,y) {
            var myVek = Vekt.poinToVek(this.currentLoc,{x:x,y:y});
            var currentSpeed = arguments[2]<0 ? -arguments[2] : this.currentSpeed;
            var coef = currentSpeed/Vekt.leng(myVek);
            this.speedReserve = Vekt.leng(myVek)- this.currentSpeed;
            var resVek = Vekt.multNom(myVek,(coef<1 ? coef : 1));
            this.currentLoc = Vekt.summ(this.currentLoc,resVek);

            if (arguments[2]!== undefined){
                this.route.shift();
                if (this.speedReserve>0) {this.route.unshift(this.currentLoc)};
            } else {
                this.route=[this.currentLoc,{x:x,y:y}];
            }

            console.log('x: ' + this.currentLoc.x + ' y: ' + this.currentLoc.y);
            console.log('пройдено : '+Vekt.leng(resVek)+' з '+Vekt.leng(myVek)+' запас ходу : '+this.speedReserve);
            console.log('marshrut : '+this.route);

        }

        this.move = function() {
            var arr = this.route;
            for (var i = 1; i < arr.length; i++) {
            do {
                if (this.speedReserve > 0){
                    this.speedReserve=0;
                    return};
                this.moveTo(arr[i].x,arr[i].y,this.speedReserve);
            } while (
                this.speedReserve >= 0);

            };


            //console.dir(vekArr);
        }

        //метод, який описує удар по іншому персонажу (prey)
        this.fight = function (prey) {
            var atBase = this.atBase;
            var atCrtChns = this.atCrtChns;
            var atCrtPow = this.atCrtPow;
            var atAccur = this.atAccur;
            var atEvas = prey.atEvas;
            var atArmor = prey.atArmor;
            var pow = (Math.random() <= atCrtChns ? atBase + atBase * atCrtPow : atBase);   //з заданою імовірністю наносить додатковий урон,
            pow = (pow - pow * (atArmor/100)) * (Math.random() <= atEvas ? 0 : 1);          //який змінюється в залежності від захисту об'єкта та його можливості ухилитися
            prey.currentHp = prey.currentHp - pow;
            console.log('>>> ' + this.name + ' <'+pow+' dmg>  --> ' + prey.name + ' [ ' + prey.maxHp + '/' + prey.currentHp+' ]');
            this.currentEXP += pow;                                                         //нехай опит набутий персонажем залежить від урона, який він наніс
            if (this.currentEXP >= this.lvlUp_EXP && this.lvl < MAX_LVL) { this.lvl_UP() };
        }

    }

//ф-ція, що описує 2-ий клас - Персонаж №2
function Unit_2(uName) {
        this.name = uName;
        this.canFly = true;
        this.maxSpeed = 4;
        this.currentSpeed = 70;
        this.maxEnergy = 1000;                  //максимальна кількість енергії
        this.currentEnergy = 1000;              //поточна кількість енергії
        this.fireBallEnCost = 800;              //кількість енергії потрібна для певного скіла "fireBall"

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
                if (this.currentEXP >= this.lvlUp_EXP && this.lvl < MAX_LVL) { this.lvl_UP() };
            } else {
                console.log('Не достатньо енергії');
            }

        }
    }

var Vekt = {
    poinToVek : function(ob1,ob2){
        return {x:(ob2.x-ob1.x),y:(ob2.y-ob1.y)};
    },

    leng : function (ob){
        return Math.sqrt((ob.x*ob.x)+(ob.y*ob.y));
    },

    multNom : function (ob,n){
        return {x: ob.x*n, y: ob.y*n};
    },

    summ : function (ob1,ob2){
        return {x:(ob1.x+ob2.x),y:(ob1.y+ob2.y)};
    }
    }

    Unit_2.prototype = new Unit;
    Unit_2.prototype.constructor = Unit_2;




module.exports.Unit = Unit;
module.exports.Unit_2 = Unit_2;
