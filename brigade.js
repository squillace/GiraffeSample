const { events, Job } = require("brigadier")

events.on("push", (brigadeEvent, project) => {
  console.log("==> handling a 'push' event from github")

  var m = `Github ${brigadeEvent.type} event for https://github.com/${project.repo.name}/commit/${brigadeEvent.commit}`

  if (project.secrets.SLACK_WEBHOOK) {
    var container = new Job("slack-notify")

    container.image = "technosophos/slack-notify:latest"
    container.env = {
      SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
      SLACK_USERNAME: "Brigade",
      SLACK_TITLE: `Build ${brigadeEvent.type}`,
      SLACK_MESSAGE: `${m}`,
      SLACK_COLOR: "#00ff00"
    }

    container.tasks = ["/slack-notify"]

    container.run()
  } else {
    console.log(m)
  }

})
