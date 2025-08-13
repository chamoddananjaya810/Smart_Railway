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
@Table(name = "train_station_price")
public class TrainStationPrice implements Serializable {

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
     * @return the station_from
     */
    public TrainStation getStation_from() {
        return station_from;
    }

    /**
     * @param station_from the station_from to set
     */
    public void setStation_from(TrainStation station_from) {
        this.station_from = station_from;
    }

    /**
     * @return the station_to
     */
    public Station getStation_to() {
        return station_to;
    }

    /**
     * @param station_to the station_to to set
     */
    public void setStation_to(Station station_to) {
        this.station_to = station_to;
    }

    /**
     * @return the price
     */
    public Double getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * @return the distance
     */
    public Double getDistance() {
        return distance;
    }

    /**
     * @param distance the distance to set
     */
    public void setDistance(Double distance) {
        this.distance = distance;
    }

    

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "station_from", nullable = false)
    private TrainStation station_from;

    @ManyToOne
    @JoinColumn(name = "station_to", nullable = false)
    private Station station_to;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private Double price;

    @Column(name = "distance", precision = 10, scale = 2, nullable = true)
    private Double distance;
  
}
