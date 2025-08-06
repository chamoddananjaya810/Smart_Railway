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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Chamod
 */
@Entity
@Table(name = "user")
public class User implements Serializable {

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
     * @return the full_name
     */
    public String getFull_name() {
        return full_name;
    }

    /**
     * @param full_name the full_name to set
     */
    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    /**
     * @return the nic
     */
    public String getNic() {
        return nic;
    }

    /**
     * @param nic the nic to set
     */
    public void setNic(String nic) {
        this.nic = nic;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone the phone to set
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * @return the date_of_birth
     */
    public Date getDate_of_birth() {
        return date_of_birth;
    }

    /**
     * @param date_of_birth the date_of_birth to set
     */
    public void setDate_of_birth(Date date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    /**
     * @return the gender
     */
    public String getGender() {
        return gender;
    }

    /**
     * @param gender the gender to set
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * @return the role
     */
    public String getRole() {
        return role;
    }

    /**
     * @param role the role to set
     */
    public void setRole(String role) {
        this.role = role;
    }

    /**
     * @return the profile_pic
     */
    public String getProfile_pic() {
        return profile_pic;
    }

    /**
     * @param profile_pic the profile_pic to set
     */
    public void setProfile_pic(String profile_pic) {
        this.profile_pic = profile_pic;
    }

    /**
     * @return the email_verifyed
     */
    public String getEmail_verifyed() {
        return email_verifyed;
    }

    /**
     * @param email_verifyed the email_verifyed to set
     */
    public void setEmail_verifyed(String email_verifyed) {
        this.email_verifyed = email_verifyed;
    }

    /**
     * @return the created_at
     */
    public Date getCreated_at() {
        return created_at;
    }

    /**
     * @param created_at the created_at to set
     */
    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "full_name", length = 200, nullable = false)
    private String full_name;

    @Column(name = "nic", length = 12, nullable = false)
    private String nic;

    @Column(name = "email", length = 50, nullable = false)
    private String email;

    @Column(name = "password", length = 12, nullable = false)
    private String password;

    @Column(name = "phone", length = 10, nullable = false)
    private String phone;

    @Column(name = "date_of_birth", nullable = false)
    @Temporal(TemporalType.DATE)

    private Date date_of_birth;

    @Column(name = "gender", nullable = false)
    private String gender;

    @Column(name = "role", length = 20, nullable = false)
    private String role;

    @Column(name = "profile_pic", length = 100, nullable = false)
    private String profile_pic;

    @Column(name = "email_verifyed", length = 20, nullable = false)
    private String email_verifyed;

    @Column(name = "create_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at;

}
