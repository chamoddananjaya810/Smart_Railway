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
@Table(name = "station_payment")

public class SimpleStationPayment implements Serializable {

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
     * @return the payment_date
     */
    public Date getPayment_date() {
        return payment_date;
    }

    /**
     * @param payment_date the payment_date to set
     */
    public void setPayment_date(Date payment_date) {
        this.payment_date = payment_date;
    }

    /**
     * @return the date
     */
    public Date getDate() {
        return date;
    }

    /**
     * @param date the date to set
     */
    public void setDate(Date date) {
        this.date = date;
    }

    /**
     * @return the train_stations
     */
    public TrainStation getTrain_stations() {
        return train_stations;
    }

    /**
     * @param train_stations the train_stations to set
     */
    public void setTrain_stations(TrainStation train_stations) {
        this.train_stations = train_stations;
    }

    /**
     * @return the train_station_price
     */
    public TrainStationPrice getTrain_station_price() {
        return train_station_price;
    }

    /**
     * @param train_station_price the train_station_price to set
     */
    public void setTrain_station_price(TrainStationPrice train_station_price) {
        this.train_station_price = train_station_price;
    }

    /**
     * @return the pasenger
     */
    public int getPasenger() {
        return pasenger;
    }

    /**
     * @param pasenger the pasenger to set
     */
    public void setPasenger(int pasenger) {
        this.pasenger = pasenger;
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
     * @return the total
     */
    public Double getTotal() {
        return total;
    }

    /**
     * @param total the total to set
     */
    public void setTotal(Double total) {
        this.total = total;
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


    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "payment_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date payment_date;

    @Column(name = "date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "train_stations", nullable = false)
    private TrainStation train_stations;

    @ManyToOne
    @JoinColumn(name = "train_station_price", nullable = false)
    private TrainStationPrice train_station_price;

    @Column(name = "pasenger", nullable = false)
    private int pasenger;

    @Column(name = "qr_code", length = 45, nullable = true)
    private String qr_code;

    @Column(name = "total", precision = 10, scale = 2, nullable = false)
    private Double total;

    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user_id;
}
