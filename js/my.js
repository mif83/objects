/**
 * Created by dima on 13.02.2017.
 */
function Soldier(name, power, message){
    this.name = name || "Smith";
    this.power = power || 10;
    this.message = message || "I am the best";
    this.backpack = new Backpack() ;
}
function Backpack(volume){
    this.volume = volume || 10;
    this.items = [];
};
Soldier.prototype.dropBackpack = function (){
    var self = this.backpack;
    console.warn("Backpack was droped \n" + JSON.stringify(self));
    delete this.backpack;
};
Soldier.prototype.buyBackpack = function(volume){
    this.backpack = new Backpack(volume);
};
Soldier.prototype.countWeight = function () {
    var count = 0;
    if (this.backpack){
       count += this.backpack.items.reduce(function(sum, item){return sum+=item.weight}, 0);
    };
    if (this.bag){
        count += this.bag.items.reduce(function(sum, item){return sum+=item.weight}, 0);
    };
    return count;
};
/***
*   name: "knife", (String)
*  weight: 1.1     (Number or string)
***/
Soldier.prototype.putToBackpack = function(name, weight, bagKind){
    var bagKind = bagKind || "backpack",
        self = this[bagKind],
        item = {};
    item.name = name;
    item.weight = +weight;

    if (self.items.length + 1 == self.volume)return console.warn(bagKind + " is full");
    if ( this.power * 3 < this.countWeight() + item.weight ) return console.warn("too hard");

    self.items.push(item);
    return JSON.stringify(self.items);
};
/***
* itemName (String)
***/
Soldier.prototype.getFromBackpack = function(itemName, bagKind){
    debugger;
    var count = 0,
        bagKind = bagKind || "backpack",
        self = this[bagKind],
        lastLength = self.items.length;

    self.items = self.items.filter(function (item){
                                     if (item.name === itemName && count === 0){
                                         count++;
                                         return false;
                                     }else {
                                         return true;
                                     }
                                    });

    if (lastLength == self.items.length) return "not such thing";
    return JSON.stringify(self.items);
};
Soldier.prototype.speech = function (str) {
    var str = str || "";
    console.info("The man "+ this.name + " said " + this.message + "\n" + str);
};

function SuperSoldier(name, power, message){
    var name = name || "John",
        power = power || 20,
        message = message || "I am the best of the best";
    Soldier.call(this, name, power, message);
    this.bag = new Backpack(5);
    this.quality = "super";
}
SuperSoldier.prototype = Object.create(Soldier.prototype);

SuperSoldier.prototype.putToBag = function(name, weight){
    var kindBag = "bag";
    return this.putToBackpack(name, weight, kindBag);
};
SuperSoldier.prototype.getFromBag = function (itemName) {
    var kindBag = "bag";
    return this.getFromBackpack(itemName, kindBag);
};
var squad = [];
s1 = new Soldier();
s2 = new SuperSoldier();
squad.push(new Soldier());
squad.push(new Soldier());
squad.push(new SuperSoldier());