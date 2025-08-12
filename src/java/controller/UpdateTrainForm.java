/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.Coaches;
import hibernate.DaysOftravel;
import hibernate.HibernateUtil;
import hibernate.Speed;
import hibernate.Status;
import hibernate.Train;
import hibernate.TrainClass;
import hibernate.TrainType;
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
@WebServlet(name = "UpdateTrainForm", urlPatterns = {"/UpdateTrainForm"})
public class UpdateTrainForm extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject train = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        // Use camelCase field names to match JavaScript
        String trainId = train.get("trainId").getAsString();
        String trainNumber = train.get("trainNumber").getAsString();
        String trainName = train.get("trainName").getAsString();
        String speedType = train.get("speedType").getAsString();

        String daysOfTravel = train.get("daysOfTravel").getAsString();

        String trainType = train.get("trainType").getAsString();

        String totalCoaches = train.get("totalCoaches").getAsString();
        String trainStatus = train.get("trainStatus").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        if (request.getSession().getAttribute("admin") == null) {
            responseJson.addProperty("message", "Please sign in!");
        } else if (trainNumber.isEmpty()) {
            responseJson.addProperty("message", "Please enter Train Number!");
        } else if ("Select Type".equals(speedType)) {
            responseJson.addProperty("message", "Please enter valid Speed!");
        } else if ("Select Speed".equals(daysOfTravel)) {
            responseJson.addProperty("message", "Please enter valid daysOfTravel!");
        } else if ("Select Days".equals(trainType)) {
            responseJson.addProperty("message", "Please enter valid trainType!");
        } else if ("Select Status".equals(trainStatus)) {
            responseJson.addProperty("message", "Please enter valid trainStatus!");
        } else {
            Admin admin = (Admin) request.getSession().getAttribute("admin");
            Criteria c1 = s.createCriteria(Admin.class);
            c1.add(Restrictions.eq("email", admin.getEmail()));
            Admin a1 = (Admin) c1.uniqueResult();

            Speed speed = (Speed) s.get(Speed.class, Integer.parseInt(speedType));
            DaysOftravel dot = (DaysOftravel) s.get(DaysOftravel.class, Integer.parseInt(daysOfTravel));
            TrainType type = (TrainType) s.get(TrainType.class, Integer.parseInt(trainType));
            Status status = (Status) s.get(Status.class, Integer.parseInt(trainStatus));

            Train t = (Train) s.get(Train.class, Integer.parseInt(trainId));

            if (t != null) {
                t.setTrain_number(trainNumber);
                t.setTrain_name(trainName);
                t.setSpeed_id(speed);
                t.setDays_of_travel_id(dot);
                t.setType_id(type);
                t.setTotal_coaches(totalCoaches);
                t.setStatus_id(status);
                t.setAdmin_id(a1);

                s.beginTransaction();
                s.update(t); // or s.saveOrUpdate(t)
                s.getTransaction().commit();

                responseJson.addProperty("status", true);
                responseJson.addProperty("message", "Train data updated successfully");
            } else {
                responseJson.addProperty("status", false);
                responseJson.addProperty("message", "Train not found");
            }

        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

}
