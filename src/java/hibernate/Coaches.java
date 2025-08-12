/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hibernate;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author Chamod
 */
@Entity
@Table(name = "coaches")
public class Coaches implements Serializable {

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
     * @return the box_name
     */
    public String getBox_name() {
        return box_name;
    }

    /**
     * @param box_name the box_name to set
     */
    public void setBox_name(String box_name) {
        this.box_name = box_name;
    }

    /**
     * @return the total_seats
     */
    public String getTotal_seats() {
        return total_seats;
    }

    /**
     * @param total_seats the total_seats to set
     */
    public void setTotal_seats(String total_seats) {
        this.total_seats = total_seats;
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

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "box_name", length = 45, nullable = false)
    private String box_name;

    @Column(name = "total_seats", length = 45, nullable = false)
    private String total_seats;

    @ManyToOne
    @JoinColumn(name = "train_id", nullable = false)
    private Train train_id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private TrainClass class_id;

}
