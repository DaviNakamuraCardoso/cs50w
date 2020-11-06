

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {


  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


}

function load_mailbox(mailbox) {

  // Get the main division 
  const view = document.querySelector("#emails-view");

  // Show the mailbox and hide other views
  view.style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#mail-view").style.display = 'none';

  // Show the mailbox name
  view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 




  


  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {

      // Create the basic email elements 
      const element = document.createElement(`div.${mailbox}`);
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
    
 

