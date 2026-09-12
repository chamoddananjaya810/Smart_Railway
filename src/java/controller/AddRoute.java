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
import hibernate.TrainStation;
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
import model.Util;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AddRoute", urlPatterns = {"/AddRoute"})
public class AddRoute extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject station = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);
        System.out.println("step 1");

        String routeTitle = station.get("routeTitle").getAsString();
        String modalTrain = station.get("modalTrain").getAsString();
        String sourceStation = station.get("sourceStation").getAsString();
        String destinationStation = station.get("destinationStation").getAsString();
        String arrival_time = station.get("arrival_time").getAsString();
        String departure_time = station.get("departure_time").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

// Parse with LocalTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        if (request.getSession().getAttribute("admin") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (routeTitle.isEmpty()) {
            responseJson.addProperty("message", "Please enter route!");

        } else if ("0".equals(modalTrain)) {
            responseJson.addProperty("message", "Please Select valid Train");
        } else if ("0".equals(sourceStation)) {
            responseJson.addProperty("message", "Please Select valid Station Sourse!");

        } else if ("0".equals(destinationStation)) {
            responseJson.addProperty("message", "Please Select valid Destination Station !");

        } else if (arrival_time.isEmpty()) {
            responseJson.addProperty("message", "Please enter valid arrival time");
        } else if (departure_time.isEmpty()) {
            responseJson.addProperty("message", "Please Select valid departure time");
        } else {

            try {
                Admin admin = (Admin) request.getSession().getAttribute("admin");
                Train trian = (Train) s.get(Train.class, Integer.parseInt(modalTrain));
                Station sourceSt = (Station) s.get(Station.class, Integer.parseInt(sourceStation));
                Station destinationst = (Station) s.get(Station.class, Integer.parseInt(destinationStation));

                // For LocalTime field (arrival_time)
                LocalTime localArrivalTime = LocalTime.parse(arrival_time, formatter);
                LocalTime departuteTime = LocalTime.parse(departure_time, formatter);

                // For Date field with @Temporal(TemporalType.TIMESTAMP) (departure_time)
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
                Date arrivalDate = sdf.parse(arrival_time);
                Date departureDate = sdf.parse(departure_time);

                // Set to entity
                Route r = new Route();
                r.setTitile(routeTitle);
                r.setTrain_id(trian);
                  r.setSource_id(sourceSt);
                  r.setDestination_id(destinationst);
                  
                r.setArrival_time(arrivalDate);    // LocalTime directly
                r.setDeparture_time(departureDate);     // Date object
              r.setAdmin_id(admin);

                s.save(r);
                s.beginTransaction().commit();
                responseJson.addProperty("status", true);
                responseJson.addProperty("message", "Route data received successfully");

            } catch (Exception e) {
                responseJson.addProperty("message", "Error saving schedule: " + e.getMessage());
            } finally {
                s.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(responseJson.toString());
    }

}
