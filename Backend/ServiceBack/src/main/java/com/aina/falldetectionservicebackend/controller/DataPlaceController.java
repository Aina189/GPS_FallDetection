package com.aina.falldetectionservicebackend.controller;

import com.aina.falldetectionservicebackend.dto.DataPlaceCreatDto;
import com.aina.falldetectionservicebackend.entity.DataPLace;
import com.aina.falldetectionservicebackend.service.DataPlaceService;
import com.aina.falldetectionservicebackend.websocket.MyWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class DataPlaceController {

    @Autowired
    DataPlaceService dataPlaceService;

    public final MyWebSocketHandler myWebSocketHandler;

    public DataPlaceController(MyWebSocketHandler myWebSocketHandler) {
        this.myWebSocketHandler = myWebSocketHandler;
    }


    @GetMapping(value = "/allPlace" , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<DataPLace>> getAllPlace(){
        List<DataPLace> dataPLaces = dataPlaceService.getAllPLace();
        return new ResponseEntity<>(dataPLaces, HttpStatus.OK);
    }

    @PostMapping(value = "/dataplace", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DataPLace> newDataplace(@RequestBody DataPlaceCreatDto dataPLace){
        DataPLace addedPLace= dataPlaceService.newDataPlace(dataPLace);
        return new ResponseEntity<>(addedPLace, HttpStatus.CREATED);
    }

    @PostMapping(value = "/alert")
    public String alert(@RequestParam String alertMessage) {
        try {
            myWebSocketHandler.broadcastMessage(alertMessage);
            return alertMessage;
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur interne : " + e.getMessage();
        }
    }
}
