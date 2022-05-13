import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet(urlPatterns = "/item")
public class ItemServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String itemId = req.getParameter("itemId"); // name value from the input field
        String itemName = req.getParameter("itemName");
        String itemPrice = req.getParameter("itemPrice");
        String itemQTY = req.getParameter("itemQTY");

        PrintWriter writer = resp.getWriter();
        resp.setContentType("application/json");
        try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234");

            PreparedStatement pstm = connection.prepareStatement("Insert into Item values(?,?,?,?)");
            pstm.setObject(1, itemId);
            pstm.setObject(2, itemName);
            pstm.setObject(3, itemPrice);
            pstm.setObject(4, itemQTY);

            if (pstm.executeUpdate() > 0) {
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);//201
                response.add("status", 200);
                response.add("message", "Successfully Added");
                response.add("data", "");
                writer.print(response.build());
            }

        } catch (ClassNotFoundException e) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", e.getLocalizedMessage());
            writer.print(response.build());

            resp.setStatus(HttpServletResponse.SC_OK); //200
            e.printStackTrace();
        } catch (SQLException throwables) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", throwables.getLocalizedMessage());
            writer.print(response.build());

            resp.setStatus(HttpServletResponse.SC_OK); //200
            throwables.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            String option = req.getParameter("option");
            //The Media Type of the Content of the response
            resp.setContentType("application/json");
            //Initialize the connection
            Class.forName("com.mysql.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/JavaEE_POS", "root", "1234");
            PrintWriter writer = resp.getWriter();

            switch (option) {
                case "SEARCH":
                    PreparedStatement pstm = connection.prepareStatement("select * from Item where itemName=?");
                    String itemName = req.getParameter("searchItemName");
                    pstm.setObject(1, itemName);
                    ResultSet rst1 = pstm.executeQuery();
                    JsonObjectBuilder objectBuilder1 = Json.createObjectBuilder();

                    if(rst1.next()){
                        String id = rst1.getString(1);
                        String name = rst1.getString(2);
                        String price = rst1.getString(3);
                        String qty = rst1.getString(4);

                        objectBuilder1.add("id", id);
                        objectBuilder1.add("name", name);
                        objectBuilder1.add("price", price);
                        objectBuilder1.add("qty", qty);
                    }
                    JsonObjectBuilder response1 = Json.createObjectBuilder();
                    response1.add("status", 200);
                    response1.add("message", "Done");
                    response1.add("data", objectBuilder1.build());
                    writer.print(response1.build());
                    break;

                case "GETALL":
                    ResultSet rst = connection.prepareStatement("select * from Item").executeQuery();

                    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder(); // json array

                    // Access the records and generate a json object
                    while (rst.next()) {
                        String id = rst.getString(1);
                        String name = rst.getString(2);
                        String price = rst.getString(3);
                        String qty = rst.getString(4);

                        //{ id:C001,name:Kasun,address:Galle,salary:1000 }
                        //Create a json object and store values
                        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                        objectBuilder.add("id", id);
                        objectBuilder.add("name", name);
                        objectBuilder.add("price", price);
                        objectBuilder.add("qty", qty);

                        // add the json object to the json array
                        arrayBuilder.add(objectBuilder.build());
                    }
                    //Generate a custom response with json
                    JsonObjectBuilder response = Json.createObjectBuilder();
                    response.add("status", 200);
                    response.add("message", "Done");
                    response.add("data", arrayBuilder.build());
                    writer.print(response.build());
                    break;
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPut(req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doDelete(req, resp);
    }

}
