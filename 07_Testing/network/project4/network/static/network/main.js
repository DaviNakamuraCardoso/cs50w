
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
    
    

        get_page(user, page);




        // Getting the publish button 
        const publish = document.querySelector("#publish");
        const text = document.querySelector("#post");
        const form = document.querySelector("#new-post");
        const footer = document.querySelector("#footer");
        const profile = document.querySelector("#profile");


        publish.disabled = true;

        activate_button(publish, text);
        form.onsubmit = post;
        profile.onclick = () => {
            get_user(user, profile.innerHTML);
        }

        // Creating the buttons to switch pages 
        const previous = document.createElement("button");
        const next = document.createElement("button");

        // Labels 
        previous.innerHTML = "Previous Page";
        next.innerHTML = "Next Page";


        if (page >= 1) {
            previous.disabled = true;

        }
        previous.onclick = () => {
            get_page(user, page - 1);
            page--;
        }
        next.onclick = () => {
            get_page(user, page + 1);
            page++;
            previous.disabled = false;
        }


        footer.append(previous);
        footer.append(next);




        }
        

    });



})



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





function get_page(user, page) {

    // Getting the main elements
    const post_container = document.querySelector("#post-container");
    const user_page = document.querySelector("#user_page");


    // Removing the posts from the previous page 
    remove_div(user_page);
    post_container.childNodes.forEach(node => {
        remove_div(node);

            

    });



    

        fetch(`/pages/${page}`)
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
                like.innerHTML = "Like";
                dislike.innerHTML = "Dislike"; 


                


                
                // Event listeners 
                username.addEventListener("click", () => {
                    get_user(user, post.user);
                });


                // Adding the subelements to the main div 
                div.append(username);
                div.append(body);
                div.append(timestamp);
                


                post_container.append(div);

                if (post.user == user.username) {
                    div.style.border = "2px solid blue";


                }       
                else {
                    div.append(like);
                    div.append(dislike);

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
    button.innerHTML = `Following: ${user.followers_num + 1}`;
    button.style.color = "blue";
}


function unfollow_user(user, button) {
    fetch(`/follow/${user}`, {
        method: "PUT", 
        body: JSON.stringify({
            unfollow:true
        })
    })
    button.innerHTML = `Follow: ${user.followers_num - 1}`;
    button.style.color = "black";
            
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


