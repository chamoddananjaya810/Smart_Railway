/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hibernate;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Chamod
 */
@Entity
@Table(name = "smart_bookings")
public class SmartBooking implements Serializable {

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the booking_date
     */
    public Date getBooking_date() {
        return booking_date;
    }

    /**
     * @param booking_date the booking_date to set
     */
    public void setBooking_date(Date booking_date) {
        this.booking_date = booking_date;
    }

    /**
     * @return the travel_date
     */
    public Date getTravel_date() {
        return travel_date;
    }

    /**
     * @param travel_date the travel_date to set
     */
    public void setTravel_date(Date travel_date) {
        this.travel_date = travel_date;
    }

    /**
     * @return the passengers
     */
    public int getPassengers() {
        return passengers;
    }

    /**
     * @param passengers the passengers to set
     */
    public void setPassengers(int passengers) {
        this.passengers = passengers;
    }

    /**
     * @return the passengers_details
     */
    public String getPassengers_details() {
        return passengers_details;
    }

    /**
     * @param passengers_details the passengers_details to set
     */
    public void setPassengers_details(String passengers_details) {
        this.passengers_details = passengers_details;
    }

    /**
     * @return the total_price
     */
    public double getTotal_price() {
        return total_price;
    }

    /**
     * @param total_price the total_price to set
     */
    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }

    /**
     * @return the qr_code
     */
    public String getQr_code() {
        return qr_code;
    }

    /**
     * @param qr_code the qr_code to set
     */
    public void setQr_code(String qr_code) {
        this.qr_code = qr_code;
    }

    /**
     * @return the class_id
     */
    public TrainClass getClass_id() {
        return class_id;
    }

    /**
     * @param class_id the class_id to set
     */
    public void setClass_id(TrainClass class_id) {
        this.class_id = class_id;
    }

    /**
     * @return the user_id
     */
    public User getUser_id() {
        return user_id;
    }

    /**
     * @param user_id the user_id to set
     */
    public void setUser_id(User user_id) {
        this.user_id = user_id;
    }

    /**
     * @return the train_routes_id
     */
    public Route getTrain_routes_id() {
        return train_routes_id;
    }

    /**
     * @param train_routes_id the train_routes_id to set
     */
    public void setTrain_routes_id(Route train_routes_id) {
        this.train_routes_id = train_routes_id;
    }

    /**
     * @return the route_price_id
     */
    public RoutePrice getRoute_price_id() {
        return route_price_id;
    }

    /**
     * @param route_price_id the route_price_id to set
     */
    public void setRoute_price_id(RoutePrice route_price_id) {
        this.route_price_id = route_price_id;
    }

    


  

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "booking_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date booking_date;

    @Column(name = "travel_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date travel_date;

    @Column(name = "passengers", nullable = false)
    private int passengers;
    
    @Column(name = "passengers_details", length = 1500, nullable = false)
    private String passengers_details;
    
    
    @Column(name = "total_price", nullable = false)
    private double total_price;

    @Column(name = "qr_code", length = 45, nullable = true)
    private String qr_code;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private TrainClass class_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user_id;

    @ManyToOne
    @JoinColumn(name = "train_routes_id", nullable = false)
    private Route train_routes_id;
    
    
    @ManyToOne
    @JoinColumn(name = "route_price_id", nullable = false)
    private RoutePrice route_price_id;

}
