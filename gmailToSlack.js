function checkForMessages() {
  var slackChannel = PropertiesService.getScriptProperties().getProperty('THE_SLACK_CHANNEL');
  var webhookURL = PropertiesService.getScriptProperties().getProperty('THE_WEBHOOK_URL');
  var slackUsername = PropertiesService.getScriptProperties().getProperty('THE_USERNAME');
  var gmailLabel = PropertiesService.getScriptProperties().getProperty('THE_LABEL_ASSIGNED_WITH_THE_FILTER'); 
  
  var label = GmailApp.getUserLabelByName(gmailLabel);
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
  var to = message.getTo();
  var subject = message.getSubject();
  var from = message.getFrom();
  text = encodeURIComponent(`From ${from} Subject ${subject}`);
  postToSlack(webhookURL, slackChannel, slackUsername, text);
  message.unstar();
}

function postToSlack(url, channel, username, text) {
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

