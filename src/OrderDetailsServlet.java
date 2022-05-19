import classes.OrderDetailsDTO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(urlPatterns = "/orderDetails")
public class OrderDetailsServlet  extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPost(req, resp);
    }

    public boolean saveOrderDetail(String orderId, String customerId, ArrayList<OrderDetailsDTO> orderDTO) throws ClassNotFoundException, SQLException {
        for (OrderDetailsDTO temp : orderDTO) {
            Class.forName("com.mysql.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234");

            PreparedStatement pstm = connection.prepareStatement("Insert into OrderDetails values(?,?,?,?,?,?)");
            pstm.setObject(1, orderId);
            pstm.setObject(2, customerId);
            pstm.setObject(3, temp.getItemId());
            pstm.setObject(4, temp.getItemPrice());
            pstm.setObject(5, temp.getQty());
            pstm.setObject(6, temp.getTotal());
            if (pstm.executeUpdate() > 0) {
                ItemServlet itemServlet = new ItemServlet();
                if(itemServlet.updateItem(temp.getItemId(),temp.getQty())){

                }else {
                    return false;
                }

            } else {
                return false;
            }
        }
        return true;
    }
}
