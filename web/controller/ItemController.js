//item
$("#exampleInputItemId_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Shift") {
        $("#exampleInputItemName_1").focus();
    }
});

$("#exampleInputItemName_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Shift") {
        $("#exampleInputItemPrice_1").focus();
    }
});

$("#exampleInputItemPrice_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Shift") {
        $("#exampleInputItemQuantity_1").focus();
    }
});

$("#exampleInputItemQuantity_1").keydown(function (event) {
    setItemButton()
    if (event.key == "Shift") {

        $("#item_Table>tr").off("click");
        //focus first input field
        $("#exampleInputItemId_1").focus();

        getItemData();

        loadAllItemsIntoTable();

        clearItemInputFeild();

        clickItemTableRowAndGetdata();
    }
});

$("#btn_item_save").click(function () {
    $("#item_Table>tr").off("click");
    //focus first input field
    $("#exampleInputItemId_1").focus();

    getItemData();

    loadAllItemsIntoTable();

    clearItemInputFeild();

    clickItemTableRowAndGetdata();

});

$('#exampleInputItemId_1,#exampleInputItemName_1,#exampleInputItemPrice_1,#exampleInputItemQuantity_1').on('keyup', function () {
    allItemsValidation();
});

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

function getItemData() {
    let itemID = $("#exampleInputItemId_1").val(); //get first input field value
    let itemName = $("#exampleInputItemName_1").val(); //get second input field value
    let itemPrice = $("#exampleInputItemPrice_1").val(); //get third input field value
    let itemQuantity = $("#exampleInputItemQuantity_1").val(); //get fouth input field value

    var item = new ItemDTO(itemID, itemName, itemPrice, itemQuantity);

    itemDB.push(item);
}

function loadAllItemsIntoTable() {
    $("#item_Table").empty();
    for (var i of itemDB) {
        /*create a html row*/
        let row = "<tr><td>" + i.id + "</td><td>" + i.name + "</td><td>" + i.price + "</td><td>" + i.qty + "</td></tr>";
        //set the row
        $("#item_Table").append(row);
    }
}

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

$("#btnSearchItem").click(function () {
    var searchItemID = $("#txtSearchItem").val();

    var response = searchItem(searchItemID);
    if (response) {
        $("#exampleInputItemId_1").val(response.id);
        $("#exampleInputItemName_1").val(response.name);
        $("#exampleInputItemPrice_1").val(response.price);
        $("#exampleInputItemQuantity_1").val(response.qty);
    } else {
        clearItemInputFeild();
        alert("No Such a Item");
    }
});

function searchItem(id) {
    for (let i = 0; i < itemDB.length; i++) {
        if (itemDB[i].id == id) {
            return itemDB[i];
        }
    }
}

$("#btn_item_update").click(function () {
    let itemId = $("#exampleInputItemId_1").val(); //get first input field value
    let itemName = $("#exampleInputItemName_1").val(); //get second input field value
    let itemPrice = $("#exampleInputItemPrice_1").val(); //get third input field value
    let itemQty = $("#exampleInputItemQuantity_1").val(); //get third input field value

    var item = new ItemDTO(itemId, itemName, itemPrice, itemQty);
    for (let i = 0; i < itemDB.length; i++) {

        if (itemDB[i].id == item.id) {
            itemDB[i].id = item.id;
            itemDB[i].name = item.name;
            itemDB[i].price = item.price;
            itemDB[i].qty = item.qty;

            clearItemInputFeild();
            loadAllItemsIntoTable();
            $("#txtSearchItem").val(null);
            alert("updated item");
        }
    }

});

$("#btn_item_delete").click(function () {
    let itemId = $("#exampleInputItemId_1").val();

    for (let i = 0; i < itemDB.length; i++) {

        if (itemDB[i].id == itemId) {
            itemDB.splice(i, 1);
            $("#txtSearchItem").val(null);
            loadAllItemsIntoTable();
            clearItemInputFeild();
        }
    }
});

function setItemButton() {
    let b = allItemsValidation();
    if (b) {
        $("#btn_item_save").attr('disabled', false);
    } else {
        $("#btn_item_save").attr('disabled', true);
    }
}