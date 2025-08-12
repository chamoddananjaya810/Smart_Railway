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
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "AdminVerifyAccount", urlPatterns = {"/AdminVerifyAccount"})
public class AdminVerifyAccount extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        try {
            JsonObject verification = gson.fromJson(request.getReader(), JsonObject.class);
            String verification_code = verification.get("vcode").getAsString();
            String email = null;

            // Get email from request or session
            if (verification.has("email")) {
                email = verification.get("email").getAsString();

            } else {
                // Get email from session
                HttpSession ses = request.getSession(false);
                if (ses == null || ses.getAttribute("email") == null) {
                    responseJson.addProperty("status", false);
                    responseJson.addProperty("message", "Session expired or email not found.");
                    PrintWriter out = response.getWriter();
                    out.write(gson.toJson(responseJson));
                    out.flush();
                    return; // Exit here if no session
                }

                email = ses.getAttribute("email").toString();

                System.out.println("Using email from session: " + email);
            }

            // Now we have email, proceed with database verification
            System.out.println("Verification code: " + verification_code);
            System.out.println("Email: " + email);

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            try {
                Criteria c1 = s.createCriteria(Admin.class);
                Criterion ct1 = Restrictions.eq("email", email);
                Criterion ct2 = Restrictions.eq("verification_code", verification_code);
                c1.add(ct1);
                c1.add(ct2);

                if (c1.list().isEmpty()) {
                    responseJson.addProperty("status", false);
                    responseJson.addProperty("message", "Invalid verification code");
                    System.out.println("No admin found with email: " + email + " and verification code: " + verification_code);
                } else {
                    Admin admin = (Admin) c1.list().get(0);

                    LocalDateTime now = LocalDateTime.now();  // current date and time
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                    String formattedDateTime = now.format(formatter);

                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date nowDate = sdf.parse(formattedDateTime);

                    admin.setLast_login(nowDate);

                    Transaction tx = s.beginTransaction();
                    s.update(admin);
                    tx.commit();

                    // Store user in session
                    HttpSession ses = request.getSession(true);
                    ses.setAttribute("admin", admin);
                    ses.setMaxInactiveInterval(36000);

                    responseJson.addProperty("status", true);
                    responseJson.addProperty("message", "Verification successful");
                    System.out.println("admin verified successfully: " + email);
                }
            } finally {
                s.close();
            }

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("status", false);
            responseJson.addProperty("message", "Invalid verification request");
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }
}
