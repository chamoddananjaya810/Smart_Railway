/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        try {

            String email = user.get("email").getAsString();
            String password = user.get("password").getAsString();

            if (email.isEmpty()) {

                responseJson.addProperty("message", "email  can not be empty !");

            } else if (!Util.isEmailValid(email)) {
                responseJson.addProperty("message", "please enter the valid email !");
              
            } else if (password.isEmpty()) {
                responseJson.addProperty("message", "password  can not be empty !");
            } else if (!Util.isPasswordValid(password)) {
                responseJson.addProperty("message", "please enter the valid password!");
            } else {

                //hibernate save
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Criteria criteria = s.createCriteria(User.class);
                criteria.add(Restrictions.eq("email", email));
                criteria.add(Restrictions.eq("password", password));

                if (criteria.list().isEmpty()) {
                    responseJson.addProperty("message", " Invalid Credetials!");

                } else {

                    User u = (User) criteria.list().get(0);
                    responseJson.addProperty("status", true);

                    HttpSession ses = request.getSession();
                    responseJson.addProperty("email", u.getEmail());
                    if (!u.getEmail_verifyed().equals("Verifyed")) {
                        ses.setAttribute("email", email); // unverified session email
                        responseJson.addProperty("message", "1"); // Unverified
                    } else {
                        ses.setAttribute("user", u); // full user object
                        ses.setAttribute("userEmail", email);
                        System.out.println("✅ Session created: " + ses.getId());
                        User uu = (User) ses.getAttribute("user");
                        System.out.println(uu);
                        System.out.println(uu);
                        System.out.println(uu);
                        System.out.println(uu);
                        System.out.println(uu);
                        System.out.println(uu);
                        ses.setMaxInactiveInterval(30 * 60);

                        responseJson.addProperty("message", true); // Verified
                    }
                }
                s.close();

            }

            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();

        }
    }

}
