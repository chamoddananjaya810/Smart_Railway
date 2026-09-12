/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.DaysOftravel;
import hibernate.HibernateUtil;
import hibernate.Speed;
import hibernate.Status;
import hibernate.TrainType;
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
@WebServlet(name = "Profile", urlPatterns = {"/Profile"})
public class Profile extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession ses = request.getSession(false);

        if (ses != null && ses.getAttribute("user") != null) {
            User sessionUser = (User) ses.getAttribute("user");

            JsonObject responseJson = new JsonObject();
            // Hibernate session
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            // Fetch fresh user data
            Criteria c1 = s.createCriteria(User.class);
            c1.add(Restrictions.eq("id", sessionUser.getId()));
            User user = (User) c1.uniqueResult();

            s.close();

            String dob = new SimpleDateFormat("yyyy-MM-dd").format(user.getDate_of_birth());

            // ✅ Build full image URL
            String contextPath = request.getContextPath();
            String serverName = request.getServerName();
            int serverPort = request.getServerPort();
            String scheme = request.getScheme();

        
          

            // Build JSON
             responseJson.addProperty("id", user.getId());
            responseJson.addProperty("fullName", user.getFull_name());
            responseJson.addProperty("nic", user.getNic());
            responseJson.addProperty("email", user.getEmail());
            responseJson.addProperty("poneNumber", user.getPhone());
        
            responseJson.addProperty("role", user.getRole());
            responseJson.addProperty("dob", dob);
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
