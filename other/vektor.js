/**
 * Created by Andrey on 28.03.2015.
 */

//модуль для роботи з векторами

module.exports = {

    // вхідні дані: 2 координати, вихідні: вектор, ними утворений
    poinToVek : function(ob1,ob2){
        return {x:(ob2.x-ob1.x),y:(ob2.y-ob1.y)};
    },

    // довжина вектора
    leng : function (ob){
        return Math.sqrt((ob.x*ob.x)+(ob.y*ob.y));
    },

    // множення вектора на число
    multNom : function (ob,n){
        return {x: ob.x*n, y: ob.y*n};
    },

    // сума векторів
    summ : function (ob1,ob2){
        return {x:(ob1.x+ob2.x),y:(ob1.y+ob2.y)};
    }
}