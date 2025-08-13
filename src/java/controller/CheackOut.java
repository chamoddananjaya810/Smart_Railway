/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.PayHere;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
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
// 2025-08-28

        if (request.getSession().getAttribute("user") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (travelDate.isEmpty()) {
            responseJson.addProperty("message", "Please enter Travel Date!");
        } else {
            // Date check: cannot be in the past
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
                // Passed all validations

                User user = (User) request.getSession().getAttribute("user");
                Criteria c1 = s.createCriteria(User.class);
                c1.add(Restrictions.eq("email", user.getEmail()));
                User uid = (User) c1.uniqueResult();
                // Debug output
                System.out.println("travelDate: " + travelDate);
                System.out.println("classId: " + classId);
                System.out.println("passengers: " + passengers);
                System.out.println("description: " + description);
                System.out.println("trainRoutesId: " + trainRoutesId);
                System.out.println("priceId: " + priceId);
                System.out.println("totalPrice: " + totalPrice);
                System.out.println("paymentMethod: " + paymentMethod);
                TrainClass trainClass = (TrainClass) s.get(TrainClass.class, Integer.parseInt(classId));
                Route rId = (Route) s.get(Route.class, Integer.parseInt(trainRoutesId));
                RoutePrice pId = (RoutePrice) s.get(RoutePrice.class, Integer.parseInt(priceId));
                try {
                    LocalDate tDate = LocalDate.parse(travelDate, dateFormatter);
                    System.out.println(tDate);
                    
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date travel_Date;
                    
                    travel_Date = sdf.parse(travelDate);
                    
                    SmartBooking b = new SmartBooking();
                    b.setBooking_date(new Date());
                    b.setTravel_date(travel_Date);
                    b.setPassengers_details(description);
                    b.setPassengers(passengers);
                    b.setClass_id(trainClass);
                    
                    b.setRoute_price_id(pId);
                    b.setTrain_routes_id(rId);
                    b.setUser_id(uid);
                    
                    s.beginTransaction();
                    s.save(b);
                    s.getTransaction().commit();
                } catch (ParseException ex) {
                    Logger.getLogger(CheackOut.class.getName()).log(Level.SEVERE, null, ex);
                }
                responseJson.addProperty("status", true);
                responseJson.addProperty("message", "Validation successful!");
            }
        }

//        responseJson.addProperty("priceID", priceID);
//        responseJson.addProperty("routeID", routeID);
//        responseJson.addProperty("status", true);
//        processcheackout(responseJson);
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }
    
    private void processcheackout(JsonObject responseObject) {
        try {
            double amount = responseObject.get("priceID").getAsDouble();
            String route = responseObject.get("routeID").getAsString();
            
            String merahantID = "1225054";
            String merchantSecret = "Mzg3NTE4MTg3MTMyMTI1ODE5OTEzMTk0NTg4NDQwMjc2OTUxOTA5MA==";
            String orderID = "000" + route;
            String currency = "LKR";
            String formattedAmount = new DecimalFormat("0.00").format(amount);
            String merchantSecretMD5 = PayHere.generateMD5(merchantSecret);
            
            String hash = PayHere.generateMD5(merahantID + orderID + formattedAmount + currency + merchantSecretMD5);
            
            JsonObject payHereJson = new JsonObject();
            payHereJson.addProperty("sandbox", true);
            payHereJson.addProperty("merchant_id", merahantID);
            
            payHereJson.addProperty("return_url", "");
            payHereJson.addProperty("cancel_url", "");
            payHereJson.addProperty("notify_url", "https://82d999c7ab2d.ngrok-free.app/SmartRailway/VerifyPayment");
            
            payHereJson.addProperty("order_id", orderID);
//            payHereJson.addProperty("items", items);
            payHereJson.addProperty("amount", formattedAmount);
            payHereJson.addProperty("currency", currency);
            payHereJson.addProperty("hash", hash);
            
            payHereJson.addProperty("first_name", "cc");
            payHereJson.addProperty("last_name", "dd");
            payHereJson.addProperty("email", "chamoddhananjaya76@gmail.com");

//            payHereJson.addProperty("phone", tel.getValue());
//            payHereJson.addProperty("address", address.getLineOne() + ", " + address.getLineTwo());
//            payHereJson.addProperty("city", address.getCity().getName());
            payHereJson.addProperty("country", "Sri Lanka");
            
            payHereJson.addProperty("sandbox", true);
            
            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Checkout completed");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
    }
;
}

//publish
//pk_test_51PLevYP1GdaOtmzhCdg6VzMZbcOzfYd6vN7rwgizmQHYW9o7zvENmheM5ANOLcfVScPoZRwAw5r6BkD5lkJ7R3YZ00LbT67G5y


//SECRET_KEY
//sk_test_51PLevYP1GdaOtmzh1GKZ8LeiXL5a5DyJb1QFarUfZKNKhZUwFwX1QBc7qEXdGyLz08Hs79nIoW7yEj1wWxGDrI1j00FT0oOwZn