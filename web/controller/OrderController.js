$("#dropdown_customer").click(function () {
    let name = $('#dropdown_customer option:selected').text();
    for (var i in customerDB) {
        if (customerDB[i].name == name) {
            $("#exampleInputCustomerID").val(customerDB[i].id);
        }
    }

});

function addCustomerdataIntodropDown() {
    $("#dropdown_customer").empty();
    console.log("A");
    $.ajax({
        url: "customer?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            console.log("F");
            for (const customer of resp.data) {
                $("#dropdown_customer").append('<option>' + customer.name + '</option>');
            }
        }
    });
}

function addItemDataIntodropDown() {
    $("#dropdown_item").empty();
    for (var i in itemDB) {
        $("#dropdown_item").append('<option>' + itemDB[i].name + '</option>');
    }

}

$("#dropdown_item").click(function () {
    let item_name = $('#dropdown_item option:selected').text();
    for (var i in itemDB) {
        if (itemDB[i].name == item_name) {
            $("#exampleInputItem_Id_1").val(itemDB[i].id);
            $("#exampleInputItem_Price").val(itemDB[i].price);
            $("#exampleInputItem_QTyOnHand").val(itemDB[i].qty);
        }
    }

});

function getOrderData() {
    let item_id = $("#exampleInputItem_Id_1").val();
    let item_name = $("#dropdown_item").val();
    let item_price = $("#exampleInputItem_Price").val();
    let item_qty = $("#exampleInputOrder_QTy").val();
    let item_QTYOnHand = $("#exampleInputItem_QTyOnHand").val();
    let item_total = item_price * item_qty;

    if ((+item_qty) < (+item_QTYOnHand)) {
        let response = searchItem(item_id);
        if (response) {
            let current_qty = response.qty;
            let currentTotal = response.total;

            if ((+item_QTYOnHand) > (+current_qty) + (+item_qty)) {
                for (let i = 0; i < cartDB.length; i++) {
                    if (cartDB[i].id == response.id) {
                        cartDB.splice(i, 1);

                        var cart = new CartDTO(item_id, item_name, item_price, (+current_qty) + (+item_qty), (+currentTotal) + (+item_total));
                        cartDB.push(cart);

                        countAllItemTotal();
                    }
                }
            } else {
                alert("Quantity size is insufficient for order");
            }
        } else {
            var cart = new CartDTO(item_id, item_name, item_price, item_qty, item_total);
            cartDB.push(cart);
            countAllItemTotal();
        }
    } else {
        alert("Quantity size is insufficient for order");
    }
}

function searchItem(id) {
    for (let i = 0; i < cartDB.length; i++) {
        if (cartDB[i].id == id) {
            return cartDB[i];
        }
    }
}

function countAllItemTotal() {
    let allTotal = 0;
    for (let i = 0; i < cartDB.length; i++) {
        allTotal = (+allTotal) + (+cartDB[i].total);
    }
    $("#exampleInputTotal_price").val(allTotal);
}

$("#purchase").click(function () {
    let total = $("#exampleInputTotal_price").val();
    let cash = $("#exampleInputCash").val();

    if ((+cash) >= (+total)) {
        $("#exampleInputRemaining").val((+cash) - (+total));
        placeOrder();
        generateOrderId();
    } else {
        alert("There is not enough money for the order");
    }

});

function placeOrder() {
    let orderId = $("#orderId").val();
    let orderDate = $("#datepicker").val();
    let customerId = $("#exampleInputCustomerID").val();
    let orderTotal = $("#exampleInputTotal_price").val();

    // var order = new OrdersDTO(orderId, orderDate, customerId, orderTotal);
    //
    // orderDB.push(order);
    //
    // for (let i = 0; i < cartDB.length; i++) {
    //     var orderDetails = new OrdersDetailsDTO(orderId, customerId, cartDB[i].id, cartDB[i].price, cartDB[i].qty, cartDB[i].total);
    //     orderDetailsDB.push(orderDetails);
    //
    //     for (let j = 0; j < itemDB.length; j++) {
    //         if (cartDB[i].id == itemDB[j].id) {
    //             (itemDB[j].qty) = (+itemDB[j].qty) - (+cartDB[i].qty);
    //         }
    //     }
    // }
    // cartDB.splice(0, cartDB.length);
    clearInputFeilds();

}

function clearInputFeilds() {
    $("#exampleInputItem_Id_1").val(null);
    $("#exampleInputItem_Price").val(null);
    $("#exampleInputItem_QTyOnHand").val(null);

    $("#exampleInputTotal_price").val(null);
    $("#exampleInputCash").val(null);

    $("#exampleInputCustomerID").val(null);
}

function generateOrderId() {
    if (orderDB.length == 0) {
        let startOrderNumber = "O-001";
        $("#orderId").val(startOrderNumber);
    } else (orderDB.length != 0)
    {
        let num = orderDB.length + 1;
        if (num < 9) {
            let pre_num = "O-00"
            $("#orderId").val(pre_num + (+num));
        } else if (num < 99) {
            let pre_num = "O-0"
            $("#orderId").val(pre_num + (+num));
        } else {
            let pre_num = "O-"
            $("#orderId").val(pre_num + (+num));
        }
    }

}

function loadAllOrderIntoTable() {
    $("#order_table").empty();
    for (var i of cartDB) {
        /*create a html row*/
        let row = "<tr><td>" + i.id + "</td><td>" + i.name + "</td><td>" + i.price + "</td><td>" + i.qty + "</td><td>" + i.total + "</td></tr>";
        //set the row
        $("#order_table").append(row);
    }
}

$("#save_order").click(function () {
    getOrderData();
    loadAllOrderIntoTable();
});
