/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.DaysOftravel;
import hibernate.HibernateUtil;
import hibernate.Speed;
import hibernate.Status;
import hibernate.Train;
import hibernate.TrainType;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        try {

            Criteria c1 = s.createCriteria(Speed.class);
            List<Speed> speeedList = c1.list();

            Criteria c2 = s.createCriteria(Status.class);
            List<Status> statusList = c2.list();

            Criteria c3 = s.createCriteria(TrainType.class);
            List<TrainType> typeList = c3.list();

            Criteria c4 = s.createCriteria(DaysOftravel.class);
            List<DaysOftravel> daysofList = c4.list();

            responseJson.add("speeedList", gson.toJsonTree(speeedList));
            responseJson.add("statusList", gson.toJsonTree(statusList));
            responseJson.add("typeList", gson.toJsonTree(typeList));
            responseJson.add("daysofList", gson.toJsonTree(daysofList));
         
            responseJson.addProperty("status", true);

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));
            

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("status", false);
        }
      s.close();
    }

}
