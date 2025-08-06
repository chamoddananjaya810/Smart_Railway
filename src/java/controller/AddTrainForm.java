/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.HibernateUtil;
import hibernate.Train;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.DaysOfTravel;
import model.Speed;
import model.Status;
import model.TrainType;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AddTrainForm", urlPatterns = {"/AddTrainForm"})
public class AddTrainForm extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject train = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        try {
            System.out.println("Parsing JSON data...");

            // Use camelCase field names to match JavaScript
            String trainNumber = train.get("trainNumber").getAsString();
            String trainName = train.get("trainName").getAsString();
            String speedType = train.get("speedType").getAsString();
            Speed speed = Speed.valueOf(speedType);

            String daysOfTravel = train.get("daysOfTravel").getAsString();
            DaysOfTravel dot = DaysOfTravel.valueOf(daysOfTravel);

            String trainType = train.get("trainType").getAsString();
            TrainType type = TrainType.valueOf(trainType);

            String totalCoaches = train.get("totalCoaches").getAsString();
            String trainStatus = train.get("trainStatus").getAsString();
            Status s = Status.valueOf(trainStatus);

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session session = sf.openSession();

            if (request.getSession().getAttribute("admin") == null) {
                responseJson.addProperty("message", "Please sign in!");
            } else {

                Admin admin = (Admin) request.getSession().getAttribute("admin");
                Criteria c1 = session.createCriteria(Admin.class);
                c1.add(Restrictions.eq("email", admin.getEmail()));
                Admin a1 = (Admin) c1.uniqueResult();
                System.out.println("a1" + a1);
                System.out.println("Admin found: " + a1);
                System.out.println("Admin ID: " + (a1 != null ? a1.getId() : "null"));
                System.out.println("Admin Email: " + (a1 != null ? a1.getEmail() : "null"));
                

                Train t = new Train();
                t.setTrain_number(trainNumber);
                t.setTrain_name(trainName);

                t.setSpeed(speed);
                t.setDays_of_travel(dot);
                t.setTrain_type(type);
                t.setTotal_coaches(totalCoaches);
                t.setStatus(s);
                t.setAdmin_id(a1);

                session.beginTransaction();
                session.save(t);
                session.getTransaction().commit();

                responseJson.addProperty("status", true);
                responseJson.addProperty("message", "Train data received successfully");
            }

        } catch (Exception e) {
            System.out.println("Error parsing JSON: " + e.getMessage());
            e.printStackTrace();
            responseJson.addProperty("status", false);
            responseJson.addProperty("message", "Error processing train data: " + e.getMessage());
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
