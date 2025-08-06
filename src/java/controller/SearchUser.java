/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import hibernate.UserSearch;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "SearchUser", urlPatterns = {"/SearchUser"})
public class SearchUser extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

     
        String name = request.getParameter("name");
        System.out.println("Search name: " + name);

        List<UserSearch> userList = new ArrayList<>();

        // Hardcoded test data
        UserSearch user1 = new UserSearch("Chamod Dananjaya", "chamod@example.com");
        UserSearch user2 = new UserSearch("Nimal Perera", "nimal@example.com");
        UserSearch user3 = new UserSearch("Dananjaya Silva", "dana@example.com");

        List<UserSearch> allUsers = Arrays.asList(user1, user2, user3);

        for (UserSearch u : allUsers) {
            if (u.getFullName().toLowerCase().contains(name.toLowerCase())) {
                userList.add(u);
            }
        }

        String json = new Gson().toJson(userList);
        response.getWriter().write(json);
    }
}
