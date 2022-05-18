import javafx.scene.control.Alert;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/order")
public class OrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();
        String orderId = jsonObject.getString("orderId");
        String date = jsonObject.getString("date");
        String customerId = jsonObject.getString("customerId");
        String total = jsonObject.getString("orderTotal");
        String cartDb = jsonObject.getString("cartDb");
        PrintWriter writer = resp.getWriter();

        resp.setContentType("application/json");

//        Connection con=null;
//        try {
//            con= DbConnection.getInstance().getConnection();
//            con.setAutoCommit(false);
//            PreparedStatement stm =con.
//                    prepareStatement("INSERT INTO CustomerOrder VALUES(?,?,?,?,?,?,?)");
//
//
//            stm.setObject(1, customerOrder.getCustomerOrderID());
//            stm.setObject(2, customerOrder.getCustomerOrderDate());
//            stm.setObject(3, customerOrder.getCustomerOrderDeliveryDate());
//            stm.setObject(4, customerOrder.getCustomerId());
//            stm.setObject(5, customerOrder.getTotalCost());
//            stm.setObject(6, customerOrder.getTotalDiscount());
//            stm.setObject(7, customerOrder.getStatus());
//
//            if (stm.executeUpdate() > 0){
//
//                if (saveOrderDetail(customerOrder.getCustomerOrderID(), customerOrder.getItems())){
//                    con.commit();
//                    return true;
//                }else{
//                    con.rollback();
//                    return false;
//                }
//            }else{
//                con.rollback();
//                return false;
//            }
//
//        } catch (SQLException throwables) {
//            throwables.printStackTrace();
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//        }finally {
//            try {
//
//                con.setAutoCommit(true);
//
//            } catch (SQLException throwables) {
//                throwables.printStackTrace();
//            }
//        }
//
//        return false;

        try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234");

//            connection.setAutoCommit(false);

            PreparedStatement pstm = connection.prepareStatement("Insert into Orders values(?,?,?,?)");
            pstm.setObject(1, orderId);
            pstm.setObject(2, date);
            pstm.setObject(3, customerId);
            pstm.setObject(3, total);

            if (pstm.executeUpdate() > 0) {
                new Alert(Alert.AlertType.CONFIRMATION, "Success").show();
//                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
//                objectBuilder.add("status", 200);
//                objectBuilder.add("message", "Successfully Updated");
//                objectBuilder.add("data", "");
//                writer.print(objectBuilder.build());
                 for (int i = 0; i < cartDb.length(); i++) {
//                     var orderDetails = new OrdersDetailsDTO(orderId, customerId, cartDB[i].id, cartDB[i].price, cartDB[i].qty, cartDB[i].total);
//                     orderDetailsDB.push(orderDetails);
//
//                     for (let j = 0; j < itemDB.length; j++) {
//                         if (cartDB[i].id == itemDB[j].id) {
//                             (itemDB[j].qty) = (+itemDB[j].qty) - (+cartDB[i].qty);
//                         }
//                     }
//                     System.out.println(cartDb[i].id);
                 }

//                if (saveOrderDetail(customerOrder.getCustomerOrderID(), customerOrder.getItems())){
//                    con.commit();
//                    return true;
//                }else{
//                    con.rollback();
//                    return false;
//                }
            } else {
//                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
//                objectBuilder.add("status", 400);
//                objectBuilder.add("message", "Update Failed");
//                objectBuilder.add("data", "");
//                writer.print(objectBuilder.build());
            }

        } catch (ClassNotFoundException e) {
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            objectBuilder.add("status", 500);
            objectBuilder.add("message", "Update Failed");
            objectBuilder.add("data", e.getLocalizedMessage());
            writer.print(objectBuilder.build());
        } catch (SQLException throwables) {
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            objectBuilder.add("status", 500);
            objectBuilder.add("message", "Update Failed");
            objectBuilder.add("data", throwables.getLocalizedMessage());
            writer.print(objectBuilder.build());
        }
    }
}
