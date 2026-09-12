package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
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

@WebServlet("/SignUp")
@MultipartConfig
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", false);

        try {

            String fullName = request.getParameter("fullName");
            String nic = request.getParameter("nic");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String phone = request.getParameter("phone");
            String dobString = request.getParameter("dateOfBirth");
            String gender = request.getParameter("gender");
            String role = request.getParameter("role");

            
           
            Part profilePicPart = request.getPart("profilePic");
            String fileName = profilePicPart != null ? profilePicPart.getSubmittedFileName() : "";

            // Validation
            if (nic == null || nic.length() > 13) {
                responseJson.addProperty("message", "Please enter a valid NIC or birth certificate number.");
            } else if (!Util.isEmailValid(email)) {
                responseJson.addProperty("message", "Please enter a valid email address.");
            } else if (!Util.isPasswordValid(password)) {
                responseJson.addProperty("message", "Please enter a valid password.");
            } else if (!phone.matches("\\d{10}")) {
                responseJson.addProperty("message", "Please enter a valid 10-digit phone number.");
            } else if (fileName.isEmpty()) {
                responseJson.addProperty("message", "Profile picture is required.");
            } else {
                // Parse date of birth
                Date dob = new SimpleDateFormat("yyyy-MM-dd").parse(dobString);

                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                Date nowDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(now.format(formatter));

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();

                Criteria criteria = s.createCriteria(User.class);
                criteria.add(Restrictions.eq("email", email));
                if (!criteria.list().isEmpty()) {
                    responseJson.addProperty("message", "User with this email already exists.");
                } else {
                    String vf = Util.genaratecode();

                    // Save user in DB
                    User u = new User();
                    u.setFull_name(fullName);
                    u.setNic(nic);
                    u.setEmail(email);
                    u.setPassword(password);
                    u.setPhone(phone);
                    u.setDate_of_birth(dob);
                    u.setGender(gender);
                    u.setRole(role);

                    u.setEmail_verifyed(vf);
                    u.setCreated_at(nowDate);

                    s.beginTransaction();
                    int id = (int) s.save(u);
                    s.getTransaction().commit();
                    s.close();

                    String appPath = getServletContext().getRealPath(""); //Full path of the Web Pages folder

                    String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "product-images");

                    File productFolder = new File(newPath, String.valueOf(id));
                    productFolder.mkdir();

                    File file1 = new File(productFolder, "image1.png");

                    Files.copy(profilePicPart.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                    // Send verification email in background
                    new Thread(() -> Mail.sendMail(email, "Smart Verification", "<h1>" + vf + "</h1>")).start();

                    // Set session
                    request.getSession(true).setAttribute("email", email);

                    responseJson.addProperty("status", true);
                    responseJson.addProperty("message", "success");
                }
            }
        } catch (ParseException e) {
            e.printStackTrace();
            responseJson.addProperty("message", "Date parsing error");
        }

        // Always return JSON
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
