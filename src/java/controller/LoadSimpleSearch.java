/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.TrainStation;
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
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "LoadSimpleSearch", urlPatterns = {"/LoadSimpleSearch"})
public class LoadSimpleSearch extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        String stationName = request.getParameter("name");

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        try {
            Criteria c = s.createCriteria(TrainStation.class);
            if (stationName != null && !stationName.trim().isEmpty()) {
                c.createAlias("station_id", "st");
                c.add(Restrictions.ilike("st.name", stationName, MatchMode.ANYWHERE));
            }

            List<TrainStation> stationList = c.list();
            for (TrainStation station : stationList) {
                // Optional: remove unwanted fields for JSON
//                station.setAdmin_id(null);
            }

            responseJson.add("stationList", gson.toJsonTree(stationList));
            responseJson.addProperty("status", true);

        } catch (Exception e) {
            responseJson.addProperty("status", false);
            responseJson.addProperty("message", e.getMessage());
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
