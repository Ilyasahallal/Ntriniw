package controller;

import entity.CommentEntity;
import entity.CommentPostRequestEntity;
import entity.IdObjectEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.CommentService;
import service.ResponseObjectService;

@RestController
@RequestMapping("/api/v1")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/insertcomment")
    public ResponseEntity<ResponseObjectService> insertComment(@RequestBody CommentPostRequestEntity postedComment) {
        CommentEntity inputComment = postedComment.getCommentEntity();
        IdObjectEntity inputPostId = postedComment.getPostId();
        return new ResponseEntity<ResponseObjectService>(commentService.insertComment(inputComment, inputPostId.getId()), HttpStatus.OK);
    }

    @PostMapping("/getcomments")
    public ResponseEntity<ResponseObjectService> getComments(@RequestBody IdObjectEntity inputPostId) {
        return new ResponseEntity<ResponseObjectService>(commentService.getComments(inputPostId.getId()), HttpStatus.OK);
    }
}
