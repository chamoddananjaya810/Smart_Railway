/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import hibernate.TrainClass;
import hibernate.Train;
import hibernate.Coaches;
import hibernate.Station;
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
@WebServlet(name = "LoadCoachesData", urlPatterns = {"/LoadCoachesData"})
public class LoadCoachesData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Train.class);
        List<Train> trianList = c1.list();

        Criteria c2 = s.createCriteria(TrainClass.class);
        List<TrainClass> classList = c2.list();

        Criteria c3 = s.createCriteria(Coaches.class);
        List<Coaches> coachesList = c3.list();

        Criteria c4 = s.createCriteria(Station.class);
        List<Station> sList = c4.list();
        
        System.out.println("classList" + classList);
        responseJson.add("trianList", gson.toJsonTree(trianList));
        responseJson.add("classList", gson.toJsonTree(classList));
        responseJson.add("coachesList", gson.toJsonTree(coachesList));
        responseJson.add("sList", gson.toJsonTree(sList));
        
        responseJson.addProperty("status", true);

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

}
