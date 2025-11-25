package service;

import entity.IdObjectEntity;
import entity.PostByFollowing;
import entity.PostEntity;
import entity.UserEntity;
import entity.DoubleIdObjectEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.PostRepository;
import repository.UserRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepo;
    @Autowired
    private UserRepository userRepo;

    public ResponseObjectService insertPost(PostEntity inputPost) {
        ResponseObjectService responseObj = new ResponseObjectService();
        inputPost.setCreatedAt(Instant.now());
        responseObj.setStatus("success");
        responseObj.setMessage("success");
        responseObj.setPayload(postRepo.save(inputPost));
        return responseObj;
    }

    public ResponseObjectService findPostByUserId(IdObjectEntity inputUserId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<List<PostEntity>> userPostsOpt = postRepo.findByUserIdOrderByCreatedAtDesc(inputUserId.getId());
        if (userPostsOpt.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find any post from user id: " + inputUserId.getId());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            List<PostEntity> userPosts = userPostsOpt.get();
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(userPosts);
            return responseObj;
        }
    }

    public ResponseObjectService findPostByFollowing(IdObjectEntity inputUserId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findById(inputUserId.getId());
        if (optUser.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find any post from user id: " + inputUserId.getId());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            UserEntity user = optUser.get();

            // Create a list of user IDs to fetch posts from
            // Always include the user's own ID to show their posts
            List<String> userIdsToFetch = new ArrayList<>();
            userIdsToFetch.add(user.getId()); // Add user's own ID

            // Add following IDs if they exist
            if (user.getFollowing() != null && !user.getFollowing().isEmpty()) {
                for (String id : user.getFollowing()) {
                    // Avoid duplicates (in case user somehow follows themselves)
                    if (!userIdsToFetch.contains(id)) {
                        userIdsToFetch.add(id);
                    }
                }
            }

            // Fetch posts from all these users
            List<PostByFollowing> listPosts = new ArrayList<>();
            for (String userId : userIdsToFetch) {
                // Get user info
                UserEntity followingUser = new UserEntity();
                Optional<UserEntity> optFollowingUser = userRepo.findById(userId);
                if (optFollowingUser.isPresent()) {
                    followingUser = optFollowingUser.get();
                    followingUser.setPassword("");

                    // Get posts from this user
                    Optional<List<PostEntity>> followingPostsOpt = postRepo.findByUserId(userId);
                    if (followingPostsOpt.isPresent()) {
                        List<PostEntity> followingPosts = followingPostsOpt.get();
                        if (followingPosts != null) {
                            for (PostEntity item : followingPosts) {
                                listPosts.add(new PostByFollowing(followingUser, item));
                            }
                        }
                    }
                }
            }

            // Sort by creation date (newest first)
            Collections.sort(listPosts,
                    (o1, o2) -> o2.getPost().getCreatedAt().compareTo(o1.getPost().getCreatedAt()));

            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(listPosts);
            return responseObj;
        }
    }

    public ResponseObjectService addComment(java.util.Map<String, Object> payload) {
        ResponseObjectService responseObj = new ResponseObjectService();
        String postId = (String) payload.get("postId");
        String content = (String) payload.get("content");
        String userId = (String) payload.get("userId");
        String userFullname = (String) payload.get("userFullname");

        Optional<PostEntity> optPost = postRepo.findById(postId);
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + postId);
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optPost.get();
            List<entity.CommentEntity> commentList = targetPost.getComment();
            if (commentList == null) {
                commentList = new ArrayList<>();
            }

            entity.CommentEntity newComment = new entity.CommentEntity();
            newComment.setId(java.util.UUID.randomUUID().toString());
            newComment.setUserId(userId);
            newComment.setUserFullname(userFullname);
            newComment.setContent(content);
            newComment.setCreatedAt(Instant.now());

            commentList.add(newComment);
            targetPost.setComment(commentList);

            postRepo.save(targetPost);

            responseObj.setStatus("success");
            responseObj.setMessage("comment added successfully");
            responseObj.setPayload(targetPost);
            return responseObj;
        }
    }

    public ResponseObjectService updatePostByLove(DoubleIdObjectEntity doubleId) {
        // id 1 - post Id, id 2 - user who liked post
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(doubleId.getId1());
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + doubleId.getId1());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optPost.get();
            List<String> loveList = targetPost.getLove();
            if (loveList == null) {
                loveList = new ArrayList<>();
            }
            // love and unlove a post
            if (!loveList.contains(doubleId.getId2())) {
                loveList.add(doubleId.getId2());
            } else {
                loveList.remove(doubleId.getId2());
            }
            targetPost.setLove(loveList);
            postRepo.save(targetPost);
            responseObj.setStatus("success");
            responseObj.setMessage("update love to the target post id: " + targetPost.getId());
            responseObj.setPayload(targetPost);
            return responseObj;
        }
    }

    public ResponseObjectService updatePostByShare(DoubleIdObjectEntity doubleId) {
        // id 1 - post Id, id 2 - user who shared post
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(doubleId.getId1());
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find post id: " + doubleId.getId1());
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optPost.get();
            List<String> shareList = targetPost.getShare();
            if (shareList == null) {
                shareList = new ArrayList<>();
            }
            // save id of user who shared the post then update post
            shareList.add(doubleId.getId2());
            targetPost.setShare(shareList);
            postRepo.save(targetPost);
            // update post list of user who shared the post
            targetPost.setUserId(doubleId.getId2());
            targetPost.setId(null);
            targetPost.setContent("Shared a post: " + targetPost.getContent());
            targetPost.setLove(new ArrayList<>());
            targetPost.setShare(new ArrayList<>());
            targetPost.setComment(new ArrayList<>());
            postRepo.save(targetPost);

            responseObj.setStatus("success");
            responseObj.setMessage("add a share to the target post id: " + targetPost.getId());
            responseObj.setPayload(targetPost);
            return responseObj;
        }
    }
}
