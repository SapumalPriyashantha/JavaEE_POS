$("#customer").click(function () {
    $("#second_row").css("display", "none");
    $("#third_row").css("display", "none");
    $("#first_row").css("display", "block");
})
$("#item").click(function () {
    $("#first_row").css("display", "none");
    $("#third_row").css("display", "none");
    $("#second_row").css("display", "block");
})
$("#order").click(function () {
    $("#first_row").css("display", "none");
    $("#second_row").css("display", "none");
    $("#third_row").css("display", "block");

    addCustomerdataIntodropDown();
    addItemDataIntodropDown();
    generateOrderId();
})

