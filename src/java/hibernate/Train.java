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
     * @return the speed_id
     */
    public Speed getSpeed_id() {
        return speed_id;
    }

    /**
     * @param speed_id the speed_id to set
     */
    public void setSpeed_id(Speed speed_id) {
        this.speed_id = speed_id;
    }

    /**
     * @return the days_of_travel_id
     */
    public DaysOftravel getDays_of_travel_id() {
        return days_of_travel_id;
    }

    /**
     * @param days_of_travel_id the days_of_travel_id to set
     */
    public void setDays_of_travel_id(DaysOftravel days_of_travel_id) {
        this.days_of_travel_id = days_of_travel_id;
    }

    /**
     * @return the type_id
     */
    public TrainType getType_id() {
        return type_id;
    }

    /**
     * @param type_id the type_id to set
     */
    public void setType_id(TrainType type_id) {
        this.type_id = type_id;
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
     * @return the status_id
     */
    public Status getStatus_id() {
        return status_id;
    }

    /**
     * @param status_id the status_id to set
     */
    public void setStatus_id(Status status_id) {
        this.status_id = status_id;
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

    @ManyToOne
    @JoinColumn(name = "speed_id", nullable = false)
    private Speed speed_id;

    @ManyToOne
    @JoinColumn(name = "days_of_travel_id", nullable = false)
    private DaysOftravel days_of_travel_id;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private TrainType type_id;

    @Column(name = "total_coaches", length = 45, nullable = false)
    private String total_coaches;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private Status status_id;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin_id;

}
