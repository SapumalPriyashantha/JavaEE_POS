function addCustomerdataIntodropDown() {
    $("#dropdown_customer").empty();
    $("#dropdown_customer").append('<option>' + 'Select Customer' + '</option>');
    $.ajax({
        url: "customer?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const customer of resp.data) {
                $("#dropdown_customer").append('<option>' + customer.name + '</option>');
            }
        }
    });
}

function addItemDataIntodropDown() {
    $("#dropdown_item").empty();
    $("#dropdown_item").append('<option>' + 'Select Item' + '</option>');
    $.ajax({
        url: "item?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const item of resp.data) {
                $("#dropdown_item").append('<option>' + item.name + '</option>');
            }
        }
    });

}

$("#dropdown_customer").click(function () {
    var name = $('#dropdown_customer option:selected').text();
    $.ajax({
        url: "customer?option=SEARCH&searchCustomerName="+name,
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            $("#exampleInputCustomerID").val(resp.data.id);
        }
    });

});

$("#dropdown_item").click(function () {
    let item_name = $('#dropdown_item option:selected').text();
    $.ajax({
        url: "item?option=SEARCH&searchItemName="+item_name,
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            $("#exampleInputItem_Id_1").val(resp.data.id);
            $("#exampleInputItem_Price").val(resp.data.price);
            $("#exampleInputItem_QTyOnHand").val(resp.data.qty);
        }
    });

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
            var cart = new CartDTO(item_id, item_name, item_price, +item_qty, item_total);
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

function clearInputFeilds() {
    $("#exampleInputItem_Id_1").val(null);
    $("#exampleInputItem_Price").val(null);
    $("#exampleInputItem_QTyOnHand").val(null);
    $("#exampleInputOrder_QTy").val(null);

    $("#exampleInputTotal_price").val(null);
    $("#exampleInputCash").val(null);
    $("#exampleInputRemaining").val(null);

    $("#exampleInputCustomerID").val(null);
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

function placeOrder() {
    var orderOb = {
        orderId: $("#orderId").val(),
        date: $("#datepicker").val(),
        customerId: $("#exampleInputCustomerID").val(),
        orderTotal:$("#exampleInputTotal_price").val(),
        cartDb:cartDB,
    }

    $.ajax({
        url: "order",
        method: "POST",
        contentType: "application/json", //You should state request's content type using MIME types
        data: JSON.stringify(orderOb), // format js object to valid json string
        success: function (res) {
            if (res.status == 200) { // process is  ok
                alert(res.message);
                clearInputFeilds();
                generateOrderId();
                cartDB.splice(0, cartDB.length);
                $("#order_table").empty();
            }
        },
        error: function (ob, errorStus) {
            console.log(ob); // other errors
        }
    });
}

function generateOrderId() {
    $.ajax({
        url: "order",
        method: "GET",
        success: function (res) {
            if (res.status == 200) { // process is  ok
                $("#orderId").val(res.data);
                clearInputFeilds();
            }
        },
        error: function (ob, errorStus) {
            console.log(ob); // other errors
        }
    });

}
