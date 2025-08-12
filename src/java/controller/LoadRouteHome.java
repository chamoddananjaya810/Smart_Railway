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
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "LoadRouteHome", urlPatterns = {"/LoadRouteHome"})
public class LoadRouteHome extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

//        LocalTime departure_time = LocalTime.parse("18:45", formatter);
//        LocalTime arrivalTime = LocalTime.parse("18:45", formatter);
        try {

            Criteria c1 = s.createCriteria(Train.class);
            c1.add(Restrictions.eq("status_id.id", 1));
            c1.add(Restrictions.eq("type_id.id", 1));
            List<Train> TrainList = c1.list();

            for (Train train : TrainList) {
                train.setAdmin_id(null);

            }

            List<Integer> trainIds = TrainList.stream()
                    .map(Train::getTarin_id)
                    .collect(Collectors.toList());

            Criteria c2 = s.createCriteria(Route.class);
            if (!trainIds.isEmpty()) {
                c2.add(Restrictions.in("train_id.tarin_id", trainIds));

            }

            List<Route> routeList = c2.list();

            for (Route route : routeList) {
                route.setAdmin_id(null);

            }

            List<Integer> routeTIds = routeList.stream()
                    .map(r -> r.getTrain_id().getTarin_id())
                    .collect(Collectors.toList());

            List<Train> filteredTrainList = TrainList.stream()
                    .filter(t -> routeTIds.contains(t.getTarin_id()))
                    .collect(Collectors.toList());

            responseJson.add("routeList", gson.toJsonTree(routeList));
            responseJson.add("TrainList", gson.toJsonTree(filteredTrainList));
            responseJson.addProperty("status", true);

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("status", false);
        }
        responseJson.addProperty("status", true);
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

}
