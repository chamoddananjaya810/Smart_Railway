/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Chamod
 */
@WebServlet(name = "StoreSimpleTicketServlet", urlPatterns = {"/StoreSimpleTicketServlet"})
public class StoreSimpleTicketServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       StringBuilder jsonBuilder = new StringBuilder();
        String line;
        BufferedReader reader = request.getReader();
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }

        request.getSession().setAttribute("selectedTicket", jsonBuilder.toString());
        response.setStatus(HttpServletResponse.SC_OK);
        
        System.out.println("selectedTicket booking");
        System.out.println("selectedTicket booking");
        System.out.println("selectedTicket booking");
        System.out.println("selectedTicket booking");
        System.out.println("selectedTicket booking");
    }

}
