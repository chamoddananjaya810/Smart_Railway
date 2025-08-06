/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AdminSignIn", urlPatterns = {"/AdminSignIn"})
public class AdminSignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       
        Gson gson = new Gson();
        JsonObject admin = gson.fromJson(request.getReader(), JsonObject.class);
        JsonObject responseJson = new JsonObject();

        try {
            String email = admin.get("email").getAsString();
            String password = admin.get("password").getAsString();

            if (email.isEmpty()) {

                responseJson.addProperty("message", "email  can not be empty !");

            } else if (!Util.isEmailValid(email)) {
                responseJson.addProperty("message", "please enter the valid email !");
               
            } else if (password.isEmpty()) {
                responseJson.addProperty("message", "password  can not be empty !");
            } else if (!Util.isPasswordValid(password)) {
                responseJson.addProperty("message", "please enter the valid password!");
            } else {

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Criteria criteria = s.createCriteria(Admin.class);

                criteria.add(Restrictions.eq("email", email));
                criteria.add(Restrictions.eq("password", password));

                if (criteria.list().isEmpty()) {
                    responseJson.addProperty("message", "Invalid Credetials!");

                } else {

                    Admin a = (Admin) criteria.list().get(0);
                    responseJson.addProperty("status", true);

                    HttpSession ses = request.getSession();

                    final String vf = Util.genaratecode();
                    
                    a.setVerification_code(vf);
                    Transaction tx = s.beginTransaction();
                    s.update(a);
                    tx.commit();

                    System.out.println("step 5");

                    new Thread(
                            new Runnable() {
                        @Override
                        public void run() {
                            Mail.sendMail(email, "samart", "<h1>" + vf + "</h1>");
                        }
                    }).start();
                    //session management

                    ses.setAttribute("email", email);
                    //sessoin management

                    responseJson.addProperty("message", true);

//                  
//                    }
                }
                s.close();

            }
//            responseJson.addProperty("status", true);
        } catch (Exception e) {
            e.printStackTrace();
        }

      response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));
    }

}
