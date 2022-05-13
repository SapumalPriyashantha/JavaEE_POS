$("#exampleInputCustomerId_1").keydown(function (event) {
    setButton()
    if (event.key == "Enter") {
        $("#exampleInputCustomerName_1").focus();
    }
});

$("#exampleInputCustomerName_1").keydown(function (event) {
    setButton()
    if (event.key == "Enter") {
        $("#exampleInputCustomerAddress_1").focus();
    }
});

$("#exampleInputCustomerAddress_1").keydown(function (event) {
    setButton()
    if (event.key == "Enter") {

        //Disable previously tr binded function
        $("#customer_Table>tr").off("click");

        $("#exampleInputCustomerId_1").focus();

        getCustomerData();

        clearCustomerInputFeild();

        clickCustomerTableRowAndGetdata();

    }
});

$('#exampleInputCustomerId_1,#exampleInputCustomerName_1,#exampleInputCustomerAddress_1').on('keyup', function () {
    allCustomersValidation();
});

$("#btn_custoomer_save").click(function () {
    //Disable previously tr binded function

    $("#customer_Table>tr").off("click");

    $("#exampleInputCustomerId_1").focus();

    getCustomerData();

    clearCustomerInputFeild();

    clickCustomerTableRowAndGetdata();

});

function getCustomerData() {
        var data = $("#customerForm").serialize(); // return query string of form with name:type-value
        $.ajax({
            url: "customer",
            method: "POST",
            data: data,// if we send data with the request
            success: function (res) {
                if (res.status == 200) {
                    alert(res.message);
                    loadAllCustomersIntoTable();
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

loadAllCustomersIntoTable();

function loadAllCustomersIntoTable() {
    $("#customer_Table").empty();
    $.ajax({
        url: "customer?option=GETALL",
        method: "GET",
        // dataType:"json", // please convert the response into JSON
        success: function (resp) {
            for (const customer of resp.data) {
                let row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td></tr>`;
                $("#customer_Table").append(row);
            }
            clickCustomerTableRowAndGetdata();
        }
    });
}

$("#btnSearchCustomer").click(function () {
    var searchName = $("#txtSearchCustomer").val();
    $.ajax({
        url: "customer?option=SEARCH&searchCustomerName="+searchName,
        method: "GET",

        // dataType:"json", // please convert the response into JSON
        success: function (res) {
            if (res.status == 200) {
                $("#exampleInputCustomerId_1").val(res.data.id);
                $("#exampleInputCustomerName_1").val(res.data.name);
                $("#exampleInputCustomerAddress_1").val(res.data.address);
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

function clickCustomerTableRowAndGetdata() {

    $("#customer_Table>tr").off();

    $("#customer_Table>tr").click(function () {

        let custId_1 = $(this).children(":eq(0)").text(); // select first td and get text
        let custName_1 = $(this).children(":eq(1)").text(); // select second td and get text
        let custAdress_1 = $(this).children(":eq(2)").text(); // select third td and get text

        // set values for the input fields
        $("#exampleInputCustomerId_1").val(custId_1);
        $("#exampleInputCustomerName_1").val(custName_1);
        $("#exampleInputCustomerAddress_1").val(custAdress_1);
    });
}

$("#btn_delete").click(function () {
    let custId = $("#exampleInputCustomerId_1").val();

    $.ajax({
        url: "customer?CusID=" + custId,// viya query string
        method: "DELETE",
        //data:data,// application/x-www-form-urlencoded
        success: function (res) {
            if (res.status == 200) {
                alert(res.message);
                loadAllCustomersIntoTable();
                clearCustomerInputFeild();
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

$("#btn_customer_update").click(function () {
    //creating a js object with relevant data which you wanna send to the server
    var cusOb = {
        id: $("#exampleInputCustomerId_1").val(),
        name: $("#exampleInputCustomerName_1").val(),
        address: $("#exampleInputCustomerAddress_1").val(),
    }

    $.ajax({
        url: "customer",
        method: "PUT",
        contentType: "application/json", //You should state request's content type using MIME types
        data: JSON.stringify(cusOb), // format js object to valid json string
        success: function (res) {
            if (res.status == 200) { // process is  ok
                alert(res.message);
                loadAllCustomersIntoTable();
                clearCustomerInputFeild();
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

function clearCustomerInputFeild() {
    //clear the previous text in input filed
    $("#exampleInputCustomerId_1").val(null);
    $("#exampleInputCustomerName_1").val(null);
    $("#exampleInputCustomerAddress_1").val(null);

}

function allCustomersValidation() {
    var regExCusID = /^(C-)[0-9]{3}$/;
    var regExCusName = /^[A-z ]{3,20}$/;
    var regExCusAddress = /^[A-z0-9/ ]{6,30}$/;

    var cusID = $("#exampleInputCustomerId_1").val();
    if (regExCusID.test(cusID)) {
        $("#exampleInputCustomerId_1").css('border', '2px solid green');
        $("#error_1").text("");
        var cusName = $("#exampleInputCustomerName_1").val();
        if (regExCusName.test(cusName)) {
            $("#exampleInputCustomerName_1").css('border', '2px solid green');
            $("#error_2").text("");
            var cusAddress = $("#exampleInputCustomerAddress_1").val();
            if (regExCusAddress.test(cusAddress)) {
                $("#exampleInputCustomerAddress_1").css('border', '2px solid green');
                $("#error_3").text("");
                return true;
            } else {
                $("#exampleInputCustomerAddress_1").css('border', '2px solid red');
                $("#error_3").text("Wrong format : 2331/1B Colombo");
                return false;
            }
        } else {
            $("#exampleInputCustomerName_1").css('border', '2px solid red');
            $("#error_2").text("Wrong format : Kamal Perera");
            return false;
        }
    } else {
        $("#exampleInputCustomerId_1").css('border', '2px solid red');
        $("#error_1").text("Wrong format : C-001");
        return false;
    }
}

function setButton() {
    let b = allCustomersValidation();
    if (b) {
        $("#btn_custoomer_save").attr('disabled', false);
    } else {
        $("#btn_custoomer_save").attr('disabled', true);
    }
}