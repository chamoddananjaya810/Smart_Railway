/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Route;
import hibernate.RoutePrice;
import hibernate.Station;
import hibernate.TrainStation;
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
@WebServlet(name = "LoadStationPriceData", urlPatterns = {"/LoadStationPriceData"})
public class LoadStationPriceData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();

        String stationId = request.getParameter("id");

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        responseJson.addProperty("status", true);

        if (Util.isInterger(stationId)) {

            TrainStation t = (TrainStation) s.get(TrainStation.class, Integer.parseInt(stationId));
            if (t != null) {

                Criteria c = s.createCriteria(TrainStation.class);
                c.add(Restrictions.eq("id", Integer.parseInt(stationId)));
                List<TrainStation> trainsStList = c.list();

                for (TrainStation tst : trainsStList) {

                }

                Criteria c1 = s.createCriteria(Station.class);

                List<Station> stationList = c1.list();
                for (Station station : stationList) {

                }
                responseJson.add("trainsStList", gson.toJsonTree(trainsStList));
                responseJson.add("station", gson.toJsonTree(stationList));
                responseJson.addProperty("status", true);

                s.close();

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
    }

}
