package com.aina.falldetectionservicebackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class Message {

    public Message() {
    }

    @Id
    private String id;
    private String text;
    private enum sender{
        USER,BOT
    }
    private Instant timeStamp;

}
