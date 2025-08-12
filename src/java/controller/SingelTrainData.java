/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "SingelTrainData", urlPatterns = {"/SingelTrainData"})
public class SingelTrainData extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        JsonObject train = gson.fromJson(request.getReader(), JsonObject.class);
        String TrainId = train.get("id").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Train.class);
        c1.add(Restrictions.eq("tarin_id", Integer.parseInt(TrainId)));

        List<Train> trianList = c1.list();
        for (Train t : trianList) {
            t.setAdmin_id(null);
        }
        //load-product-data-end
        responseJson.add("trianList", gson.toJsonTree(trianList));

        responseJson.addProperty("status", true);

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
        s.close();
    }
}
