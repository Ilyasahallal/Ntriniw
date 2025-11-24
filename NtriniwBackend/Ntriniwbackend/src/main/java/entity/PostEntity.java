package entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "post")
public class PostEntity {
    @Id
    private String id;

    private String userId;

    private String originalUserId;

    private String content;

    private String image;

    private Instant createdAt;

    List<String> love = new ArrayList<>();

    List<String> share = new ArrayList<>();

    List<CommentEntity> comment = new ArrayList<>();

}
