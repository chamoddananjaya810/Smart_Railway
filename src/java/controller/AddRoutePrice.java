/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import static com.sun.corba.se.spi.presentation.rmi.StubAdapter.request;
import hibernate.Admin;
import hibernate.HibernateUtil;
import hibernate.Route;
import hibernate.RoutePrice;
import hibernate.Station;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AddRoutePrice", urlPatterns = {"/AddRoutePrice"})
public class AddRoutePrice extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       Gson gson = new Gson();
        JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        // Read JSON fields
        String fromStation = requestJson.get("fromStation").getAsString();
        String toStation = requestJson.get("toStation").getAsString();
        String trainRoutes = requestJson.get("trainRoutes").getAsString();
        String firstClassPrice = requestJson.get("firstClassPrice").getAsString();
        String secondClassPrice = requestJson.get("secondClassPrice").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        // Check admin session
        if (request.getSession().getAttribute("admin") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (fromStation.isEmpty() || "0".equals(fromStation)) {
            responseJson.addProperty("message", "Please select a valid From Station!");
        } else if (toStation.isEmpty() || "0".equals(toStation)) {
            responseJson.addProperty("message", "Please select a valid To Station!");
        } else if (trainRoutes.isEmpty() || "0".equals(trainRoutes)) {
            responseJson.addProperty("message", "Please select a valid Train Route!");
        } else if (firstClassPrice.isEmpty()) {
            responseJson.addProperty("message", "Please enter First Class Price!");
        } else if (secondClassPrice.isEmpty()) {
            responseJson.addProperty("message", "Please enter Second Class Price!");
        } else {

            // Get admin from session
            Admin admin = (Admin) request.getSession().getAttribute("admin");
            Criteria c1 = s.createCriteria(Admin.class);
            c1.add(Restrictions.eq("email", admin.getEmail()));
            Admin a1 = (Admin) c1.uniqueResult();

            // Load related entities
            Route route = (Route) s.get(Route.class, Integer.parseInt(trainRoutes));
            Station from = (Station) s.get(Station.class, Integer.parseInt(fromStation));
            Station to = (Station) s.get(Station.class, Integer.parseInt(toStation));
      

            // Create and save RoutePrice object
            RoutePrice rp = new RoutePrice();
            rp.setTrain_routes_id(route);
            rp.setFrom(from);
            rp.setTo(to);
            rp.setFirst_class_price(Double.parseDouble(firstClassPrice));
            rp.setSecond_class_price(Double.parseDouble(secondClassPrice));
            rp.setAdmin_id(a1);

            s.beginTransaction();
            s.save(rp);
            s.getTransaction().commit();

            responseJson.addProperty("status", true);
            responseJson.addProperty("message", "Route Price saved successfully!");
               s.close();
        }

        // Send response
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
     
    }
    

     

}
