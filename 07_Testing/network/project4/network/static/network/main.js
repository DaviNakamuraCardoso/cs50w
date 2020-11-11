
// Waiting for the DOM to load 
document.addEventListener("DOMContentLoaded", () => {
    let page = 1;

    get_page(page);


    // Getting the publish button 
    const publish = document.querySelector("#publish");
    const text = document.querySelector("#post");
    const form = document.querySelector("#new-post");
    const footer = document.querySelector("#footer");


    publish.disabled = true;

    activate_button(publish, text);
    form.onsubmit = post;

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
        get_page(page - 1);
        page--;
    }
    next.onclick = () => {
        get_page(page + 1);
        page++;
        previous.disabled = false;
    }


    footer.append(previous);
    footer.append(next);









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

    // Getting the main elements
    const post_container = document.querySelector("#post-container");

    // Removing the posts from the previous page 
    post_container.childNodes.forEach(node => {
        node.className = "hide-post";
        node.addEventListener("animationend", () => {
            node.remove();

        });
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
                    get_user(post.user);
                });


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


function get_user(username) {
    fetch(`/users/${username}`)
    .then(response => response.json())
    .then(user => {
        // Getting the main elements 
        const container = document.querySelector("#user_page");
        const posts = document.querySelector("#post-container");


        // Showing the user page and hiding the posts 
        posts.className = "hide-post";
        container.className = "post-div";
        // Creating the user page elements
        const title = document.createElement("h1");
        const h2 = document.createElement("h2");


        // Adding the informations
        title.innerHTML = `${user.first} ${user.last}`;
        h2.innerHTML = user.username;


        // Adding the elements to the main div
        container.append(title);
        container.append(h2);




        

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


