/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Train;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
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

/**
 *
 * @author Chamod
 */
@WebServlet(name = "LoadTrainData", urlPatterns = {"/LoadTrainData"})
public class LoadTrainData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();

//        SessionFactory sf = HibernateUtil.getSessionFactory();
//        Session s = sf.openSession();
        try {
            // Get enum values
            Speed[] speeds = Speed.values();
            DaysOfTravel[] dot = DaysOfTravel.values();
            TrainType[] types = TrainType.values();
            Status[] status = Status.values();


            responseJson.add("speeds", gson.toJsonTree(speeds));
            responseJson.add("daysOfTravel", gson.toJsonTree(dot));
            responseJson.add("trainTypes", gson.toJsonTree(types));
            responseJson.add("statuses", gson.toJsonTree(status));

            responseJson.addProperty("status", true);

            
            
            
            
        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("status", false);
        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
