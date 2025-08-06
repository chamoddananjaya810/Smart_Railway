/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import hibernate.User;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "SessionCheck", urlPatterns = {"/SessionCheck"})
public class SessionCheck extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        HttpSession session = request.getSession(false);
        JsonObject jsonResponse = new JsonObject();

        if (session != null && session.getAttribute("userEmail") != null) {
            System.out.println("✅ Session valid: " + session.getId());

            jsonResponse.addProperty("loggedIn", true);
            jsonResponse.addProperty("email", (String) session.getAttribute("userEmail"));
        } else {
            System.out.println("❌ No session or userEmail");

            jsonResponse.addProperty("loggedIn", false);
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
