/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.SimpleStationPayment;
import hibernate.TrainStation;
import hibernate.TrainStationPrice;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "SimplePaymentCheckOut", urlPatterns = {"/SimplePaymentCheckOut"})
public class SimplePaymentCheckOut extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject paymentData = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        // Extract values from JSON
        String bookingDate = paymentData.get("booking_date").getAsString();
        String stationId = paymentData.get("station_id").getAsString();
        String priceId = paymentData.get("price_id").getAsString();
        String fromStation = paymentData.get("from_station").getAsString();
        String toStation = paymentData.get("to_station").getAsString();
        double trainStationPrice = paymentData.get("train_station_price").getAsDouble();
        int passengers = paymentData.get("passengers").getAsInt();
        double total = paymentData.get("total").getAsDouble();
        int paymentMethod = paymentData.get("payment_method").getAsInt();

        // Hibernate session
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // ===== Backend Validations =====
        if (request.getSession().getAttribute("user") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (bookingDate.isEmpty()) {
            responseJson.addProperty("message", "Please enter Booking Date!");
        } else {
            LocalDate today = LocalDate.now();
            LocalDate selectedDate = LocalDate.parse(bookingDate);
            if (selectedDate.isBefore(today)) {
                responseJson.addProperty("message", "Booking date cannot be in the past!");
            } else if ("0".equals(stationId)) {
                responseJson.addProperty("message", "Please select a valid Station!");
            } else if ("0".equals(priceId)) {
                responseJson.addProperty("message", "Please select a valid Price!");
            } else if (fromStation.trim().isEmpty()) {
                responseJson.addProperty("message", "From station is missing!");
            } else if (toStation.trim().isEmpty()) {
                responseJson.addProperty("message", "To station is missing!");
            } else if (trainStationPrice <= 0) {
                responseJson.addProperty("message", "Train station price must be greater than 0!");
            } else if (passengers <= 0) {
                responseJson.addProperty("message", "Passenger count must be greater than 0!");
            } else if (total <= 0) {
                responseJson.addProperty("message", "Total amount must be greater than 0!");
            } else if (paymentMethod <= 0) {
                responseJson.addProperty("message", "Invalid payment method!");
            } else {
                // All validations passed
                try {

                    System.out.println("bookingDate" + bookingDate);
                    System.out.println("stationId" + stationId);
                    System.out.println("priceId" + priceId);

                    System.out.println("passengers" + passengers);
                    System.out.println("total" + total);

                    // Get logged-in user
                    User user = (User) request.getSession().getAttribute("user");

                    // Get related Hibernate entities (adjust class names as per your DB model)
                    TrainStation station = (TrainStation) s.get(TrainStation.class, Integer.parseInt(stationId));
                    TrainStationPrice price= (TrainStationPrice) s.get(TrainStationPrice.class, Integer.parseInt(priceId));

                    // Parse booking date
                    Date booking_Date = new SimpleDateFormat("yyyy-MM-dd").parse(bookingDate);

                    // Create booking entity
                    SimpleStationPayment payment= new SimpleStationPayment();
                    payment.setDate(new Date()); // current date
                    payment.setPayment_date(booking_Date);
                    payment.setTrain_stations(station);
                    payment.setTrain_station_price(price);
                    payment.setPasenger(passengers);
//                    payment.setQr_code(priceId);
                    payment.setTotal(total);
                    payment.setTotal(total);
                    payment.setUser_id(user);
                  

                    // Save booking
                    s.beginTransaction();
                    s.save(payment);
                    s.getTransaction().commit();
                    responseJson.addProperty("status", true);
                    responseJson.addProperty("message", "Payment booking saved successfully!");

                } catch (Exception e) {
                    e.printStackTrace();
                    responseJson.addProperty("message", "Error saving booking: " + e.getMessage());
                }
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

}
