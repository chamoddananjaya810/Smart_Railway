/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hibernate;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import model.DaysOfTravel;
import model.Speed;
import model.Status;
import model.TrainType;

/**
 *
 * @author Chamod
 */
@Entity
@Table(name = "train")
public class Train implements Serializable {

    /**
     * @return the tarin_id
     */
    public int getTarin_id() {
        return tarin_id;
    }

    /**
     * @param tarin_id the tarin_id to set
     */
    public void setTarin_id(int tarin_id) {
        this.tarin_id = tarin_id;
    }

    /**
     * @return the train_number
     */
    public String getTrain_number() {
        return train_number;
    }

    /**
     * @param train_number the train_number to set
     */
    public void setTrain_number(String train_number) {
        this.train_number = train_number;
    }

    /**
     * @return the train_name
     */
    public String getTrain_name() {
        return train_name;
    }

    /**
     * @param train_name the train_name to set
     */
    public void setTrain_name(String train_name) {
        this.train_name = train_name;
    }

    /**
     * @return the speed
     */
    public Speed getSpeed() {
        return speed;
    }

    /**
     * @param speed the speed to set
     */
    public void setSpeed(Speed speed) {
        this.speed = speed;
    }

    /**
     * @return the days_of_travel
     */
    public DaysOfTravel getDays_of_travel() {
        return days_of_travel;
    }

    /**
     * @param days_of_travel the days_of_travel to set
     */
    public void setDays_of_travel(DaysOfTravel days_of_travel) {
        this.days_of_travel = days_of_travel;
    }

    /**
     * @return the train_type
     */
    public TrainType getTrain_type() {
        return train_type;
    }

    /**
     * @param train_type the train_type to set
     */
    public void setTrain_type(TrainType train_type) {
        this.train_type = train_type;
    }

    /**
     * @return the total_coaches
     */
    public String getTotal_coaches() {
        return total_coaches;
    }

    /**
     * @param total_coaches the total_coaches to set
     */
    public void setTotal_coaches(String total_coaches) {
        this.total_coaches = total_coaches;
    }

    /**
     * @return the status
     */
    public Status getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Status status) {
        this.status = status;
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
    @Column(name = "tarin_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tarin_id;

    @Column(name = "train_number", length = 45, nullable = false)
    private String train_number;

    @Column(name = "train_name", length = 200, nullable = false)
    private String train_name;

    @Enumerated(EnumType.STRING) // or EnumType.ORDINAL
    private Speed speed;
//    @Column(name = "speed", length = 200, nullable = false)
//    private String speed;

    @Enumerated(EnumType.STRING)
    private DaysOfTravel days_of_travel;

    @Enumerated(EnumType.STRING)
    private TrainType train_type;

    @Column(name = "total_coaches", length = 45, nullable = false)
    private String total_coaches;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "admin_id",nullable = false)
    private Admin admin_id;
}
