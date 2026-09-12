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
import hibernate.Speed;
import hibernate.Station;
import hibernate.Status;
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
@WebServlet(name = "LoadPriceList", urlPatterns = {"/LoadPriceList"})
public class LoadPriceList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        try {

            Criteria c1 = s.createCriteria(Route.class);
            List<Route> routeList = c1.list();

            Criteria c2 = s.createCriteria(Station.class);
            List<Status> stationList = c2.list();

            responseJson.add("routeList", gson.toJsonTree(routeList));
            responseJson.add("stationList", gson.toJsonTree(stationList));

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
