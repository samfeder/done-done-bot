# done-done bot

## Workflow
- Reporter opens done done bot in Slack
- Reporter enters issue - `ex. Video won’t play`
- done done bot provides Shudder or SundanceNow buttons
- Reporter clicks respective button
- done done bot asks for more information
- Reporter provides any additional details `ex. Link to issue, description, screenshot`
- done done bot Creates a ticket for video won’t play. All notifications
- QA then verifies issues, cleans up issue, adds tags, assigns priority and due date.

## Local Development

To test a new feature of done-done bot locally, you can install ngrok to redirect traffic to your local node instance.

1. download [ngrok](https://ngrok.com)
2. Open up your terminal and enter `ngrok http 4000`. This opens a tunnel between a web server running on your `localhost:4000` port and a URL on ngrok's domain. You'll get a response that looks something like this
```
Tunnel Status                 online
Version                       2.1.3
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://163efa86.ngrok.io -> localhost:4000
Forwarding                    https://163efa86.ngrok.io -> localhost:4000
```
That last https url (https://163efa86.ngrok.io in this case. Yours may be different) is going to be your `Override URL`
3. Follow [this link](https://beepboophq.com/0_o/my-projects/3ccc8e6fd96444f9bad93b11ccbd4e06/teams#) to your projects and find done-done bot. Select `Enable Testing` and enter your `Override URL`.
4. Start up the app `PORT=4000 npm start`. You should see all incoming traffic logged through ngrok.