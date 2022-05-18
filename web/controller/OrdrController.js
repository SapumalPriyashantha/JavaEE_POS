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