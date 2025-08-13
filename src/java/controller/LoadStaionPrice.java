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
import hibernate.TrainStation;
import hibernate.TrainStationPrice;
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
@WebServlet(name = "LoadStaionPrice", urlPatterns = {"/LoadStaionPrice"})
public class LoadStaionPrice extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     
      Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();

        String priceId = request.getParameter("id");

        System.out.println(priceId);
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        responseJson.addProperty("status", true);
        if (Util.isInterger(priceId)) {

            TrainStation r = (TrainStation) s.get(TrainStation.class, Integer.parseInt(priceId));
            if (r != null) {

                Criteria c = s.createCriteria(TrainStation.class);
                List<TrainStation> stationList = c.list();
                for (TrainStation station : stationList) {
                    

                }

                Criteria c1 = s.createCriteria(TrainStationPrice.class);
                c1.add(Restrictions.eq("station_from.id", Integer.parseInt(priceId)));

                List<TrainStationPrice> priceList = c1.list();
                for (TrainStationPrice price : priceList) {
                   

                }

                responseJson.add("priceList", gson.toJsonTree(priceList));
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
