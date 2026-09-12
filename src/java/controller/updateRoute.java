/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.HibernateUtil;
import hibernate.Route;
import hibernate.Station;
import hibernate.Train;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
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
@WebServlet(name = "updateRoute", urlPatterns = {"/updateRoute"})
public class updateRoute extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        // Extract fields from JSON
        String idStr = requestJson.get("id").getAsString();
        String routeTitle = requestJson.get("routeTitle").getAsString();
        String modalTrain = requestJson.get("modalTrain").getAsString();
        String sourceStation = requestJson.get("sourceStation").getAsString();
        String destinationStation = requestJson.get("destinationStation").getAsString();
        String arrivalTime = requestJson.get("arrival_time").getAsString();
        String departureTime = requestJson.get("departure_time").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        try {
            // Validate session
            if (request.getSession().getAttribute("admin") == null) {
                responseJson.addProperty("message", "Please sign in!");
            } // Validate inputs
            else if (routeTitle.isEmpty()) {
                responseJson.addProperty("message", "Please enter Route Title!");
            } else if ("0".equals(modalTrain)) {
                responseJson.addProperty("message", "Please select Train!");
            } else if ("0".equals(sourceStation)) {
                responseJson.addProperty("message", "Please select Source Station!");
            } else if ("0".equals(destinationStation)) {
                responseJson.addProperty("message", "Please select Destination Station!");
            } else if (arrivalTime.isEmpty() || departureTime.isEmpty()) {
                responseJson.addProperty("message", "Please enter Arrival and Departure times!");
            } else {

                Admin admin = (Admin) request.getSession().getAttribute("admin");
                Criteria c1 = s.createCriteria(Admin.class);
                c1.add(Restrictions.eq("email", admin.getEmail()));
                Admin a1 = (Admin) c1.uniqueResult();

                Train train = (Train) s.get(Train.class, Integer.parseInt(modalTrain));
                Station source = (Station) s.get(Station.class, Integer.parseInt(sourceStation));
                Station dest = (Station) s.get(Station.class, Integer.parseInt(destinationStation));

                // For LocalTime field (arrival_time)
                LocalTime localArrivalTime = LocalTime.parse(arrivalTime, formatter);
                LocalTime departuteTime = LocalTime.parse(departureTime, formatter);

                // For Date field with @Temporal(TemporalType.TIMESTAMP) (departure_time)
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
                Date arrivalDate = sdf.parse(arrivalTime);
                Date departureDate = sdf.parse(departureTime);

                Route route = (Route) s.get(Route.class, Integer.parseInt(idStr));
                if (route == null) {
                    responseJson.addProperty("message", "Route not found!");
                } else {
                    route.setTitile(routeTitle);
                    route.setSource_id(source);
                    route.setDestination_id(dest);
                    route.setDeparture_time(departureDate);
                    route.setArrival_time(arrivalDate);
                    route.setTrain_id(train);
                    route.setAdmin_id(a1);

                    s.beginTransaction();
                    s.update(route);
                    s.getTransaction().commit();

                    responseJson.addProperty("status", true);
                    responseJson.addProperty("message", "Route updated successfully!");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("message", "Error: " + e.getMessage());
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
