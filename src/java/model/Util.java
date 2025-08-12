/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Random;

/**
 *
 * @author Chamod
 */
public class Util {

    public static String genaratecode() {
        Random random = new Random();

        String code = String.format("%05d", random.nextInt(100000));

        return code;
    }

    public static boolean isEmailValid(String email) {

        return email.matches("^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$");

    }

    public static boolean isPasswordValid(String password) {

        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$");

    }

    public static boolean isInterger(String value) {
        return value.matches("^-?\\d+$");
    }

    public static boolean isDouble(String text) {
        return text.matches("^-?\\d*(\\.\\d+)?$");
    }

    public static boolean isValidDOB(String dobString) {
        try {
            LocalDate dob = LocalDate.parse(dobString, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            // Optional: Check if DOB is not in the future
            if (dob.isAfter(LocalDate.now())) {
                System.out.println("DOB cannot be in the future.");
                return false;
            }

            // Optional: Check if user is above a certain age
            int age = LocalDate.now().getYear() - dob.getYear();
            if (age < 0 || age > 120) {
                System.out.println("Invalid age range.");
                return false;
            }

            return true; // Valid DOB
        } catch (DateTimeParseException e) {
            System.out.println("Invalid date format. Use yyyy-MM-dd.");
            return false;
        }
    }
}
