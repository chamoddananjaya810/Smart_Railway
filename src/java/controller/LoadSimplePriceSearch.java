/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.TrainStationPrice;
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
@WebServlet(name = "LoadSimplePriceSearch", urlPatterns = {"/LoadSimplePriceSearch"})
public class LoadSimplePriceSearch extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        String stName = request.getParameter("name");
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        try {
            if (stName != null && !stName.trim().isEmpty()) {
                Criteria c = s.createCriteria(TrainStationPrice.class, "p");
                c.createAlias("p.station_from", "from");
                c.createAlias("p.station_to", "to");
                c.add(Restrictions.ilike("to.name", stName, MatchMode.ANYWHERE));

                List<TrainStationPrice> priceList = c.list();
                responseJson.add("priceList", gson.toJsonTree(priceList));
                responseJson.addProperty("status", true);
            } else {
                responseJson.addProperty("status", false);
                responseJson.addProperty("message", "Station name is empty");
            }
        } catch (Exception e) {
            responseJson.addProperty("status", false);
            responseJson.addProperty("message", e.getMessage());
        } finally {
            s.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
