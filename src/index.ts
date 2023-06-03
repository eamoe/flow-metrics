import { url } from "inspector";
import { Version3Client } from "../node_modules/jira.js";

require('dotenv').config();

async function main() {
  
    const client = new Version3Client({
    // host url from environment variable
    host: process.env.HOSTURL!,
    authentication: {
      basic: {
        //email from environment variable
        email: process.env.EMAIL!,
        // api token from environment variable
        apiToken: process.env.APITOKEN!,
      },
    },
    newErrorHandling: true,
  });

  const project = await client.projects.getProject({
    // project id from environment variable
    projectIdOrKey: process.env.PROJECTID!,
  });

  if (project) {
    
    // create an issue
    const { id } = await client.issues.createIssue({
      fields: {
        summary: "My 8th issue",
        issuetype: {
          name: "Task",
        },
        project: {
          key: project.key,
        },
      },
    });

    // get created issue
    const issue = await client.issues.getIssue({ issueIdOrKey: id });
    console.log(
      `Issue '${issue.fields.summary}' was successfully added to '${project.name}' project.`
    );

  } else {
    console.log("Project not found.");
  }

}

main();