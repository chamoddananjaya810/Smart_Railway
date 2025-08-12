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
@Table(name = "train_routes")
public class Route implements Serializable {

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
     * @return the titile
     */
    public String getTitile() {
        return titile;
    }

    /**
     * @param titile the titile to set
     */
    public void setTitile(String titile) {
        this.titile = titile;
    }

    /**
     * @return the source_id
     */
    public Station getSource_id() {
        return source_id;
    }

    /**
     * @param source_id the source_id to set
     */
    public void setSource_id(Station source_id) {
        this.source_id = source_id;
    }

    /**
     * @return the destination_id
     */
    public Station getDestination_id() {
        return destination_id;
    }

    /**
     * @param destination_id the destination_id to set
     */
    public void setDestination_id(Station destination_id) {
        this.destination_id = destination_id;
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
     * @return the train_id
     */
    public Train getTrain_id() {
        return train_id;
    }

    /**
     * @param train_id the train_id to set
     */
    public void setTrain_id(Train train_id) {
        this.train_id = train_id;
    }

    /**
     * @return the admin_id
     */
    public Admin getAdmin_id() {
        return admin_id;
    }

    /**
     * @param admin_id the admin_id to set
     */
    
    public void setAdmin_id(Admin admin_id) {
        this.admin_id = admin_id;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "titile", length = 45, nullable = false)
    private String titile;

    @ManyToOne
    @JoinColumn(name = "source_id", nullable = false)
    private Station source_id;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Station destination_id;

    @Column(name = "departure_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date departure_time;

    @Column(name = "arrival_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date arrival_time;

    @ManyToOne
    @JoinColumn(name = "train_id", nullable = false)
    private Train train_id;
    @ManyToOne

    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin_id;

}
