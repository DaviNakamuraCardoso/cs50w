
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('form').onsubmit = send_mail;
    document.querySelector('#inbox').addEventListener('click', load_inbox);
    document.querySelector("#sent").addEventListener('click', load_sent);
    document.querySelector("#archived").addEventListener('click', load_archive);

    load_inbox();
}) 


function send_mail() {

  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  fetch("/emails", {
    method: 'POST', 
    body: JSON.stringify({
      recipients: recipients, 
      subject: subject, 
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    alert(result);
    document.querySelector("#message").innerHTML = result.message;
    
    
  });

}


function load_inbox() {
  
  load_box('inbox');

}


function get_mail(id) {
  const inbox = document.querySelector("#emails-view");
  const mail = document.querySelector('#mail-view');

  inbox.style.display = 'none';
  mail.style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    mail.innerHTML = `
    <h2>Subject: ${email.subject}</h2>
    <h3>From: ${email.sender}</h3>
    <h3>To: ${email.recipients}</h3>
    <h6>${email.timestamp}</h6>

    <p>${email.body}</p>
    `;
    
    
  });
  fetch(`/emails/${id}`, {
    method: 'PUT', 
    body: JSON.stringify({
      read: true
    })
  })


}


function load_archive() {
  load_box('archive');
}

function load_sent() {

 load_box('sent');

  
}
    
      
function load_box(url) {
  // Get the main division and make it visible
  const view = document.querySelector("#emails-view");
  view.style.display = 'block';

  // Get the single mail division and set to invisible
  document.querySelector("#mail-view").style.display = 'none';



  


  fetch(`/emails/${url}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {

      // Create the basic email elements 
      const element = document.createElement(`div.${url}`);
      const title = document.createElement("h3");
      const body = document.createElement("ul");
      const sender = document.createElement("li.sender");
      const recipients = document.createElement("li.recipients");
      const archive = document.createElement("button");

      // Insert the texts 
      title.innerHTML = `${email.subject}`;
      sender.innerHTML = `${email.sender} on ${email.timestamp}`;
      recipients.innerHTML = `To: ${email.recipients}`;
      archive.innerHTML = "Archive";




      // Adding the smaller elements to the div 
      body.append(sender);
      body.append(recipients);
      element.append(title);
      element.append(body);
      element.append(archive);

      // Opens the email when clicked  
      title.addEventListener('click', () => {
        get_mail(email.id);
      });
      title.style.cursor = 'pointer';


      // Adds the possibility to archive the emails
      archive.addEventListener('click', () => {
        fetch(`/emails/${email.id}`, {
          method: 'PUT', 
          body: JSON.stringify({
            archived: true
          })
        })
        load_box('archive');
      });
      


      view.append(element);



      


    });

  });
}
    
      