package com.aina.falldetectionservicebackend.websocket;

import com.aina.falldetectionservicebackend.entity.DataPLace;
import com.aina.falldetectionservicebackend.service.DataPlaceService;
import com.aina.falldetectionservicebackend.service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private static final Map<String, String> sessionRoles = new ConcurrentHashMap<>();

    public DataPlaceService dataPlaceService;
    public MessageService messageService;

    @Autowired
    public MyWebSocketHandler(DataPlaceService dataPlaceService , MessageService messageService){
        this.dataPlaceService = dataPlaceService;
        this.messageService = messageService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //String id = session.getId();
        Map<String, String> params = UriComponentsBuilder.fromUri(session.getUri()).build().getQueryParams().toSingleValueMap();
        String role = params.get("role");
        System.out.println("Rôle connecté : " + role);
        sessionRoles.put(session.getId(), role);
        messageService.sendFirstMsgOnConnected();
        //sessions.put(id, session);
        //System.out.println("Client connecté : " + id);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        System.out.println("Message reçu de " + session.getId()+ sessionRoles.get(session.getId())  + ": " + payload);
        //List<DataPLace> dataPLaces = dataPlaceService.getAllPLace();
        String response = messageService.reciveMessage(payload);
        if (response != null) {
            //ObjectMapper mapper = new ObjectMapper();
            //String json = mapper.writeValueAsString(dataPLaces);
            //session.sendMessage(new TextMessage(json));
            session.sendMessage(new TextMessage(response));
        }
    }

    public void broadcastMessage(String message) throws IOException {
        for (WebSocketSession s : sessions.values()) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(message));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        System.out.println("Client déconnecté : " + session.getId());
    }
}
