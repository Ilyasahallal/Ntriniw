import React, { useState, useEffect } from 'react';
import Stories from './Stories';
import FeedCard from './FeedCard';
import AuthService from '../../services/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      AuthService.getFollowingPosts(currentUser.id)
        .then((response) => {
          if (response.data.status === "success") {
            setPosts(response.data.payload || []);
          }
        })
        .catch((err) => console.error("Error fetching feed:", err))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="py-7 flex items-start gap-x-20">
      <div className="w-full h-auto">
        <Stories />
        <div className="w-full h-auto flex items-center justify-center mt-6">
          <div className="w-[80%] h-auto">
            {loading ? (
              <div className="text-white text-center">Loading feed...</div>
            ) : (
              <FeedCard posts={posts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;