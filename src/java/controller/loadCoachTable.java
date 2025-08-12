/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.Coaches;
import hibernate.HibernateUtil;
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
@WebServlet(name = "loadCoachTable", urlPatterns = {"/loadCoachTable"})
public class loadCoachTable extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        try {

            Criteria c1 = s.createCriteria(Coaches.class);
            List<Coaches> coachList = c1.list();

            for (Coaches c : coachList) {
                c.getTrain_id().setAdmin_id(null);

            }

            responseJson.add("coachList", gson.toJsonTree(coachList));

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
