import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/api/auth/';
const DATA_API_URL = 'http://localhost:8080/api/v1/';

const register = (firstName, lastName, email, password) => {
    return axios.post(AUTH_API_URL + 'signup', {
        firstName,
        lastName,
        email,
        password,
    });
};

const login = (email, password) => {
    return axios.post(AUTH_API_URL + 'signin', {
        email,
        password,
    })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getAuthHeader = () => {
    const user = getCurrentUser();
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const getProfile = (userId) => {
    return axios.post(DATA_API_URL + 'users/profile', { id: userId }, { headers: getAuthHeader() });
};

const getMyPosts = (userId) => {
    return axios.post(DATA_API_URL + 'myposts', { id: userId }, { headers: getAuthHeader() });
};

const getFollowingPosts = (userId) => {
    return axios.post(DATA_API_URL + 'followingposts', { id: userId }, { headers: getAuthHeader() });
};

const updateUser = (userData) => {
    return axios.put(DATA_API_URL + 'users/update', userData, { headers: getAuthHeader() });
};

const createPost = (postData) => {
    return axios.post(DATA_API_URL + 'insertpost', postData, { headers: getAuthHeader() });
};

const followUser = (targetUserId, currentUserId) => {
    return axios.post(DATA_API_URL + 'users/follow', { id1: targetUserId, id2: currentUserId }, { headers: getAuthHeader() });
};

const unfollowUser = (targetUserId, currentUserId) => {
    return axios.post(DATA_API_URL + 'users/unfollow', { id1: targetUserId, id2: currentUserId }, { headers: getAuthHeader() });
};

const getAllUsers = () => {
    return axios.post(DATA_API_URL + 'users', {}, { headers: getAuthHeader() });
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    getProfile,
    getMyPosts,
    getFollowingPosts,
    updateUser,
    createPost,
    followUser,
    unfollowUser,
    getAllUsers
};

export default AuthService;
