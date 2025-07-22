package com.aina.falldetectionservicebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;


@Entity
public class DataPLace {

    public DataPLace(UUID id, double latitude, double longitude, AlertType alertType, String time) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.alertType = alertType;
        this.time = time;
    }

    public DataPLace() {
    }

    @Id
    @GeneratedValue
    private UUID id;


    public UUID getId() {
        return id;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public AlertType getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertTypeString) {
        try {
            AlertType alertType = AlertType.valueOf(alertTypeString.toUpperCase());
            this.alertType = alertType;
        } catch (IllegalArgumentException e) {
            System.out.println("Type d'alerte invalide : " + alertTypeString);
        }
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }


    @Column
    private double latitude;

    @Column
    private double longitude;

    @Column
    private double altitude;

    @Enumerated(EnumType.STRING)
    @Column
    private AlertType alertType ;

    @Column
    private String time;

    public enum AlertType {
        DANGER, WARNING, SAFE
    }


}
