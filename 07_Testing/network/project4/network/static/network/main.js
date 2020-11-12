
// Waiting for the DOM to load 
document.addEventListener("DOMContentLoaded", () => {

    fetch("/current_user")
    .then(response => response.json())
    .then(user => {
        if (user.message === "Not logged.")
        {


        }
        else {

        let page = 1;
    
    

        get_page("pages", user, page);




        // Getting the publish button 
        const publish = document.querySelector("#publish");
        const text = document.querySelector("#post");
        const form = document.querySelector("#new-post");
        const footer = document.querySelector("#footer");
        const profile = document.querySelector("#profile");


        publish.disabled = true;


        // Event listeners 
        form.onsubmit = post;
        profile.addEventListener("click", () => {
            get_user_page(user, user.username);
        });
        activate_button(publish, text);

        // Creating the buttons to switch pages 
        const previous = document.createElement("button");
        const next = document.createElement("button");

        // Labels 
        previous.innerHTML = "Previous Page";
        next.innerHTML = "Next Page";


        if (page <= 1) {
            previous.disabled = true;

        }
        previous.onclick = () => {
            get_page("pages", user, page - 1);
            page--;
        }
        next.onclick = () => {
            get_page("pages", user, page + 1);
            page++;
            previous.disabled = false;
        }


        footer.append(previous);
        footer.append(next);




        }
        

    });



})


function get_user_page(current_user, username) {

    const user_page = document.querySelector("#user_page");
    remove_div(user_page);
    user_page.innerHTML = "";

    fetch(`/users/${username}`)
    .then(response => response.json()) 
    .then(result => {

        // Creating main element
        const user = result.user;
        const title = document.createElement("h1");
        const h2 = document.createElement("h2");
        const followers = document.createElement("h3");

        // Adding the information in the elements 
        title.innerHTML = `${user.first} ${user.last}`;
        h2.innerHTML = user.username;
        followers.innerHTML = user.followers_num;

        // Appending to the main div
        user_page.append(title);
        user_page.append(h2);

        //
        
        show_div(user_page);
        
        get_page(`user_posts/${username}`, current_user, 1);
        
        

        



    });

        
    
}

function post() {
    // Getting the post content and the message container
    const input = document.querySelector("#post");
    const message = document.querySelector("#message");
    const publish_btn = document.querySelector("#publish");

    fetch("/post", {
        method: "POST", 
        body: JSON.stringify({
            post: input.value 
        }) 

    })
    .then(response => response.json())
    .then(result => {
        message.innerHTML = result.message;
        message.style.display = 'block';
        publish_btn.disabled = true;
        input.value = "";
    });


    
    
}



function get_page(path, current_user, page) {

    // Getting the main elements
    const post_container = document.querySelector("#post-container");


    // Removing the posts from the previous page 
    post_container.childNodes.forEach(node => {
        remove_div(node);

            

    });



    

        fetch(`/${path}/${page}`)
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {


                // Creating the post 
                const div = document.createElement('div');
                const username = document.createElement('h3');
                const body = document.createElement('p');
                const timestamp = document.createElement('p');
                const like = document.createElement('button');
                const dislike = document.createElement('button');

                // Setting the classes 
                div.className = `post-div`;
                username.className = 'post-username';
                body.className = 'post-body';
                timestamp.className = 'post-timestamp';
                like.className = 'post-like';
                dislike.className = 'post-dislike';


                // Filling the elements with the informations 
                username.innerHTML = post.user;
                body.innerHTML = post.post;
                timestamp.innerHTML = post.timestamp;
                like.innerHTML = `Like: ${post.likes}`;
                dislike.innerHTML = `Dislike: ${post.dislikes}`; 
                
                
                // Event listeners 
                username.addEventListener("click", () => {
                    get_user_page(current_user, post.user);
                });


                // Adding the subelements to the main div 
                div.append(username);
                div.append(body);
                div.append(timestamp);
                


                post_container.append(div);

                if (post.user == current_user.username) {
                    div.style.border = "2px solid blue";


                }       
                else {
                    div.append(like);
                    div.append(dislike);

                }

                if (current_user.liked_posts.some(post_id => post_id == post.id)) {
                    like.style.color = "blue";
                    dislike.onclick = () => {
                        dislike_post(like, dislike, post, true);
                    }
                    like.onclick = () => {
                        undo_like(like, dislike, post);
                    }
                    
                }
                else if (current_user.disliked_posts.some(post_id => post_id == post.id)) {
                    dislike.style.color = "blue";
                    like.onclick = () => {
                        like_post(like, dislike, post, true);
                    }
                    dislike.onclick = () => {
                        undo_dislike(like, dislike, post);
                    }

                }
                else {
                    like.onclick = () => {
                        
                        like_post(like, dislike, post, false);
                    }
                    dislike.onclick = () => {
                        dislike_post(like, dislike, post, false);
                    }
                }





            });
        });


    
}



function follow_user(user, button) {
    fetch(`/follow/${user.username}`, {
        method: "PUT", 
        body: JSON.stringify({
            unfollow: false

            
        })
    })
    button.style.color = "blue";
}


function like_post(like_button, dislike_button, post, undo) {
    fetch(`/like_post/${post.id}`, {
        method: "PUT", 
        body: JSON.stringify({
           like: true 
        })

    })
    .then(() => {
        fetch(`/posts/${post.id}`)
        .then(response => response.json())
        .then(result => {
        // Setting the user view for likes 
        like_button.style.color = "blue";
        like_button.innerHTML = `Like: ${post.likes + 1}`;
        like_button.onclick = () => {
            undo_like(like_button, dislike_button, result.result);
        }

        // Setting the user view for dislikes
        dislike_button.style.color = "black";

        dislike_button.onclick = () => {
            dislike_post(like_button, dislike_button, result.result, true);
        }
        if (undo) {
            dislike_button.innerHTML = `Dislikes: ${post.dislikes - 1}`;
            
        }


    });})
        

    


}



function dislike_post(like_button, dislike_button, post, undo) {
    fetch(`/like_post/${post.id}`, {
        method: "PUT", 
        body: JSON.stringify({
            dislike: true  
        })
    })
    .then(() => {

    fetch(`/posts/${post.id}`)
    .then(response => response.json())
    .then(result => {

        // Setting the user view for dislikes 
        dislike_button.style.color = "blue";
        dislike_button.innerHTML = `Dislike: ${post.dislikes + 1}`;
        dislike_button.onclick = () => {
            undo_dislike(like_button, dislike_button, result.result);
        }

        // Setting the user view for likes
        like_button.style.color = "black";
        like_button.onclick = () => {
            like_post(like_button, dislike_button, result.result, true);
        }
        if (undo) {
            like_button.innerHTML = `Like: ${post.likes - 1}`;
        }
    });})

}


function undo_like(like_button, dislike_button,  post) {
    fetch(`like_post/${post.id}`, {
        method: "PUT", 
        body: JSON.stringify({
            like: false
        })
    })
    .then(() => {
    fetch(`/posts/${post.id}`)
    .then(response => response.json())
    .then(result => {
        // Setting the user view 
        like_button.innerHTML = `Like: ${post.likes - 1}`;
        like_button.style.color = "black";

        dislike_button.onclick = () => {
            dislike_post(like_button, dislike_button, result.result, false);
        }


    });})
}


function undo_dislike(like_button, dislike_button, post) {
    fetch(`like_post/${post.id}`, {
        method: "PUT", 
        body: JSON.stringify({
            dislike: false
        })
    })
    .then(() => {
    fetch(`/posts/${post.id}`)
    .then(response => response.json())
    .then(result => {
        // Setting the user view 
        dislike_button.innerHTML = `Dislike: ${post.dislikes - 1}`;
        dislike_button.style.color = "black";


        like_button.onclick = () => {
            like_post(like_button, dislike_button, result.result, false);
        }


    });})

}

            

function remove_div(div) {
    div.className = "hide-post";
    div.addEventListener("animationend", () => {
        div.style.display = 'none';
    })
}

function show_div(div) {
    div.style.display = "flex";
    div.className = "post-div";
    div.addEventListener("animationend", () => {
        div.style.display = "flex";
    });
}


function activate_button(button, form) {
    form.onkeyup = () => {
        if (form.value.length > 0) {
            button.disabled = false;
        }
        else {
            button.disabled = true;
        }
    }
}


