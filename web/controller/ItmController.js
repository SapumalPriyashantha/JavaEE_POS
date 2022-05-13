$("#exampleInputItemId_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Enter") {
        $("#exampleInputItemName_1").focus();
    }
});

$("#exampleInputItemName_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Enter") {
        $("#exampleInputItemPrice_1").focus();
    }
});

$("#exampleInputItemPrice_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Enter") {
        $("#exampleInputItemQuantity_1").focus();
    }
});


$("#exampleInputItemQuantity_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Enter") {

        $("#item_Table>tr").off("click");
        //focus first input field
        $("#exampleInputItemId_1").focus();

        getItemData();

        clearItemInputFeild();

        clickItemTableRowAndGetdata();
    }
});

$('#exampleInputItemId_1,#exampleInputItemName_1,#exampleInputItemPrice_1,#exampleInputItemQuantity_1').on('keyup', function () {
    allItemsValidation();
});

$("#btn_item_save").click(function () {
    $("#item_Table>tr").off("click");
    //focus first input field
    $("#exampleInputItemId_1").focus();

    getItemData();


    clearItemInputFeild();

    clickItemTableRowAndGetdata();

});

function getItemData() {
    var data = $("#itemForm").serialize(); // return query string of form with name:type-value
    $.ajax({
        url: "item",
        method: "POST",
        data: data,// if we send data with the request
        success: function (res) {
            if (res.status == 200) {
                alert(res.message);
                loadAllItemsIntoTable();
                clearCustomerInputFeild();
            } else {
                alert(res.data);
            }

        },
        error: function (ob, textStatus, error) {
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }
    })
}

loadAllItemsIntoTable();

function loadAllItemsIntoTable() {
    $("#item_Table").empty();
    $.ajax({
        url: "item?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const item of resp.data) {
                let row = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td><td>${item.qty}</td></tr>`;
                $("#item_Table").append(row);
            }
            clickItemTableRowAndGetdata();
        }
    });
}

$("#btnSearchItem").click(function () {
    var searchItemName = $("#txtSearchItem").val();

    $.ajax({
        url: "item?option=SEARCH&searchItemName="+searchItemName,
        method: "GET",

        // dataType:"json", // please convert the response into JSON
        success: function (res) {
            if (res.status == 200) {
                $("#exampleInputItemId_1").val(res.data.id);
                $("#exampleInputItemName_1").val(res.data.name);
                $("#exampleInputItemPrice_1").val(res.data.price);
                $("#exampleInputItemQuantity_1").val(res.data.qty);
            } else {
                alert(res.data);
            }

        },
        error: function (ob, textStatus, error) {
            console.log(ob);
            console.log(textStatus);
            console.log(error);
        }
    });
});

$("#btn_item_delete").click(function () {
    let itemId = $("#exampleInputItemId_1").val();

    $.ajax({
        url: "item?ItemId=" + itemId,// viya query string
        method: "DELETE",
        //data:data,// application/x-www-form-urlencoded
        success: function (res) {
            if (res.status == 200) {
                alert(res.message);
                loadAllItemsIntoTable();
                clearItemInputFeild();
            } else if (res.status == 400) {
                alert(res.data);
            } else {
                alert(res.data);
            }

        },
        error: function (ob, status, t) {
            console.log(ob);
            console.log(status);
            console.log(t);
        }
    });
});

$("#btn_item_update").click(function () {
    //creating a js object with relevant data which you wanna send to the server
    var itemOb = {
        id: $("#exampleInputItemId_1").val(),
        name: $("#exampleInputItemName_1").val(),
        price: $("#exampleInputItemPrice_1").val(),
        qty: $("#exampleInputItemQuantity_1").val(),
    }

    $.ajax({
        url: "item",
        method: "PUT",
        contentType: "application/json", //You should state request's content type using MIME types
        data: JSON.stringify(itemOb), // format js object to valid json string
        success: function (res) {
            if (res.status == 200) { // process is  ok
                alert(res.message);
                loadAllItemsIntoTable();
                clearItemInputFeild();
            } else if (res.status == 400) { // there is a problem with the client side
                alert(res.message);
            } else {
                alert(res.data); // else maybe there is an exception
            }
        },
        error: function (ob, errorStus) {
            console.log(ob); // other errors
        }
    });
});

function clearItemInputFeild() {
    $("#exampleInputItemId_1").val(null);
    $("#exampleInputItemName_1").val(null);
    $("#exampleInputItemPrice_1").val(null);
    $("#exampleInputItemQuantity_1").val(null);
}

function clickItemTableRowAndGetdata() {
    $("#item_Table>tr").off();

    $("#item_Table>tr").click(function () {

        let itemID_1 = $(this).children(":eq(0)").text(); // select first td and get text
        let itemName_1 = $(this).children(":eq(1)").text(); // select second td and get text
        let itemPrice_1 = $(this).children(":eq(2)").text(); // select third td and get text
        let itemQuantity_1 = $(this).children(":eq(3)").text(); // select fourth td and get text

        // set values for the input fields
        $("#exampleInputItemId_1").val(itemID_1);
        $("#exampleInputItemName_1").val(itemName_1);
        $("#exampleInputItemPrice_1").val(itemPrice_1);
        $("#exampleInputItemQuantity_1").val(itemQuantity_1);
    });
}

function allItemsValidation() {
    var regExItemID = /^(I-)[0-9]{3}$/;
    var regExItemName = /^[A-z ]{3,20}$/;
    var regExItemPrice = /^[0-9 ]{1,5}$/;
    var regExItemQty = /^[0-9]{1,5}$/;

    var itemID = $("#exampleInputItemId_1").val();
    if (regExItemID.test(itemID)) {
        $("#exampleInputItemId_1").css('border', '2px solid green');
        $("#error_4").text("");
        var itemName = $("#exampleInputItemName_1").val();
        if (regExItemName.test(itemName)) {
            $("#exampleInputItemName_1").css('border', '2px solid green');
            $("#error_5").text("");
            var itemPrice = $("#exampleInputItemPrice_1").val();
            if (regExItemPrice.test(itemPrice)) {
                $("#exampleInputItemPrice_1").css('border', '2px solid green');
                $("#error_6").text("");
                var itemQty = $("#exampleInputItemQuantity_1").val();
                if (regExItemQty.test(itemQty)) {
                    $("#exampleInputItemQuantity_1").css('border', '2px solid green');
                    $("#error_7").text("");
                    // $("#btn_item_save").attr('disabled', false);
                    return true;
                } else {
                    $("#exampleInputItemQuantity_1").css('border', '2px solid red');
                    $("#error_7").text("Wrong format : xxxx");
                    return false;
                }
            } else {
                $("#exampleInputItemPrice_1").css('border', '2px solid red');
                $("#error_6").text("Wrong format : xxxx");
                return false;
            }
        } else {
            $("#exampleInputItemName_1").css('border', '2px solid red');
            $("#error_5").text("Wrong format : xxxxx");
            return false;
        }
    } else {
        $("#exampleInputItemId_1").css('border', '2px solid red');
        $("#error_4").text("Wrong format : I-001");
        return false;
    }
}

function setItemButton() {
    let b = allItemsValidation();
    if (b) {
        $("#btn_item_save").attr('disabled', false);
    } else {
        $("#btn_item_save").attr('disabled', true);
    }
}