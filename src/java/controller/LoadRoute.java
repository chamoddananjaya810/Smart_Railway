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
import hibernate.Station;
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
@WebServlet(name = "LoadRoute", urlPatterns = {"/LoadRoute"})
public class LoadRoute extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        Session session = null;
        try {
            SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
            session = sessionFactory.openSession();

            List<Station> stationList = session.createCriteria(Station.class).list();
            List<Train> trainList = session.createCriteria(Train.class).list();

            responseJson.add("trainList", gson.toJsonTree(trainList));
            responseJson.add("stationList", gson.toJsonTree(stationList));
            responseJson.addProperty("status", true);

            System.out.println("LoadRoute servlet executed successfully");

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("status", false);
            responseJson.addProperty("message", e.getMessage());
        } finally {
            if (session != null) {
                session.close();
            }
        }

        response.getWriter().write(gson.toJson(responseJson));
    }
}
