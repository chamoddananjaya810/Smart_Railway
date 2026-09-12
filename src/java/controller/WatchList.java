/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.SmartBooking;
import hibernate.TrainStation;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "WatchList", urlPatterns = {"/WatchList"})
public class WatchList extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Gson gson = new Gson();
        HttpSession ses = request.getSession(false);

        if (ses != null && ses.getAttribute("user") != null) {
            User sessionUser = (User) ses.getAttribute("user");

            JsonObject responseJson = new JsonObject();
            // Hibernate session
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            // Fetch fresh user data
            Criteria c1 = s.createCriteria(SmartBooking.class);
            c1.add(Restrictions.eq("user_id.id", sessionUser.getId()));
            List<SmartBooking> watchList = c1.list();
            for (SmartBooking booking : watchList) {

            }

            responseJson.add("watchList", gson.toJsonTree(watchList));
           
            responseJson.addProperty("status", true);

            // Send response
            response.setContentType("application/json");
            response.getWriter().write(responseJson.toString());

        } else {
            // Not logged in
            JsonObject errorJson = new JsonObject();
            errorJson.addProperty("status", false);
            errorJson.addProperty("message", "User not logged in");
            response.setContentType("application/json");
            response.getWriter().write(errorJson.toString());
        }
    }

}
