/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hibernate;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import model.LocalTimeAttributeConverter;

/**
 *
 * @author Chamod
 */
@Entity
@Table(name = "train_stations")
public class TrainStation implements Serializable {

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
     * @return the station_id
     */
    public Station getStation_id() {
        return station_id;
    }

    /**
     * @param station_id the station_id to set
     */
    public void setStation_id(Station station_id) {
        this.station_id = station_id;
    }

    /**
     * @return the stop_platform
     */
    public int getStop_platform() {
        return stop_platform;
    }

    /**
     * @param stop_platform the stop_platform to set
     */
    public void setStop_platform(int stop_platform) {
        this.stop_platform = stop_platform;
    }

    /**
     * @return the arrival_time
     */
    public Date getArrival_time() {
        return arrival_time;
    }

    /**
     * @param arrival_time the arrival_time to set
     */
    public void setArrival_time(Date arrival_time) {
        this.arrival_time = arrival_time;
    }

    /**
     * @return the departure_time
     */
    public Date getDeparture_time() {
        return departure_time;
    }

    /**
     * @param departure_time the departure_time to set
     */
    public void setDeparture_time(Date departure_time) {
        this.departure_time = departure_time;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "train_routes_id", nullable = false)
    private Route train_routes_id;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station_id;

//    stop_platform,arrival_time,departure_time
    @Column(name = "stop_platform")
    private int stop_platform;

    @Column(name = "arrival_time", nullable = false)
    @Temporal(TemporalType.TIME)  // Use TIME instead of TIMESTAMP
    private Date arrival_time;

    @Column(name = "departure_time", nullable = false)
    @Temporal(TemporalType.TIME)  // Use TIME instead of TIMESTAMP
    private Date departure_time;

}
