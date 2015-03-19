/**
 * Created by Andrey on 18.03.2015.
 */


"use strict"

var wind = [20, -50];                          //вектор, що задає напрямок та силу вітру
var MAX_LVL = 30;                              //максимальний рівень, якого можуть досягти персонажі

console.log("Пов'язало");

//ф-ція, що описує 1-ий клас - Персонаж №1
function Unit (uName) {
        this.name = uName;                      //ім'я персонажа
        this.maxHp = 1000;                      //максимальний запас здоров'я
        this.currentHp = 1000;                  //поточний запас здоров'я (0 - 1000)
        this.maxSpeed = 2;                      //максимальна швидкість персонажа
        this.currentSpeed = 1.2;                //поточна швидкість персонажа (0.0 - 2.0)
        this.canFly = false;                    //можливість літати
        this.currentLoc = [0, 0];               //поточне розташування персонажа (координати в 2D)
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
        this.moveTo = function() {
            var x = Math.random()*100-50;                        //рандомно задається вектор руху (x,y)
            var y = Math.random()*100-50;
            //console.log('x: ' + x + ' y: ' + y);
            var currentSpeed = this.currentSpeed;
            var maxSpeed = this.maxSpeed;
            x = this.canFly ? (x * currentSpeed + wind[0]) : (x * currentSpeed);        //в залежності від швидкості змінюється довжина вектора руху,
            y = this.canFly ? (y * currentSpeed + wind[1]) : (y * currentSpeed);        //а якщо персонаж пересувається повітрям, то на його рух впливає вітер (поки, що просто сумою двох векторів)
            this.currentLoc[0] += x;
            this.currentLoc[1] += y;
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
        this.currentSpeed = 2;
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

    Unit_2.prototype = new Unit;
    Unit_2.prototype.constructor = Unit_2;


module.exports.Unit = Unit;
module.exports.Unit_2 = Unit_2;
