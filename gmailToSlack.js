function checkForMessages() {
  var gmailLabel = PropertiesService.getScriptProperties().getProperty('THE_LABEL_ASSIGNED_WITH_THE_FILTER'); 
  
  var label = GmailApp.getUserLabelByName(gmailLabel);
  if (!label) {
    return;
  }
  
  var threads = label.getThreads();
  
  threads.forEach(thread => {
    if (thread.hasStarredMessages()) {
      filterMessages(thread);
    }
  });
}

function filterMessages(thread) {
  var messages = thread.getMessages();
  messages.forEach(message => {
    if (message.isStarred()) {
      handleMessage(message);
    }
  });
}

function handleMessage(message) {
  var subject = slackCleanup(message.getSubject());
  var from = slackCleanup(message.getFrom());
  var messageId = message.getId();
  var subjectLink = `<https://mail.google.com/mail/u/0/#all/${messageId}|${subject}>`;
  var text = `From: ${from} \nSubject: ${subjectLink}`; 
  message = {
    text: text
  };
  var webhookURL = PropertiesService.getScriptProperties().getProperty('THE_WEBHOOK_URL');
  
  postToSlack(webhookURL, message);
  message.unstar();
}

function slackCleanup(s) {
  return s.replace(/&/gi, '&amp;')
    .replace(/</gi, '&lt;')
    .replace(/>/gi, '&gt;');
}

function postToSlack(url, payload) {
  var response = UrlFetchApp.fetch(
    url,
    {
      method: "PUT",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    }
  );

  var responseCode = response.getResponseCode()
  var responseBody = response.getContentText()

  if (responseCode !== 200) {
    Logger.log(Utilities.formatString("Request failed. Expected 200, got %d: %s", responseCode, responseBody))
  }
}
