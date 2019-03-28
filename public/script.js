var app = new Vue({
  el: '#app',
  data: {
    posts: [],
    username: "",
    message: "",
    like_count: 0,
    editing: true,
    button_text: "Create Post",
    
  },
  methods: {
    async getPosts() {
      try {
        let response = await axios.get("/api/posts");
        this.posts = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async createPost() {
      try {
        let response = await axios.post('api/posts', {
          username: this.username,
          message: this.message,
          like_count: this.like_count
        });
        this.getPosts();
        this.username = "";
        this.message = "";
        this.like_count = 0;
        this.button_text = "Create Post";
      } catch (error) {
        console.log(error);
      }
    },
    async likePost(post) {
      try {
        let response = await axios.put("/api/posts/" + post._id, {
          username: post.username,
          message: post.message,
          like_count: post.like_count + 1

        });
        this.getPosts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editPost(post) {
      try {
        let response = await axios.put("/api/posts/" + post._id, {
          username: post.username,
          message: post.message,
          like_count: post.like_count

        });
        this.getPosts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    startEditing(post) {
      this.deletePost(post);
      // put values into create post box
      this.username = post.username;
      this.message = post.message;
      this.like_count = post.like_count;
      this.button_text = "Save Post";
    },
    async deletePost(post) {
      try {
        let response = axios.delete("/api/posts/" + post._id);
        // this.findItem = null;
        this.getPosts();
        return true;
      } catch (error) {
        console.log(error);
      }
    },

  },
  created() {
    this.getPosts();
  },
});