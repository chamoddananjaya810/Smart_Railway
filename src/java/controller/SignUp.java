/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024, // 1MB
        maxFileSize = 1024 * 1024 * 5, // 5MB
        maxRequestSize = 1024 * 1024 * 10 // 10MB
)
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

//        try {
        // Your existing logic
        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);
        try {
            String fullName = user.get("fullName").getAsString();
            String nic = user.get("nic").getAsString();
            String email = user.get("email").getAsString();
            String password = user.get("password").getAsString();
            String phone = user.get("phone").getAsString();
            String dobString = user.get("dateOfBirth").getAsString();
            String gender = user.get("gender").getAsString();
            String role = user.get("role").getAsString();
            String profilePic = user.has("profilePic") ? user.get("profilePic").getAsString() : "";

            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("status", false);

            // Validation
            if (nic == null || nic.length() > 13) {
                responseJson.addProperty("message", "Please enter a valid NIC or birth certificate number.");
            } else if (!Util.isEmailValid(email)) {
                responseJson.addProperty("message", "Please enter a valid email address.");
            } else if (!Util.isPasswordValid(password)) {
                responseJson.addProperty("message", "Please enter a valid password.");
            } else if (!phone.matches("\\d{10}")) {
                responseJson.addProperty("message", "Please enter a valid 10-digit phone number.");
            } else if (profilePic == null || profilePic.trim().isEmpty()) {
                responseJson.addProperty("message", "Profile picture is required.");
            } else {
                // Proceed with registration
                System.out.println("Validation passed");

                // Parse date of birth
                Date dob = new SimpleDateFormat("yyyy-MM-dd").parse(dobString);

                LocalDateTime now = LocalDateTime.now();  // current date and time
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String formattedDateTime = now.format(formatter);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date nowDate = sdf.parse(formattedDateTime);
//                // Hibernate session
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();

                // Check if email already exists
                Criteria criteria = s.createCriteria(User.class);
                criteria.add(Restrictions.eq("email", email));
                criteria.add(Restrictions.eq("phone", phone));

                if (!criteria.list().isEmpty()) {
                    responseJson.addProperty("message", "User with this email already exists.");
                } else {

                    // Generate email verification code
                    final String vf = Util.genaratecode();

                    // Create user object
                    User u = new User();
                    u.setFull_name(fullName);
                    u.setNic(nic);
                    u.setEmail(email);
                    u.setPassword(password);
                    u.setPhone(phone);
                    u.setDate_of_birth(dob);
                    u.setGender(gender);
                    u.setRole(role);
                    u.setProfile_pic(profilePic);
                    u.setEmail_verifyed(vf);
                    u.setCreated_at(nowDate);  // current time

                    // Save user
                    s.beginTransaction();
                    s.save(u);
                    s.getTransaction().commit();

                    // Start email verification in a new thread
                    new Thread(() -> {
                        Mail.sendMail(email, "Smart Verification", "<h1>" + vf + "</h1>");
                    }).start();

                    // Session management
                    HttpSession ses = request.getSession(true);
                    ses.setAttribute("email", email);

                    System.out.println(email);
                    System.out.println(ses.getId());

                    responseJson.addProperty("status", true);
                    responseJson.addProperty("message", "success");
                }

                s.close();
            }
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (ParseException e) {
            e.printStackTrace();

        }

//        } catch (Exception e) {
//            // Send error response back to React
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//            JsonObject errorResponse = new JsonObject();
//            errorResponse.addProperty("status", "error");
//            errorResponse.addProperty("message", "Registration failed");
//
//            PrintWriter out = response.getWriter();
////            out.write(gson.toJson(errorResponse));
//            out.flush();
//
//            e.printStackTrace();
//        }
    }

}
