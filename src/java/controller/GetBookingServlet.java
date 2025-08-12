/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

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
@WebServlet("/GetBookingServlet")
public class GetBookingServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String bookingJson = (String) request.getSession().getAttribute("selectedBooking");
        if (bookingJson != null) {
            response.setContentType("application/json");
            response.getWriter().write(bookingJson);
            System.out.println("controller.GetBookingServlet.doGet()");
            System.out.println("controller.GetBookingServlet.doGet()");
            System.out.println("controller.GetBookingServlet.doGet()");
            System.out.println("controller.GetBookingServlet.doGet()");
            System.out.println("controller.GetBookingServlet.doGet()");
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        System.out.println("egeg.GetBook.doGeegeeingServlett()");
            System.out.println("egegecontrogler.GetBookingSeegegrvlet.doGet()");
            System.out.println("egegegegcegontroller.GetBookingServlet.doGet()");
        }
    }
}

