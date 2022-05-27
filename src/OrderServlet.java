import classes.OrderDetailsDTO;
import com.sun.org.apache.xalan.internal.xsltc.trax.XSLTCSource;
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
        System.out.println(date);
        String customerId = jsonObject.getString("customerId");
        String total = jsonObject.getString("orderTotal");

        JsonArray cartDb = jsonObject.getJsonArray("cartDb");

        PrintWriter writer = resp.getWriter();

        ArrayList<OrderDetailsDTO> OrderDTO = new ArrayList<OrderDetailsDTO>();

        for (JsonValue cart : cartDb) {

            OrderDTO.add(new OrderDetailsDTO(cart.asJsonObject().getString("id"), cart.asJsonObject().getString("name"),
                    cart.asJsonObject().getString("price"), cart.asJsonObject().getInt("qty"),
                    cart.asJsonObject().getInt("total")));
        }

        resp.setContentType("application/json");

        Connection connection=null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234");

            connection.setAutoCommit(false);

            PreparedStatement pstm = connection.prepareStatement("Insert into Orders values(?,?,?,?)");
            pstm.setObject(1, orderId);
            pstm.setObject(2, date);
            pstm.setObject(3, customerId);
            pstm.setObject(4, total);

            if (pstm.executeUpdate() > 0) {

                if (saveOrderDetail(connection,orderId, customerId, OrderDTO)) {
                    connection.commit();
                    connection.setAutoCommit(true);

                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("status", 200);
                objectBuilder.add("data", "");
                objectBuilder.add("message", "Successfully Order Add");
                writer.print(objectBuilder.build());

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
        }
    }

    private boolean saveOrderDetail(Connection connection, String orderId, String customerId, ArrayList<OrderDetailsDTO> orderDTO) throws SQLException {
        for (OrderDetailsDTO temp : orderDTO
        ) {
            PreparedStatement stm =connection.
                    prepareStatement("INSERT INTO OrderDetails VALUES(?,?,?,?,?,?)");
            stm.setObject(1, orderId);
            stm.setObject(2, customerId);
            stm.setObject(3, temp.getItemId());
            stm.setObject(4, temp.getItemPrice());
            stm.setObject(5, temp.getQty());
            stm.setObject(6, temp.getTotal());
            if (stm.executeUpdate() > 0) {

                if (updateQty(connection,temp.getItemId(), temp.getQty())){

                }else{
                    return false;
                }

            } else {
                return false;
            }
        }
        return true;
    }

    private boolean updateQty(Connection connection, String itemId, int qty) throws SQLException {
        PreparedStatement stm = connection.prepareStatement
                        ("UPDATE Item SET itemQTY=(itemQTY-" + qty
                                + ") WHERE itemId='" + itemId + "'");
        return stm.executeUpdate()>0;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        try {
            Class.forName("com.mysql.jdbc.Driver");
        ResultSet rst = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234")
                .prepareStatement("SELECT orderId FROM Orders ORDER BY orderId DESC LIMIT 1").executeQuery();

            PrintWriter writer = resp.getWriter();
            JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
            String date;

        if (rst.next()){
            int tempId = Integer.
                    parseInt(rst.getString(1).split("-")[1]);
            tempId=tempId+1;
            if (tempId<=9){
                date = "O-00"+tempId;

                objectBuilder.add("status", 200);
                objectBuilder.add("data", date);
                writer.print(objectBuilder.build());
            }else if(tempId<=99){
                date = "O-0"+tempId;
                objectBuilder.add("status", 200);
                objectBuilder.add("data", date);
                writer.print(objectBuilder.build());
            }else{
                date = "O-"+tempId;
                objectBuilder.add("status", 200);
                objectBuilder.add("data", date);
                writer.print(objectBuilder.build());
            }

        }else{
            date = "O-001";
            objectBuilder.add("status", 200);
            objectBuilder.add("data", date);
            writer.print(objectBuilder.build());
        }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
}
