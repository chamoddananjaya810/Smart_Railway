/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Route;
import hibernate.Train;
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
@WebServlet(name = "LoadRouteTable", urlPatterns = {"/LoadRouteTable"})
public class LoadRouteTable extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        try {

            Criteria criteria = s.createCriteria(Route.class);
            List<Route> routeList = criteria.list();

            for (Route route : routeList) {
                route.setAdmin_id(null);
            }

            responseJson.add("routeList", gson.toJsonTree(routeList));

            responseJson.addProperty("status", true);

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("status", false);
        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

}
