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
@Table(name = "route_price")
public class RoutePrice implements Serializable{

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
     * @return the first_class_price
     */
    public double getFirst_class_price() {
        return first_class_price;
    }

    /**
     * @param first_class_price the first_class_price to set
     */
    public void setFirst_class_price(double first_class_price) {
        this.first_class_price = first_class_price;
    }

    /**
     * @return the second_class_price
     */
    public double getSecond_class_price() {
        return second_class_price;
    }

    /**
     * @param second_class_price the second_class_price to set
     */
    public void setSecond_class_price(double second_class_price) {
        this.second_class_price = second_class_price;
    }

    /**
     * @return the from
     */
    public Station getFrom() {
        return from;
    }

    /**
     * @param from the from to set
     */
    public void setFrom(Station from) {
        this.from = from;
    }

    /**
     * @return the to
     */
    public Station getTo() {
        return to;
    }

    /**
     * @param to the to to set
     */
    public void setTo(Station to) {
        this.to = to;
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

    @ManyToOne

    @JoinColumn(name = "train_routes_id", nullable = false)
    private Route train_routes_id;
    
    
    @Column(name = "first_class_price", nullable = false)
    private double first_class_price;
    
    @Column(name = "second_class_price", nullable = false)
    private double second_class_price;

    @ManyToOne
    @JoinColumn(name = "from", nullable = false)
    private Station from;
    
    
    @ManyToOne
    @JoinColumn(name = "to", nullable = false)
    private Station to;
    
    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin_id;
    
    
}
