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
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AddStationSchedule", urlPatterns = {"/AddStationSchedule"})
public class AddStationSchedule extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject station = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);
        System.out.println("step 1");

        String routeId = station.get("route").getAsString();
        String station_id = station.get("station_id").getAsString();
        String stop_platform = station.get("stop_platform").getAsString();
        String arrival_time = station.get("arrival_time").getAsString();
        String departure_time = station.get("departure_time").getAsString();

        System.out.println("Arrival Time: " + arrival_time);
        System.out.println("Departure Time: " + departure_time);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

// Parse with LocalTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        if (request.getSession().getAttribute("admin") == null) {
            responseJson.addProperty("message", "Please sign in!");

        } else if ("0".equals(routeId)) {
            responseJson.addProperty("message", "Please Select valid Train ID!");
        } else if ("0".equals(station_id)) {
            responseJson.addProperty("message", "Please Select valid Station ID!");
        } else if (stop_platform.isEmpty()) {
            responseJson.addProperty("message", "Please enter valid stop platform!");
        } else if (!Util.isInterger(stop_platform)) {
            responseJson.addProperty("message", "Please enter number valid stop platform!");
        } else if (arrival_time.isEmpty()) {
            responseJson.addProperty("message", "Please enter valid arrival time");
        } else if (departure_time.isEmpty()) {
            responseJson.addProperty("message", "Please Select valid departure time");
        } else {

            try {
                Admin admin = (Admin) request.getSession().getAttribute("admin");
                Route route = (Route) s.get(Route.class, Integer.parseInt(routeId));
                Station stationId = (Station) s.get(Station.class, Integer.parseInt(station_id));

                // For LocalTime field (arrival_time)
                LocalTime localArrivalTime = LocalTime.parse(arrival_time, formatter);
                LocalTime departuteTime = LocalTime.parse(departure_time, formatter);

                // For Date field with @Temporal(TemporalType.TIMESTAMP) (departure_time)
                SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
                Date arrivalDate = sdf.parse(arrival_time);
                Date departureDate = sdf.parse(departure_time);

                // Set to entity
                TrainStation t = new TrainStation();
                t.setTrain_routes_id(route);
                t.setStation_id(stationId);
                t.setArrival_time(arrivalDate);    // LocalTime directly
                t.setDeparture_time(departureDate);     // Date object
                t.setStop_platform(Integer.parseInt(stop_platform));

                s.save(t);
                s.beginTransaction().commit();
                responseJson.addProperty("status", true);
                responseJson.addProperty("message", "Schedule data received successfully");

            } catch (Exception e) {
                responseJson.addProperty("message", "Error saving schedule: " + e.getMessage());
            } finally {
                s.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(responseJson.toString());
        s.close();
    }

}
