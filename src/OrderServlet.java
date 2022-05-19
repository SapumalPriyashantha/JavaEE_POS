import classes.OrderDetailsDTO;
import javafx.scene.control.Alert;

import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;

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

        JsonArray cartDb = jsonObject.getJsonArray("cartDb");

        PrintWriter writer = resp.getWriter();

        ArrayList<OrderDetailsDTO> OrderDTO = new ArrayList<OrderDetailsDTO>();

        for (JsonValue cart : cartDb) {

            OrderDTO.add(new OrderDetailsDTO(cart.asJsonObject().getString("id"), cart.asJsonObject().getString("name"),
                    cart.asJsonObject().getString("price"), cart.asJsonObject().getInt("qty"),
                    cart.asJsonObject().getInt("total")));

//            System.out.println(cart.asJsonObject().getString("id"));
//            System.out.println(cart.asJsonObject().getString("name"));
//            System.out.println(cart.asJsonObject().getString("price"));
//            System.out.println(cart.asJsonObject().getInt("qty"));
//            System.out.println(cart.asJsonObject().getInt("total"));
        }

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
        OrderDetailsServlet orderDetailsServlet = new OrderDetailsServlet();

        Connection connection=null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234");

            connection.setAutoCommit(false);

            PreparedStatement pstm = connection.prepareStatement("Insert into Orders values(?,?,?,?)");
            pstm.setObject(1, orderId);
            pstm.setObject(2, date);
            pstm.setObject(3, customerId);
            pstm.setObject(3, total);

            if (pstm.executeUpdate() > 0) {

                if (orderDetailsServlet.saveOrderDetail(orderId, customerId, OrderDTO)) {
                    connection.commit();
                } else {
                    connection.rollback();
                }
            } else {
                connection.rollback();
            }

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                connection.setAutoCommit(true);

                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("data", "");
                objectBuilder.add("message", "Successfully Added");
                writer.print(objectBuilder.build());

            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter writer = resp.getWriter();
        String date;
        try {
            Class.forName("com.mysql.jdbc.Driver");
        ResultSet rst = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234")
                .prepareStatement("SELECT orderId FROM Orders ORDER BY orderId DESC LIMIT 1").executeQuery();
        if (rst.next()){
            int tempId = Integer.
                    parseInt(rst.getString(1).split("-")[1]);
            tempId=tempId+1;
            if (tempId<9){
                date = "O-00"+tempId;
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("data", date);
                writer.print(objectBuilder.build());
            }else if(tempId<99){
                date = "O-0"+tempId;
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("data", date);
                writer.print(objectBuilder.build());
            }else{
                date = "O-"+tempId;
                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("data", date);
                writer.print(objectBuilder.build());
            }

        }else{
            date = "O-001";
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            objectBuilder.add("status", 200);
            objectBuilder.add("data", date);
            writer.print(objectBuilder.build());
        }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
}
