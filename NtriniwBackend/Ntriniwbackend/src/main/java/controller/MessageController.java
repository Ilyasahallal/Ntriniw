package controller;

import entity.MessageEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.MessageService;
import service.ResponseObjectService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@CrossOrigin(origins = "*")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseObjectService sendMessage(@RequestBody MessageEntity message) {
        return messageService.sendMessage(message);
    }

    @PostMapping("/conversation")
    public ResponseObjectService getConversation(@RequestBody Map<String, String> payload) {
        return messageService.getConversation(payload.get("userId1"), payload.get("userId2"));
    }

    @PostMapping("/recent")
    public ResponseObjectService getRecentConversations(@RequestBody Map<String, String> payload) {
        return messageService.getRecentConversations(payload.get("userId"));
    }
}
