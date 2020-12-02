// Waiting for the DOM to load 
document.addEventListener("DOMContentLoaded", () => {

    fetch("/current_user")
    .then(response => response.json())
    .then(user => {
        let page = 1;
        let url = window.location.href.split("/");
        const newPath = url.slice(3, url.length).join("/");

        // Index route
        if (url[3] == "")
        {
            get_page("pages", user, page);
        }
        // Following page
        else if (newPath == "followed")
        {
            get_page("following", user, page);
        }
        // User page
        else 
        {
            get_user_page(user, url[4]);
        }

        // Checking for authentication to add the login required features
        if (user.authenticated)
        {
            // Getting the publish button 
            const following = document.querySelector("#following");
            const profile = document.querySelector("#profile");
            

            profile.addEventListener("click", () => {
                get_user_page(user, user.username);
            });

            following.addEventListener("click", () => {
                get_page("following", user, page);
            });
        }
    });
})


function get_user_page(current_user, username) 
{

    fetch(`/users/${username}`)
    .then(response => response.json()) 
    .then(result => {

        // Creating main element
        const user_page = document.querySelector("#user_page");
        const user = result.user;
        const title = document.createElement("h1");
        const h2 = document.createElement("h2");
        const follow = document.createElement("button");
        const followingNum = document.createElement("button");
        const follow_container = document.createElement("div");
        const heading = document.createElement("div");

        // Adding the information in the elements 
        
        title.innerHTML = `${user.first} ${user.last}`;
        h2.innerHTML = `@${user.username}`;
        followingNum.innerHTML = `Following: ${user.following.length}`;

        
        const current_username = current_user.username;
        let followers_num = user.followers_num;

        followingNum.className = "static";
        title.className = "user-title";
        h2.className = "user-username";
        heading.className = "user-heading";
        follow_container.className = "follow-container";

        // Appending to the main div
        heading.append(title);
        heading.append(h2);
        user_page.append(heading);
        follow_container.append(followingNum);

        if (current_user.authenticated && current_user.username != username) 
        {

            if (user.followers.some(follower => follower == current_username)) 
            {
                follow.innerHTML = `Unfollow: ${followers_num}`;
                follow.className = "active";
                follow.onclick = () => 
                {
                    follow_user(user, follow, true);
                }
            }
            else 
            {
                follow.className = "off";
                follow.innerHTML = `Follow: ${followers_num}`;
                follow.onclick = () => {
                    follow_user(user, follow, false);
                }
            }
            follow_container.append(follow);

            
        }
        else
        {
            
            const followers = document.createElement("button");
            followers.className = "static";
            followers.innerHTML = `Followers: ${followers_num}`;
            follow_container.append(followers);
            
        }
        user_page.append(follow_container);

        show_div(user_page);
        get_page(`get_user_page/${username}`, current_user, 1);

        
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

    if (path === "pages" && current_user.authenticated)
    {
        const form = document.querySelector("#new-post");
        form.onsubmit = post;
    }
        // Creating the buttons to switch pages 
        const footer = document.querySelector("#footer");
        const previous = document.createElement("button");
        const next = document.createElement("button");

        // Labels 
        previous.innerHTML = "<i class='fas fa-arrow-left'></i><span>Previous Page</span>";
        next.innerHTML = "<span>Next Page</span><i class='fas fa-arrow-right'></i>";



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



    // Getting the main elements
    const post_container = document.querySelector("#post-container");


    // Removing the posts from the previous page 
    post_container.childNodes.forEach(node => {
        remove_div(node);
    });
        let indexId = 0;

        fetch(`/${path}/${page}`)
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {
                if (posts.indexOf(post) == posts.length-1)
                {

                    console.log(post);
                    if (page == post)
                    {
                        next.disabled = true;
                    }
                }
                else 
                {
                // --- Creating the post ---                      

                // Main div
                const div = document.createElement('div');

                // Heading 
                const heading = document.createElement("div");
                const name = document.createElement("h2");
                const username = document.createElement('a');
                const timestamp = document.createElement('p');

                // Body
                const body = document.createElement('p');

                // Like and dislike 
                const like = document.createElement('button');
                const dislike = document.createElement('button');
                const btn_container = document.createElement("div");

                // Edit form 
                const edit_div = document.createElement("div");
                const edit = document.createElement("button");
                const form = document.createElement("form");
                const submit = document.createElement("input");
                const textarea = document.createElement("textarea");
                
                // Setting the classes 
                const values = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

                // Main div
                div.className = `post-div`;
                div.id = `${values[indexId]}`;
                indexId++;
                
                // Heading 
                username.className = 'author';
                name.className = "name";
                timestamp.className = 'date';
                heading.className = "publication-details";                    

                // Body
                body.className = 'post-body';

                // Like and dislike
                like.className = 'off';
                dislike.className = 'off';
                btn_container.className = "btn-container";
                
                // Edit 
                edit.className = "edit";
                edit_div.className = "edit-div";
                textarea.maxLength = "400";

                
                // Creating the form for editing
                submit.type = "submit";
                username.href = `/user/${post.user}`;

                // Filling the elements  
                username.innerHTML = `@${post.user}`;
                name.innerHTML = `${post.first} ${post.last}`;
                body.innerHTML = post.post;
                timestamp.innerHTML = post.timestamp;
                like.innerHTML = `<i class="fas fa-thumbs-up"></i>: ${post.likes}`;
                dislike.innerHTML = `<i class="fas fa-thumbs-down"></i>: ${post.dislikes}`; 
                edit.innerHTML = 'Edit';
                
                // Event listeners 
                username.onclick = () => {
                    get_user_page(current_user, post.user);
                }

                form.onsubmit = () => {
                    edit_post(post, textarea, edit, body, form);
                    return false;
                }

                edit.onclick = () => {
                    

                    textarea.innerHTML = body.innerHTML;
                    body.style.display = "none";
                    form.style.display = "block";
                    edit_div.append(form);
                    edit.disabled = true;

                }



                // Adding the subelements to the main div 
                edit_div.append(body);
                heading.append(name);
                heading.append(username);
                heading.append(timestamp);

                
                
                div.append(heading);
                div.append(edit_div);

                form.append(textarea);
                form.append(submit);
                


                post_container.append(div);

                if (post.user != current_user.username && current_user.authenticated) 
                {
                    btn_container.append(like);
                    btn_container.append(dislike);

                }       
                else  
                {
                    if (current_user.username === post.user)
                    {
                        div.append(edit);
                    }
                    lNum = document.createElement("button");
                    dNum = document.createElement("button");

                    lNum.className = "static";
                    dNum.className = "static";

                    lNum.innerHTML = `<i class="fas fa-thumbs-up"></i>: ${post.likes}`;
                    dNum.innerHTML = `<i class="fas fa-thumbs-down"></i>: ${post.dislikes}`;

                    btn_container.append(lNum);
                    btn_container.append(dNum);

                }
                div.append(btn_container);


                if (current_user.authenticated)
                {

                    if (current_user.liked_posts.some(post_id => post_id == post.id)) 
                    {
                        like.className = "active";
                        dislike.onclick = () => {
                            dislike_post(like, dislike, post, true);
                        }
                        like.onclick = () => {
                            undo_like(like, dislike, post);
                        }

                    }
                    else if (current_user.disliked_posts.some(post_id => post_id == post.id)) 
                    {
                        dislike.className = "active";
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
                }
            
            });
            smoothScroll(".body", 1100);
        });
        
        

    
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
                button.className = "off";
                button.innerHTML = `Follow ${result.user.followers.length}`;
                button.onclick = () => {
                    follow_user(result.user, button, false);
                }
            }
            else {
                button.className = 'active';
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
        like_button.className = "active";
        like_button.innerHTML = `<i class="fas fa-thumbs-up"></i>: ${post.likes + 1}`;
        like_button.onclick = () => {
            undo_like(like_button, dislike_button, result.result);
        }

        // Setting the user view for dislikes
        dislike_button.className = "off";

        dislike_button.onclick = () => {
            dislike_post(like_button, dislike_button, result.result, true);
        }
        if (undo) {
            dislike_button.innerHTML = `<i class="fas fa-thumbs-down"></i>: ${post.dislikes - 1}`;
            
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
        dislike_button.className = "active";
        dislike_button.innerHTML = `<i class="fas fa-thumbs-down"></i>: ${post.dislikes + 1}`;
        dislike_button.onclick = () => {
            undo_dislike(like_button, dislike_button, result.result);
        }

        // Setting the user view for likes
        like_button.className = "off";
        like_button.onclick = () => {
            like_post(like_button, dislike_button, result.result, true);
        }
        if (undo) {
            like_button.innerHTML = `<i class="fas fa-thumbs-up"></i>: ${post.likes - 1}`;
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
        like_button.innerHTML = `<i class="fas fa-thumbs-up"></i>: ${post.likes - 1}`;
        like_button.className = "off";

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
        dislike_button.innerHTML = `<i class="fas fa-thumbs-down"></i>: ${post.dislikes - 1}`;
        dislike_button.className = "off";


        like_button.onclick = () => {
            like_post(like_button, dislike_button, result.result, false);
        }


    });})

}

            

function remove_div(div) {
    div.style.display = "none";
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
    fetch(`/edit/${post.id}`, {
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

function smoothScroll(target, duration)
{
    var target = document.querySelector(target);
    var targetPosition = target.getBoundingClientRect().top;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;


    function animation(currentTime)
    {
        if (startTime === null)
        {
            startTime = currentTime;
        }
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);

        if (timeElapsed < duration)
        {
            requestAnimationFrame(animation);
        }


    }

    function ease(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c/2 * (t * (t-2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

