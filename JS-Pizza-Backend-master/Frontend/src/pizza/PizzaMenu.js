/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $(".pizzas");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }
    $("#pizzasAll").html(list.length);
    list.forEach(showOnePizza);
}
$("body").find(".typeOfPizza").find("input").change(function(){
    filterPizza(this);
});


function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var idOption = $(filter).attr('id');
     Pizza_List.forEach(function(pizza){
            switch (idOption){
                case 'option1':
                    pizza_shown.push(pizza);
                    break;
                case 'option2':
                    if (pizza.content.meat !== undefined){
                        pizza_shown.push(pizza);
                    }
                    break;
                case 'option3':
                    if (pizza.content.pineapple !== undefined){
                        pizza_shown.push(pizza);
                    }
                    break;
                case 'option4':
                    if (pizza.content.mushroom !== undefined){
                        pizza_shown.push(pizza);
                    }
                    break;
                case 'option5':
                    if (pizza.content.ocean !== undefined){
                        pizza_shown.push(pizza);
                    }
                    break;
                case 'option6':
                    if (pizza.content.ocean === undefined && pizza.content.meat === undefined){
                        pizza_shown.push(pizza);
                    }
                    break;
            }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
}

$(".orderButton").click(function(){
    if (!($("#cart").is(":visible"))){
        $("#cart").addClass("visible");
        $("#cart").removeClass("notVisible");
        $(".menu").removeClass("visible");
        $(".menu").addClass("notVisible");
    }
    else {
        $("#cart").addClass("notVisible");
        $("#cart").removeClass("visible");
        $(".menu").removeClass("notVisible");
        $(".menu").addClass("visible");
    }
});

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;