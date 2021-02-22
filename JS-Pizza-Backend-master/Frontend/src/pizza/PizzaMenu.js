/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API')
var Pizza_List = [];
var thisUrl="http://localhost:5050";
var orderUrl=thisUrl+"//order.html";
//HTML едемент куди будуть додаватися піци
var $pizza_list = $(".pizzas");

function initPizzaList(error, data){
    if (error === null){
        Pizza_List = data;
        showPizzaList(Pizza_List);
    }
}

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    $("#pizzasAll").html(list.length);
    list.forEach(showOnePizza);
}

$("body").find(".typeOfPizza").find("input").change(function () {
    filterPizza(this);
});


function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var idOption = $(filter).attr('id');
    Pizza_List.forEach(function (pizza) {
        switch (idOption) {
            case 'option1':
                pizza_shown.push(pizza);
                break;
            case 'option2':
                if (pizza.content.meat !== undefined) {
                    pizza_shown.push(pizza);
                }
                break;
            case 'option3':
                if (pizza.content.pineapple !== undefined) {
                    pizza_shown.push(pizza);
                }
                break;
            case 'option4':
                if (pizza.content.mushroom !== undefined) {
                    pizza_shown.push(pizza);
                }
                break;
            case 'option5':
                if (pizza.content.ocean !== undefined) {
                    pizza_shown.push(pizza);
                }
                break;
            case 'option6':
                if (pizza.content.ocean === undefined && pizza.content.meat === undefined) {
                    pizza_shown.push(pizza);
                }
                break;
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    API.getPizzaList(initPizzaList);
    //Показуємо усі піци
}

$(".orderButton").click(function () {
    if (!($("#cart").is(":visible"))) {
        $("#cart").addClass("visible");
        $("#cart").removeClass("notVisible");
        $(".menu").removeClass("visible");
        $(".menu").addClass("notVisible");
    } else {
        $("#cart").addClass("notVisible");
        $("#cart").removeClass("visible");
        $(".menu").removeClass("notVisible");
        $(".menu").addClass("visible");
    }
});

$(".buyButton").click(function () {
    var checkUrl = window.location.href;
    if (checkUrl.endsWith("order.html")){
        window.location.href = thisUrl;
    } else {
        window.location.href = orderUrl;
    }
});

function isCharName(c) {
    return (c.toLowerCase() != c.toUpperCase()) || c == " " || c == "'" || c == "-";
}

function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function nameCheck(name) {
    if (name.length == 0) return false;
    for (var i = 0; i < name.length; i++) {
        if (!isCharName(name[i])) {
            return false;
        }
    }
    return true;
}

function phoneCheck(numb) {
    if ((numb.startsWith("+380") && numb.length == 13) || (numb.startsWith("0") && numb.length == 10)) {
        for (var i = 1; i < numb.length; i++) {
            if (!isCharNumber(numb[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

var basil = require('basil.js');
basil = new basil();
exports.get = function (key) {
    return basil.get(key);
};
exports.set = function (key, value) {
    return basil.set(key, value);
}

function sendToServer(error, data) {
}

$("#sendInfo").click(function () {
    var name = $("#inputName").val();
    var phone = $("#inputPhone").val();
    var address = $("#inputAddress").val();
    if (nameCheck(name)) {
        $("#nameGroup").removeClass("has-error");
        $("#nameGroup").addClass("has-success");
        $("#nameError").removeClass("visible");
        $("#nameError").addClass("notVisible");
    } else {
        $("#nameGroup").removeClass("has-success");
        $("#nameGroup").addClass("has-error");
        $("#nameError").removeClass("notVisible");
        $("#nameError").addClass("visible");
    }
    if (phoneCheck(phone)) {
        $("#phoneGroup").removeClass("has-error");
        $("#phoneGroup").addClass("has-success");
        $("#phoneError").removeClass("visible");
        $("#phoneError").addClass("notVisible");
    } else {
        $("#phoneGroup").removeClass("has-success");
        $("#phoneGroup").addClass("has-error");
        $("#phoneError").removeClass("notVisible");
        $("#phoneError").addClass("visible");
    }
    if (nameCheck(name) && phoneCheck(phone)){
        var orderPizzas = [];
        basil.get("cartSt").forEach(element => {
           var onePizza = {
               pizza: element.pizza.title,
               size: element.size,
               quantity: element.quantity
            }
            orderPizzas.push(onePizza);
        });
        var data = {
            name: name,
            phone: phone,
            address: address,
            pizzas: orderPizzas
        }
        API.createOrder(data,sendToServer)
    }
});

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;