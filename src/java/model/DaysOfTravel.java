/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Enum.java to edit this template
 */
package model;

/**
 *
 * @author Chamod
 */
public enum DaysOfTravel {
    Daily("Daily"),
    Mon_Fri("Mon→Fri"),
    Weekends("Weekends"),
    Mon("Monday"),
    Wed("Wednesday"),
    Fri("Friday"),
    Tue("Tuesday"),
    Thu("Thursday"),
    Sat_Sun("Sat–Sun"),
    Alternate_Days("Alternate → Days");

    
    
    private final String label;

    DaysOfTravel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
