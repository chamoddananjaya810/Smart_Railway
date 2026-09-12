/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import hibernate.DaysOftravel;
import hibernate.HibernateUtil;
import hibernate.Route;
import hibernate.RoutePrice;
import hibernate.SmartBooking;
import hibernate.Speed;
import hibernate.Status;
import hibernate.Train;
import hibernate.TrainClass;
import hibernate.TrainType;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Mail;
import model.PayHere;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Projections;

import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "CheackOut", urlPatterns = {"/CheackOut"})
public class CheackOut extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject checkout = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);
        
        String travelDate = checkout.get("travel_date").getAsString();
        String classId = checkout.get("class_id").getAsString();
        int passengers = checkout.get("passengers").getAsInt();
        String description = checkout.get("description").getAsString();
        String trainRoutesId = checkout.get("train_routes_id").getAsString();
        String priceId = checkout.get("price_id").getAsString();
        double totalPrice = checkout.get("total_price").getAsDouble();
        String paymentMethod = checkout.get("payment_method").getAsString();
        
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        if (request.getSession().getAttribute("user") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (travelDate.isEmpty()) {
            responseJson.addProperty("message", "Please enter Travel Date!");
        } else {
            try {
                TrainClass trainClass = (TrainClass) s.get(TrainClass.class, Integer.parseInt(classId));
                Route rId = (Route) s.get(Route.class, Integer.parseInt(trainRoutesId));
                RoutePrice pId = (RoutePrice) s.get(RoutePrice.class, Integer.parseInt(priceId));
                
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                Date travel_Date = sdf.parse(travelDate);

                // ---- TOTAL PASSENGER CHECK ----
                Criteria criteria = s.createCriteria(SmartBooking.class)
                        .add(Restrictions.eq("travel_date", travel_Date))
                        .add(Restrictions.eq("class_id", trainClass))
                        .add(Restrictions.eq("train_routes_id", rId))
                        .setProjection(Projections.sum("passengers"));
                
                Long totalBooked = (Long) criteria.uniqueResult();
                if (totalBooked == null) {
                    totalBooked = 0L;
                }
                
                if (totalBooked + passengers > 20) {
                    responseJson.addProperty("message", "Booking limit reached for this class and date!");
                    s.close();
                    response.setContentType("application/json");
                    response.getWriter().write(gson.toJson(responseJson));
                    return; // Stop here
                }

                // ---- VALIDATIONS ----
                LocalDate today = LocalDate.now();
                LocalDate selectedDate = LocalDate.parse(travelDate);
                if (selectedDate.isBefore(today)) {
                    responseJson.addProperty("message", "Travel date cannot be in the past!");
                } else if ("0".equals(classId)) {
                    responseJson.addProperty("message", "Please select a valid Class!");
                } else if (passengers <= 0) {
                    responseJson.addProperty("message", "Passenger count must be greater than 0!");
                } else if (totalPrice <= 0) {
                    responseJson.addProperty("message", "Total Price must be greater than 0!");
                } else if (paymentMethod.isEmpty()) {
                    responseJson.addProperty("message", "Please select a Payment Method!");
                } else {
                    try {
                        // ---- STRIPE PAYMENT ----
                        double totalAmount = totalPrice;
                        long amountInCents = (long) (totalAmount * 100);
                        if (amountInCents < 50) {
                            amountInCents = 50;
                        }
                        
                        int orderId = 1400; // you can generate dynamically
                        Stripe.apiKey = "sk_test_51PLevYP1GdaOtmzh1GKZ8LeiXL5a5DyJb1QFarUfZKNKhZUwFwX1QBc7qEXdGyLz08Hs79nIoW7yEj1wWxGDrI1j00FT0oOwZn";
                        
                        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                                .setAmount(amountInCents)
                                .setCurrency("usd")
                                .putMetadata("order_id", String.valueOf(orderId))
                                .setDescription("Order #" + orderId)
                                .build();
                        
                        PaymentIntent paymentIntent = PaymentIntent.create(params);
                        
                        responseJson.addProperty("status", true);
                        responseJson.addProperty("clientSecret", paymentIntent.getClientSecret());
                        responseJson.addProperty("message", "Checkout completed, ready for payment!");
                    } catch (StripeException ex) {
                        Logger.getLogger(CheackOut.class.getName()).log(Level.SEVERE, null, ex);
                    }

                    // ---- SAVE BOOKING ----
                    User user = (User) request.getSession().getAttribute("user");
                    Criteria c1 = s.createCriteria(User.class);
                    c1.add(Restrictions.eq("email", user.getEmail()));
                    User uid = (User) c1.uniqueResult();
                    
                    LocalDate tDate = LocalDate.parse(travelDate, dateFormatter);
                    final String vf = Util.genaratecode();
                    
                    SmartBooking b = new SmartBooking();
                    b.setBooking_date(new Date());
                    b.setTravel_date(travel_Date);
                    b.setPassengers_details(description);
                    b.setPassengers(passengers);
                    b.setClass_id(trainClass);
                    b.setQr_code(vf);
                    b.setTotal_price(totalPrice);
                    b.setRoute_price_id(pId);
                    b.setTrain_routes_id(rId);
                    b.setUser_id(uid);
                    
                    s.beginTransaction();
                    s.save(b);
                    s.getTransaction().commit();

                    // Send email in background
                    new Thread(() -> Mail.sendMail(user.getEmail(), "Smart Booking QR Code", "<h1>" + vf + "</h1>")).start();
                }
                
            } catch (ParseException ex) {
                Logger.getLogger(CheackOut.class.getName()).log(Level.SEVERE, null, ex);
            }
            
            s.close();
            responseJson.addProperty("status", true);
            responseJson.addProperty("message", "Validation successful!");
        }
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

//        responseJson.addProperty("priceID", priceID);
//        responseJson.addProperty("routeID", routeID);
//        responseJson.addProperty("status", true);
//        processcheackout(totalPrice, trainRoutesId, response);
}

//pk_test_51PLevYP1GdaOtmzhCdg6VzMZbcOzfYd6vN7rwgizmQHYW9o7zvENmheM5ANOLcfVScPoZRwAw5r6BkD5lkJ7R3YZ00LbT67G5y
//SECRET_KEY
//sk_test_51PLevYP1GdaOtmzh1GKZ8LeiXL5a5DyJb1QFarUfZKNKhZUwFwX1QBc7qEXdGyLz08Hs79nIoW7yEj1wWxGDrI1j00FT0oOwZn
