# Xcode Cloud Status Badges

Generate status badges for Xcode Cloud builds using webhooks.

Built with [Deno](https://deno.land) with the help of [Shields](https://shields.io)

# Tutorial (WIP - NOT READY)

- Create an account at [XCBadger]()
- Add a new project
- Add your project's webhook URL to Xcode Cloud from App Store Connect
- [Create a ci_post_xcodebuild.sh file in your projects ci_scripts directory](https://developer.apple.com/documentation/xcode/writing-custom-build-scripts)
  - See [example_ci_post_xcodebuild.sh]() for help
- Add the following to the end of your script:
> zsh -c "$(curl -fsSL https://xcbadger.tech/(your_username)/(your_projectname)/builder/post-inst)"
- The next time you run an Xcode Cloud build, keep an eye on your build logs
- Follow the instructions on your project page at XCBadger to add the badge to your README

