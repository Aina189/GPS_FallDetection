package com.aina.falldetectionservicebackend.service;

import com.aina.falldetectionservicebackend.dto.DataPlaceCreatDto;
import com.aina.falldetectionservicebackend.entity.DataPLace;
import com.aina.falldetectionservicebackend.entity.Message;
import com.aina.falldetectionservicebackend.repository.MessageRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class MessageService {

    public MessageRepository messageRepository;
    public DataPlaceService dataPlaceService;

    public final RestTemplate restTemplate = new RestTemplate();


    public MessageService(MessageRepository messageRepository ,DataPlaceService dataPlaceService) {
        this.messageRepository = messageRepository;
        this.dataPlaceService = dataPlaceService;
    }

    public void sendFirstMsgOnConnected(){
        HttpHeaders header = new HttpHeaders();
        header.setBearerAuth("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");
        header.add("HTTP-Referer","MyBotApp");
        header.setContentType(MediaType.APPLICATION_JSON);

        String message = "Durrant tout la conversation, TonRole: Tu es une intelligence artificielle intégrée dans un système backend. "
                + "Ton rôle est d’analyser un message en langage naturel venant de l’utilisateur "
                + "et de retourner le numero de la fonction backend correspondante à appeler, parmi celles listées ci-dessous.\n"
                + "Tu ne donnes pas d'explication, uniquement un nombre.\n\n"
                + "Et apres , le numero que tu donne serra recuperer pour executer la fonction correspondant puis les résultat serrons envoyer à toi comme une deuxiemme prompte et tu utilisera ces donnés pour repondre au besoin de l'utilisateur"
                + "Fonctions disponibles dans le backend :\n"
                + "1. dataplaceService.getAllPLace()\n\n"
                + "2. dataplaceService.creatDataPlace\n\n"
                + "🔎 Exemple de message utilisateur et réponse attendue :\n"
                + "Message : \"Combien de donner y en à t il ?\"\n"
                + "Réponse :\n"
                + "1"
                +"Si le message ne correspond pas à aucune fonction, tu retourne une simple message que les numero"
                ;

        String jsonMessage = """
    {
    "model": "deepseek/deepseek-chat-v3-0324:free",
    "messages": [
    {
      "role": "user",
      "content": "%s"
    }
    ]
    }
    """.formatted(message.replace("\"","\\\""));

        String url = "https://openrouter.ai/api/v1/chat/completions";

        HttpEntity<String> request = new HttpEntity<>(jsonMessage, header);

        String response = restTemplate.postForObject(url, request, String.class);
        JsonObject jsonData = JsonParser.parseString(response).getAsJsonObject();
        JsonArray choiceArray = jsonData.getAsJsonArray("choices");
        JsonObject firstElement = choiceArray.get(0).getAsJsonObject();
        JsonObject messageArray = firstElement.getAsJsonObject("message");
        System.out.println(messageArray);
    }

    public String reciveMessage(String message) throws JsonProcessingException {
        HttpHeaders header = new HttpHeaders();
        header.setBearerAuth("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");
        header.add("HTTP-Referer","MyBotApp");
        header.setContentType(MediaType.APPLICATION_JSON);

        Object resultat = actionCompatible(0);
        ObjectMapper mapper = new ObjectMapper();
        String valueResult = mapper.writeValueAsString(resultat);

        String messages = "Ton role: Assistante IA intégrer dans une application backend pour aider au question et service\n"
                + "Voici les donner dont tu à besoin: "+ valueResult +"\n"
                + "Si la demande de l'utilisateur n'est pas compris dans ce donné , dit que tu peut pas repondre"
                + "Le message de l'utilisateur est : \"" + message + "\"";


        String jsonMessage = """
    {
    "model": "deepseek/deepseek-chat-v3-0324:free",
    "messages": [
    {
      "role": "user",
      "content": "%s"
    }
    ]
    }
    """.formatted(messages.replace("\"","\\\""));

        String url = "https://openrouter.ai/api/v1/chat/completions";

        HttpEntity<String> request = new HttpEntity<>(jsonMessage, header);

        String response = restTemplate.postForObject(url, request, String.class);
        JsonObject jsonData = JsonParser.parseString(response).getAsJsonObject();
        JsonArray choiceArray = jsonData.getAsJsonArray("choices");
        JsonObject firstElement = choiceArray.get(0).getAsJsonObject();
        JsonObject messageArray = firstElement.getAsJsonObject("message");
//        int value = messageArray.get("content").getAsInt();
//        Object resultat = actionCompatible(value-1);
//        ObjectMapper mapper = new ObjectMapper();
//        String valueResult = mapper.writeValueAsString(resultat);
//
//        String jsonMessage2 = """
//    {
//    "model": "deepseek/deepseek-chat-v3-0324:free",
//    "messages": [
//    {
//      "role": "user",
//      "content": "%s"
//    }
//    ]
//    }
//    """.formatted(valueResult.replace("\"","\\\""));
        String result = messageArray.get("content").getAsString();
        return result;

    }

    public Object actionCompatible(int value){
        DataPlaceCreatDto newDataplace = new DataPlaceCreatDto();

        switch (value) {
            case 0:
                return dataPlaceService.getAllPLace();
            case 1:
                return dataPlaceService.newDataPlace(newDataplace);
            default:
                throw new IllegalArgumentException("Valeur invalide : " + value);
        }
    }

}
