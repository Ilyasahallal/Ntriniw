package service;

import entity.MessageEntity;
import entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.MessageRepository;
import repository.UserRepository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepo;
    @Autowired
    private UserRepository userRepo;

    public ResponseObjectService sendMessage(MessageEntity message) {
        ResponseObjectService responseObj = new ResponseObjectService();
        message.setCreatedAt(Instant.now());
        MessageEntity savedMessage = messageRepo.save(message);
        responseObj.setStatus("success");
        responseObj.setMessage("Message sent successfully");
        responseObj.setPayload(savedMessage);
        return responseObj;
    }

    public ResponseObjectService getConversation(String userId1, String userId2) {
        ResponseObjectService responseObj = new ResponseObjectService();
        List<MessageEntity> sent = messageRepo.findBySenderIdAndReceiverId(userId1, userId2);
        List<MessageEntity> received = messageRepo.findBySenderIdAndReceiverId(userId2, userId1);

        List<MessageEntity> conversation = new ArrayList<>();
        conversation.addAll(sent);
        conversation.addAll(received);

        conversation.sort(Comparator.comparing(MessageEntity::getCreatedAt));

        responseObj.setStatus("success");
        responseObj.setMessage("Conversation retrieved successfully");
        responseObj.setPayload(conversation);
        return responseObj;
    }

    public ResponseObjectService getRecentConversations(String userId) {
        ResponseObjectService responseObj = new ResponseObjectService();

        // Get all messages involving this user
        List<MessageEntity> sent = messageRepo.findBySenderId(userId);
        List<MessageEntity> received = messageRepo.findByReceiverId(userId);

        Set<String> talkedToIds = new HashSet<>();
        sent.forEach(m -> talkedToIds.add(m.getReceiverId()));
        received.forEach(m -> talkedToIds.add(m.getSenderId()));

        List<UserEntity> recentUsers = new ArrayList<>();
        for (String id : talkedToIds) {
            Optional<UserEntity> userOpt = userRepo.findById(id);
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                user.setPassword(""); // Don't send password
                recentUsers.add(user);
            }
        }

        responseObj.setStatus("success");
        responseObj.setMessage("Recent conversations retrieved successfully");
        responseObj.setPayload(recentUsers);
        return responseObj;
    }
}
