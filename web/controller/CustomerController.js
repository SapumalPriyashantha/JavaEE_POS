//customer
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

        loadAllCustomersIntoTable();

        clearCustomerInputFeild();

        clickCustomerTableRowAndGetdata();

    }
});

$("#btn_custoomer_save").click(function () {
    //Disable previously tr binded function

    $("#customer_Table>tr").off("click");

    $("#exampleInputCustomerId_1").focus();

    getCustomerData();

    loadAllCustomersIntoTable();

    clearCustomerInputFeild();

    clickCustomerTableRowAndGetdata();

});

// $('#exampleInputCustomerId_1,#exampleInputCustomerName_1,#exampleInputCustomerAddress_1').on('keyup', function () {
//     allCustomersValidation();
// });

function getCustomerData() {
        var data = $("#customerForm").serialize(); // return query string of form with name:type-value
        $.ajax({
            url: "customer",
            method: "POST",
            data: data,// if we send data with the request
            success: function (res) {
                if (res.status == 200) {
                    alert(res.message);
                    // loadAllCustomers();
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

// function loadAllCustomersIntoTable() {
//     $("#customer_Table").empty();
//     for (var i of customerDB) {
//         /*create a html row*/
//         let row = "<tr><td>" + i.id + "</td><td>" + i.name + "</td><td>" + i.address + "</td></tr>";
//         //set the row
//         $("#customer_Table").append(row);
//     }
// }

// $("#btnSearchCustomer").click(function () {
//     var searchID = $("#txtSearchCustomer").val();
//
//     var response = searchCustomer(searchID);
//     if (response) {
//         $("#exampleInputCustomerId_1").val(response.id);
//         $("#exampleInputCustomerName_1").val(response.name);
//         $("#exampleInputCustomerAddress_1").val(response.address);
//     } else {
//         clearCustomerInputFeild();
//         alert("No Such a Customer");
//     }
// });

// function searchCustomer(id) {
//     for (let i = 0; i < customerDB.length; i++) {
//         if (customerDB[i].id == id) {
//             return customerDB[i];
//         }
//     }
// }

$("#btn_customer_update").click(function () {
    let custId = $("#exampleInputCustomerId_1").val(); //get first input field value
    let custName = $("#exampleInputCustomerName_1").val(); //get second input field value
    let custAdress = $("#exampleInputCustomerAddress_1").val(); //get third input field value

    var customer = new CustomerDTO(custId, custName, custAdress);

    for (let i = 0; i < customerDB.length; i++) {

        if (customerDB[i].id == customer.id) {
            customerDB[i].id = customer.id;
            customerDB[i].name = customer.name;
            customerDB[i].address = customer.address;

            clearCustomerInputFeild();
            loadAllCustomersIntoTable();
            $("#txtSearchCustomer").val(null);
            alert("updated customer");
        }
    }

});

$("#btn_delete").click(function () {
    let custId = $("#exampleInputCustomerId_1").val();

    for (let i = 0; i < customerDB.length; i++) {

        if (customerDB[i].id == custId) {
            customerDB.splice(i, 1);
            $("#txtSearchCustomer").val(null);
            loadAllCustomersIntoTable();
            clearCustomerInputFeild();
        }
    }
});

function clearCustomerInputFeild() {
    //clear the previous text in input filed
    $("#exampleInputCustomerId_1").val(null);
    $("#exampleInputCustomerName_1").val(null);
    $("#exampleInputCustomerAddress_1").val(null);

}

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