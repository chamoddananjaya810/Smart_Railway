/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package hibernate;

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
@Table(name = "admin")
public class Admin {

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
     * @return the first_name
     */
    public String getFirst_name() {
        return first_name;
    }

    /**
     * @param first_name the first_name to set
     */
    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    /**
     * @return the last_name
     */
    public String getLast_name() {
        return last_name;
    }

    /**
     * @param last_name the last_name to set
     */
    public void setLast_name(String last_name) {
        this.last_name = last_name;
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
     * @return the adderss
     */
    public String getAdderss() {
        return adderss;
    }

    /**
     * @param adderss the adderss to set
     */
    public void setAdderss(String adderss) {
        this.adderss = adderss;
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
     * @return the verification_code
     */
    public String getVerification_code() {
        return verification_code;
    }

    /**
     * @param verification_code the verification_code to set
     */
    public void setVerification_code(String verification_code) {
        this.verification_code = verification_code;
    }

    /**
     * @return the pone_number
     */
    public String getPone_number() {
        return pone_number;
    }

    /**
     * @param pone_number the pone_number to set
     */
    public void setPone_number(String pone_number) {
        this.pone_number = pone_number;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * @return the create_at
     */
    public Date getCreate_at() {
        return create_at;
    }

    /**
     * @param create_at the create_at to set
     */
    public void setCreate_at(Date create_at) {
        this.create_at = create_at;
    }

    /**
     * @return the last_login
     */
    public Date getLast_login() {
        return last_login;
    }

    /**
     * @param last_login the last_login to set
     */
    public void setLast_login(Date last_login) {
        this.last_login = last_login;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "first_name", length = 45, nullable = false)
    private String first_name;

    @Column(name = "last_name", length = 45, nullable = false)
    private String last_name;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "password", length = 45, nullable = false)
    private String password;

    @Column(name = "adderss", length = 100, nullable = false)
    private String adderss;

    @Column(name = "nic", length = 12, nullable = false)
    private String nic;

    @Column(name = "verification_code", length = 10, nullable = false)
    private String verification_code;

    @Column(name = "pone_number", length = 10, nullable = false)
    private String pone_number;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "create_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date create_at;

    @Column(name = "last_login")
    @Temporal(TemporalType.TIMESTAMP)
    private Date last_login;

}
