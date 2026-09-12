/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.DaysOftravel;
import hibernate.HibernateUtil;
import hibernate.Speed;
import hibernate.Station;
import hibernate.Status;
import hibernate.Train;
import hibernate.TrainStation;
import hibernate.TrainStationPrice;
import hibernate.TrainType;
import java.io.IOException;
import java.io.PrintWriter;
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
@WebServlet(name = "SaveStationPrice", urlPatterns = {"/SaveStationPrice"})
public class SaveStationPrice extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       Gson gson = new Gson();
        JsonObject stPrice = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        // Use camelCase field names to match JavaScript
        
        
        String stationFrom = stPrice.get("stationFrom").getAsString();
        String stationTo = stPrice.get("stationTo").getAsString();
        String  stationPrice = stPrice.get("stationPrice").getAsString();

       

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        if (request.getSession().getAttribute("admin") == null) {
            responseJson.addProperty("message", "Please sign in!");
       } else if ("0".equals(stationFrom)) {
            responseJson.addProperty("message", "Please Select valid Station From");
       } else if ("0".equals(stationTo)) {
            responseJson.addProperty("message", "Please Select valid Station to");
     } else if (stationPrice.isEmpty()) {
            responseJson.addProperty("message", "Please enter route!");
        
        } else {

            Admin admin = (Admin) request.getSession().getAttribute("admin");
            Criteria c1 = s.createCriteria(Admin.class);
            c1.add(Restrictions.eq("email", admin.getEmail()));
            Admin a1 = (Admin) c1.uniqueResult();

            TrainStation from = (TrainStation) s.get(TrainStation.class, Integer.parseInt(stationFrom));
            Station to = (Station) s.get(Station.class, Integer.parseInt(stationTo));
           
            TrainStationPrice t = new TrainStationPrice();
            t.setStation_from(from);
            t.setStation_to(to);

            t.setPrice(Double.valueOf(stationPrice));
        

            s.beginTransaction();
            s.save(t);
            s.getTransaction().commit();

            responseJson.addProperty("status", true);
            responseJson.addProperty("message", "Train data received successfully");

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }

   

}
