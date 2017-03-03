/**
 * Created by dima on 13.02.2017.
 */
function Soldier(name, power, message){
    this.name = name || "Smith";
    this.power = power || 10;
    this.message = message || "I am the best";
    this.backpack = new Backpack() ;
    if(!this.self) this.drow();
}
/**
 *
 * @param {number} volume - param specifies the number of cells in a backpack
 * @constructor
 */
function Backpack(volume){
    this.volume = volume || 10;
    this.items = [];
};
Soldier.prototype.drow = function(className){
    var soldier = document.createElement("div");
    soldier.classList.add("soldier");
    if (className) soldier.classList.add(className);
    soldier.innerHTML = "<div class='img'></div><ul><li><span>Name: </span>"+this.name+"</li><li><span>Power: </span>"+
            this.power+"</li><li><span>Message: </span>"+this.message+
            "</li><li class='backpack'><span>Backpack: </span><ol></ol></li></ul>";
    document.getElementsByClassName("field")[0].appendChild(soldier);
    this.self = soldier;
};
Soldier.prototype.dropBackpack = function (){
    if(!this.backpack) return;
    var self = this.backpack;
    console.warn("Backpack was droped \n" + JSON.stringify(self));
    delete this.backpack;
    this.drowOnChangeBackpack();
    document.getElementById("add-backpack").disabled = true;
};
Soldier.prototype.buyBackpack = function(volume){
    if (this.backpack) return;
    this.backpack = new Backpack(volume);
    this.drowOnChangeBackpack("addBackpack");
    document.getElementById("add-backpack").disabled = false;
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
/**
 *
 * @param {string} option
 */
Soldier.prototype.drowOnChangeBackpack = function (option) {
    if(!this.backpack){
        this.self.querySelector("ul").removeChild(this.self.getElementsByClassName("backpack")[0]);
        return;
    };
    if(option == "addBackpack"){
        var backpack = document.createElement("li");
        backpack.classList.add("backpack");
        backpack.innerHTML = "<span>Backpack: </span><ol></ol>";
        this.self.querySelector("ul").appendChild(backpack);
        return;
    };
    if (option == "addThing"){
        var thing = document.createElement("li");
        var backpackList = this.self.querySelector(".backpack ol");
        thing.innerHTML = this.backpack.items[this.backpack.items.length-1].name +" " +
            + this.backpack.items[this.backpack.items.length-1].weight + "kg";
        backpackList.appendChild(thing);
        return;
    };
    if (option == "addThingtoBag"){
        var thing = document.createElement("li");
        var backpackList = this.self.querySelector(".bag ol");
        thing.innerHTML = this.bag.items[this.bag.items.length-1].name +" " +
            + this.bag.items[this.bag.items.length-1].weight + "kg";
        backpackList.appendChild(thing);
        return;
    };
    if (option == "dropThing"){
        var backpackList = [].slice.call( this.self.querySelectorAll(".backpack ol li")),
            drop = false,
            things = document.getElementById("things").value.split(":");
        backpackList.forEach(function(item){
            if ( item.textContent.search(things[0]) != -1 && !drop) {
                item.parentNode.removeChild(item);
                drop = true;
            }
        });
        return;
    };
    if (option == "dropThingFromBag"){
        var backpackList = [].slice.call( this.self.querySelectorAll(".bag ol li")),
            drop = false,
            things = document.getElementById("things").value.split(":");
        backpackList.forEach(function(item){
            if ( item.textContent.search(things[0]) != -1 && !drop) {
                item.parentNode.removeChild(item);
                drop = true;
            }
        });
        return;
    };
};
/**
 *
 * @param {string} name    things name
 * @param {number} weight
 * @param {string} bagKind  "bag" or "bakpack"
 * @returns {boolean|string}  if item put in, return array of items on string format
 */
Soldier.prototype.putToBackpack = function(name, weight, bagKind){
    var bagKind = bagKind || "backpack",
        self = this[bagKind],
        item = {};
    item.name = name;
    item.weight = +weight;

    if (self.items.length == self.volume){
        console.warn(bagKind + " is full");
        return false
    }
    if ( this.power * 3 < this.countWeight() + item.weight ) {
        console.warn("too hard");
        return false;
    }

    self.items.push(item);
    return JSON.stringify(self.items);
};
/**
 *
 * @param {string }itemName
 * @param {string} bagKind    choise backpak or bag
 * @returns {boolean}
 */
Soldier.prototype.getFromBackpack = function(itemName, bagKind){
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

    if (lastLength == self.items.length) {
        console.warn("not such thing");
        return false;
    }
    return JSON.stringify(self.items);
};
Soldier.prototype.speech = function (str) {
    var str = str || "";
    console.info("The man "+ this.name + " said " + this.message + "\n" + str);
};
/**
 *
 * @param {string} name
 * @param {number} power
 * @param {string} message
 * @constructor
 */
function SuperSoldier(name, power, message){
    var name = name || "John",
        power = power || 20,
        message = message || "I am the best of the best";
    Soldier.call(this, name, power, message);
    this.bag = new Backpack(5);
}
SuperSoldier.prototype = Object.create(Soldier.prototype);
SuperSoldier.prototype.constructor = SuperSoldier;

SuperSoldier.prototype.putToBag = function(name, weight){
    var kindBag = "bag";
    return this.putToBackpack(name, weight, kindBag);
};
SuperSoldier.prototype.getFromBag = function (itemName) {
    var kindBag = "bag";
    return this.getFromBackpack(itemName, kindBag);
};
SuperSoldier.prototype.drow = function(){
    Soldier.prototype.drow.call(this, "super");
    var bag = document.createElement("li");
    bag.classList.add("bag");
    bag.innerHTML = "<span>Bag: </span><ol></ol>";
    this.self.querySelector("ul").appendChild(bag);
};
/**
 * After click choise the action
 * @param {object} e  event
 */
function action(e){
    if (e.target.getAttribute("id") == "create"){

        var radio = document.querySelectorAll("[name=soldier]"),
            radioCheked = [].filter.call(radio, function(item){return item.checked});
        arrName = document.getElementById("soldier-param").value.split(":");
        if(radioCheked[0].value == "Soldier" ){
            squad.push(new Soldier(arrName[0], arrName[1], arrName[2]));
        }
        if(radioCheked[0].value == "SuperSoldier" ){
            squad.push(new SuperSoldier(arrName[0], arrName[1], arrName[2]));
        }
    };
    if (e.target.getAttribute("id") == "drop"){
        squad.forEach(function(item){
            if(item.activate) item.dropBackpack();
        })
    };
    if (e.target.getAttribute("id") == "buy"){
        squad.forEach(function(item){
            if(item.activate) item.buyBackpack();
        })
    };
    if (e.target.getAttribute("id") == "add-backpack"){
        var things = document.getElementById("things").value.split(":");
        squad.forEach(function(item){
            if(item.activate) {
                if(item.putToBackpack(things[0], things[1])) item.drowOnChangeBackpack("addThing");
            }
        });

    };
    if (e.target.getAttribute("id") == "drop-from-backpack"){
        things = document.getElementById("things").value.split(":");
        squad.forEach(function(item){
            if(item.activate) {
                if(item.getFromBackpack(things[0],"backpack")) item.drowOnChangeBackpack("dropThing");
            }
        })
    };
    if (e.target.getAttribute("id") == "add-bag"){
        var things = document.getElementById("things").value.split(":");
        squad.forEach(function(item){
            if(item.activate) {
                if(item.putToBackpack(things[0], things[1], "bag")) item.drowOnChangeBackpack("addThingtoBag");
            }
        });

    };
    if (e.target.getAttribute("id") == "drop-from-bag"){
        things = document.getElementById("things").value.split(":");
        squad.forEach(function(item){
            if(item.activate) {
                if(item.getFromBackpack(things[0],"bag")) item.drowOnChangeBackpack("dropThingFromBag");
            }
        })
    };
}
/**
 * Add class active after choise soldier and chek elem
 * @param {object} e   event
 */
function activateSoldier(e){
    var target = e.target;
    while (target != document.body) {
        if (target.classList.contains("soldier")) {
            squad.forEach(function(item){
                if (item.self == target){
                    item.activate = true;
                } else {
                    item.activate = false;
                }
            });
            break;
        }
        target = target.parentNode;
    }
    squad.forEach(function(item){
        if(item.activate){
            item.self.classList.add("active");
            if(item.bag) {
                document.getElementById("add-bag").disabled = false;
            } else {
                document.getElementById("add-bag").disabled = true;
            }
            if(item.backpack){
                document.getElementById("add-backpack").disabled = false;
            } else{
                document.getElementById("add-backpack").disabled = true;
            }
        } else {
            item.self.classList.remove("active");
        }
    });
}
// Global array of the feature soldiers
var squad = [];
document.getElementsByClassName("head")[0].addEventListener("click", action);
document.getElementsByClassName("field")[0].addEventListener("click",activateSoldier);
