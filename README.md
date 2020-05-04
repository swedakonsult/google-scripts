# google-scripts

## Setup
This script relies on a filter in Gmail that has a unique label that it tags emails with and stars each of them.

### Google Properties
This script requires you to configure the following Properties in your Google Project.

Click 'file > project properties > project properties' to set a key value

* THE_SLACK_CHANNEL: the target Slack channel
* THE_WEBHOOK_URL: the Slack webhook
* THE_USERNAME: the Slack username to post the Slack messages as
* THE_LABEL_ASSIGNED_WITH_THE_FILTER: the Gmail label used for emails that should be messaged into Slack
