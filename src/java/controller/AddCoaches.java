/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.Coaches;
import hibernate.HibernateUtil;
import hibernate.Train;
import hibernate.TrainClass;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AddCoaches", urlPatterns = {"/AddCoaches"})
public class AddCoaches extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject coach = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        // Use camelCase field names to match JavaScript
        String coachName = coach.get("coach_name").getAsString();
        String totalSeats = coach.get("total_seats").getAsString();
        String trainSelect = coach.get("train_id").getAsString();

        String classSelect = coach.get("class_id").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        if (request.getSession().getAttribute("admin") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (coachName.isEmpty()) {
            responseJson.addProperty("message", "Please enter Coach Name!");

        } else if (!Util.isInterger(totalSeats)) {
            responseJson.addProperty("message", "Please enter Total Seat!");

        } else if ("trainSelect".equals("0")) {
            responseJson.addProperty("message", "Please Select valid Train!");
        } else if ("classSelect".equals("0")) {
            responseJson.addProperty("message", "Please enter valid daysOfTravel!");

        } else {

            Admin admin = (Admin) request.getSession().getAttribute("admin");
            Criteria c1 = s.createCriteria(Admin.class);
            c1.add(Restrictions.eq("email", admin.getEmail()));
            Admin a1 = (Admin) c1.uniqueResult();

            Train train = (Train) s.get(Train.class, Integer.parseInt(trainSelect));
            TrainClass tClass = (TrainClass) s.get(TrainClass.class, Integer.parseInt(classSelect));

            Criteria c2 = s.createCriteria(Coaches.class);
            c2.add(Restrictions.eq("train_id", train));
            c2.add(Restrictions.eq("class_id", tClass));
//            Coaches existingCoach = (Coaches) c2.uniqueResult();
//
//            if (existingCoach != null) {
//
//                // Duplicate found and it's not the same record being updated
//                responseJson.addProperty("status", false);
//                responseJson.addProperty("message", "A coach with this Train and Class already exists.");
//            } else {
                Coaches c = new Coaches();
                c.setBox_name(coachName);
                c.setTotal_seats(totalSeats);
                c.setTrain_id(train);
                c.setClass_id(tClass);

                s.beginTransaction();
                s.save(c);
                s.getTransaction().commit();

                responseJson.addProperty("status", true);
                responseJson.addProperty("message", "Train data received successfully");

            }
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));
                    s.close();

//        }
    }

}
