/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;

/**
 *
 * @author User
 */
@WebServlet(name = "DataSeedServlet", urlPatterns = {"/DataSeedServlet"})
public class DataSeedServlet extends HttpServlet {
protected void doGet(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {

    Session session = HibernateUtil.getSessionFactory().openSession();
    Transaction tx = null;

    try {
        tx = session.beginTransaction();

        // 1. Status Data
        hibernate.Status status = new hibernate.Status();
        status.setName("Active"); // Oyaage entity field name eka anuwa poddak wenas karanna
        session.save(status);

        // 2. Train Types
        hibernate.TrainType trainType = new hibernate.TrainType();
        trainType.setTypeName("Express");
        session.save(trainType);

        // 3. Stations
        hibernate.Station station1 = new hibernate.Station();
        station1.setName("Colombo Fort");
        session.save(station1);

        hibernate.Station station2 = new hibernate.Station();
        station2.setName("Kandy");
        session.save(station2);

        tx.commit();
        response.getWriter().println("Sample data generated successfully!");

    } catch (Exception e) {
        if (tx != null) tx.rollback();
        e.printStackTrace();
        response.getWriter().println("Error: " + e.getMessage());
    } finally {
        session.close();
    }
}}

