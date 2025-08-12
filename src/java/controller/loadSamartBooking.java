/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Coaches;
import hibernate.HibernateUtil;
import hibernate.Route;
import hibernate.RoutePrice;
import hibernate.Station;
import hibernate.Train;
import hibernate.TrainClass;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
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
@WebServlet(name = "loadSamrtBooking", urlPatterns = {"/loadSamrtBooking"})
public class loadSamartBooking extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();

        String routeId = request.getParameter("id");

        System.out.println(routeId);
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        responseJson.addProperty("status", true);
        if (Util.isInterger(routeId)) {

            Route r = (Route) s.get(Route.class, Integer.parseInt(routeId));
            if (r != null) {

                Criteria c = s.createCriteria(Route.class);
                List<Route> routeList = c.list();
                for (Route route : routeList) {
                    route.setAdmin_id(null);

                }

                Criteria c1 = s.createCriteria(RoutePrice.class);
                c1.add(Restrictions.eq("train_routes_id.id", Integer.parseInt(routeId)));

                List<RoutePrice> routepriceList = c1.list();
                for (RoutePrice routeprice : routepriceList) {
                    routeprice.setAdmin_id(null);

                }

                responseJson.add("pList", gson.toJsonTree(routepriceList));
                responseJson.addProperty("status", true);
            } else {
                responseJson.addProperty("status", false);
            }

            responseJson.addProperty("status", true);
        } else {
            responseJson.addProperty("massage", "Product Not Found");
            responseJson.addProperty("status", "Not Found");
        }
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

}
