# Xcode Cloud Status Badges

Generate status badges for Xcode Cloud builds using webhooks.

Built with [Deno](https://deno.land) with the help of [Shields](https://shields.io)

# Tutorial

You can do it too! I plan to deploy this one day and allow users to generate their own
badges using their own cloud account. For now, though, you can deploy this repo yourself for free using[Deno Deploy](https://deno.com/deploy).

## 1. Deploy

There are 2 main ways to deploy this to use yourself:

## Fork this repo (preferred)

- Fork this repo (duh)
- [Deploy using git integration](https://deno.com/deploy/docs/deployments#git-integration)

## Clone this repo (a little more involved)

- Clone the repo (duh)
- [Deploy using deployctl](https://deno.com/deploy/docs/deployments#deployctl)

You can, of course, deploy it however you want. You just need it running somewhere with a static IP address so Xcode Cloud can ping the webhook.

## 2. Add webhook

- Go to your app's page on App Store Connect
- Navigate to the `Xcode Cloud` tab
- Choose `Settings` on the left side
- Select the `Webhooks` tab
- Add a new webhook and point it to the `/builder` endpoint of your server
  - ie. https://yourdomain.com/builder

## 3. Add the badge to your readme

- Open your README.md
- Add an HTML <img> tag like so:
`<img src="https://yourdomain.com/badge" />`

And just like that you have a badge that reflects the status of your Xcode cloud builds!
