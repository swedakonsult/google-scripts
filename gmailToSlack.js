function checkForMessages() {
  
  var slackChannel = 'THE_SLACK_CHANNEL';
  var webhookURL = 'THE_WEBHOOK_URL';
  var slackUsername = 'THE_USERNAME';
  var toEmail = 'THE_EMAIL';
  var gmailLabel = 'THE_LABEL_ASSIGNED_WITH_THE_FILTER'; 
  
  var label = GmailApp.getUserLabelByName(gmailLabel);
  var threads = label.getThreads();
  
  for (var t = 0; t < threads.length; t++){
    var thread = threads[t];
    if (thread.hasStarredMessages()){
      var messages = thread.getMessages();
      for (var m = 0; m < messages.length; m++){
        var message = messages[m];
        var to = message.getTo();
        if (to.includes(toEmail) && message.isStarred()){
          text = "From: " + message.getFrom() + ", Subject: " + message.getSubject();
          postToSlack(webhookURL, slackChannel, slackUsername, text);
          message.unstar();
        }
      }
    }
  }
}

function postToSlack(url, channel, username, text) {
   var payload = {
     'channel': channel,
     'username': username,
     'text': text
   };
   
   var payloadJson = JSON.stringify(payload);
  
   var options = {
     'method': 'post',
     'contentType': 'json',
     'payload': payloadJson
   };

   UrlFetchApp.fetch(url, options);
}
