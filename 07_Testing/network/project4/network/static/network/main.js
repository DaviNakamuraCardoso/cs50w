// Waiting for the DOM to load 
document.addEventListener("DOMContentLoaded", () => {

    fetch("/current_user")
    .then(response => response.json())
    .then(user => {
        let page = 1;
    
        get_page("pages", user, page);

        
        // Checking for authentication to add the login required features

        if (user.authenticated)
        {
            // Getting the publish button 
            const text = document.querySelector("#post");
            const user_page = document.querySelector("#user_page");


            const following = document.querySelector("#following");
            const form = document.querySelector("#new-post");
            const profile = document.querySelector("#profile");
            const publish = document.querySelector("#publish");
            
            
            profile.addEventListener("click", () => {
                get_user_page(user, user.username);
            });

            following.addEventListener("click", () => {
                remove_div(user_page);
                get_page("following", user, page);
            });

            form.onsubmit = post;

            publish.disabled = true;
            activate_button(publish, text);
            



        }

               
    });



})


function get_user_page(current_user, username) 
{

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
        const follow = document.createElement("button");

        // Adding the information in the elements 
        title.innerHTML = `${user.first} ${user.last}`;
        h2.innerHTML = user.username;
        followers.innerHTML = user.followers_num;

        
        const current_username = current_user.username;
        let followers_num = user.followers.length;
         
        // Appending to the main div
        user_page.append(title);
        user_page.append(h2);

        if (current_user.authenticated && current_user.username != username) 
        {

            if (user.followers.some(follower => follower == current_username)) 
            {
                follow.innerHTML = `Unfollow: ${followers_num}`;
                follow.style.color = "blue";
                follow.onclick = () => 
                {
                    follow_user(user, follow, true);
                }
            }
            else 
            {
                follow.style.color = "black";
                follow.innerHTML = `Follow: ${followers_num}`;
                follow.onclick = () => {
                    follow_user(user, follow, false);
                }
            }
            user_page.append(follow);
        }
        else
        {
            const fNum = document.createElement("p");
            fNum.innerHTML = `Followers: ${followers_num}`;
            user_page.append(fNum);
        }

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
            console.log(posts);
            posts.forEach(post => {


                // Creating the post 
                const div = document.createElement('div');
                const username = document.createElement('h3');
                const body = document.createElement('p');
                const timestamp = document.createElement('p');
                const like = document.createElement('button');
                const dislike = document.createElement('button');
                const edit = document.createElement("button");
                const form = document.createElement("form");
                const submit = document.createElement("input");
                const textarea = document.createElement("textarea");
                const edit_div = document.createElement("div");

                // Setting the classes 
                div.className = `post-div`;
                username.className = 'post-username';
                body.className = 'post-body';
                timestamp.className = 'post-timestamp';
                like.className = 'post-like';
                dislike.className = 'post-dislike';
            
                
                // Creating the form for editing
                submit.type = "submit";



                // Filling the elements with the informations 
                username.innerHTML = post.user;
                body.innerHTML = post.post;
                timestamp.innerHTML = post.timestamp;
                like.innerHTML = `Like: ${post.likes}`;
                dislike.innerHTML = `Dislike: ${post.dislikes}`; 
                edit.innerHTML = 'Edit';
                submit.innerHTML = "Save";
                
                // Event listeners 
                username.addEventListener("click", () => {
                    get_user_page(current_user, post.user);
                });

                form.onsubmit = () => {
                    edit_post(post, textarea, edit, body, form);
                    return false;
                }

                edit.onclick = () => {
                    
                    
                    textarea.value = body.innerHTML;
                    body.style.display = "none";
                    form.style.display = "block";
                    edit_div.append(form);
                    edit.disabled = true;

                }



                // Adding the subelements to the main div 
                edit_div.append(body);
                div.append(username);
                div.append(edit_div);
                div.append(timestamp);

                form.append(textarea);
                form.append(submit);
                


                post_container.append(div);

                if (post.user != current_user.username && current_user.authenticated) 
                {
                    div.append(like);
                    div.append(dislike);

                }       
                else  
                {
                    if (current_user.username === post.user)
                    {
                        div.style.border = "2px solid blue";
                        div.append(edit);
                    }
                    lNum = document.createElement("p");
                    dNum = document.createElement("p");

                    lNum.innerHTML = `Likes: ${post.likes}`;
                    dNum.innerHTML = `Dislikes: ${post.dislikes}`;

                    div.append(lNum);
                    div.append(dNum);

                }


                if (current_user.authenticated)
                {

                    if (current_user.liked_posts.some(post_id => post_id == post.id)) 
                    {
                        like.style.color = "blue";
                        dislike.onclick = () => {
                            dislike_post(like, dislike, post, true);
                        }
                        like.onclick = () => {
                            undo_like(like, dislike, post);
                        }

                    }
                    else if (current_user.disliked_posts.some(post_id => post_id == post.id)) 
                    {
                        dislike.style.color = "blue";
                        like.onclick = () => {
                            like_post(like, dislike, post, true);
                        }
                        dislike.onclick = () => {
                            undo_dislike(like, dislike, post);
                        }

                    }
                    else 
                    {
                        like.onclick = () => {

                            like_post(like, dislike, post, false);
                        }
                        dislike.onclick = () => {
                            dislike_post(like, dislike, post, false);
                        }
                    }   

                }
                

                



            });
        });
        
        // Creating the buttons to switch pages 
        const previous = document.createElement("button");
        const next = document.createElement("button");

        // Labels 
        previous.innerHTML = "Previous Page";
        next.innerHTML = "Next Page";


        if (page <= 1) 
        {
            previous.disabled = true;
        }

        previous.onclick = () => {
            get_page(path, current_user, page - 1);
        }
        next.onclick = () => {
            get_page(path, current_user, page + 1);
            previous.disabled = false;
        }

        footer.innerHTML = "";
        footer.append(previous);
        footer.append(next);



    
}



function follow_user(user, button, unfollow) {
    fetch(`/follow/${user.username}`, {
        method: "PUT", 
        body: JSON.stringify({
            unfollow:  unfollow 

            
        })
    })
    .then(() => {
        fetch(`/users/${user.username}`)
        .then(response => response.json())
        .then(result => {
            if (unfollow) {
                button.style.color = "black"; 
                button.innerHTML = `Follow ${result.user.followers.length}`;
                button.onclick = () => {
                    follow_user(result.user, button, false);
                }
            }
            else {
                button.style.color = "blue"; 
                button.innerHTML = `Unfollow: ${result.user.followers.length}`;
                button.onclick = () => {
                    follow_user(result.user, button, true);
                }
            }
        });
    })
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

function edit_post(post, textarea, edit, body, form) {
    fetch(`edit/${post.id}`, {
        method: "POST", 
        body: JSON.stringify({
            new_post: textarea.value
        })
    })
    .then(response => response.json())
    .then(result => {
        edit.disabled = false;
        body.innerHTML = result.updated; 
        body.style.display  = 'block';
        form.style.display = 'none';

        
    });
    

}
