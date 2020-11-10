
// Waiting for the DOM to load 
document.addEventListener("DOMContentLoaded", () => {

    get_page(1);


    // Getting the publish button 
    const publish = document.querySelector("#publish");
    const text = document.querySelector("#post");
    const form = document.querySelector("#new-post");


    publish.disabled = true;

    activate_button(publish, text);
    form.onsubmit = post;









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





function get_page(page) {
    const post_container = document.querySelector("#post-container");

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
            like.innerHTML = post.likes;
            dislike.innerHTML = post.dislikes; 

            
            // When clicked, the buttons call the post like function

            // Adding the subelements to the main div 
            div.append(username);
            div.append(body);
            div.append(timestamp);
            div.append(like);
            div.append(dislike);


            post_container.append(div);
            





        });
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