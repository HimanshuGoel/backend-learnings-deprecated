# Backend Learnings

This project contains backend learnings and best practices acquired from different web resources and self-experiences.

It provides standard initial structure and code examples for different topics which can be referred in a real-time project.

This will also serve as a playground for working upon different proof-of-concepts.

## Running Development Mode

- Install the dependencies `npm install`
- Start the server `npm run dev`

## Running Production Mode

- Install the dependencies `npm install`
- Create the build `npm run build`
- Start the server `npm run prod`

Currently, this application has been deployed on `Heroku` server at below endpoint -

<https://hg-backend-learnings-deploy.herokuapp.com/>

To push the new changes on `Heroku` and for other related features please refer below commands -

- `git push heroku HEAD:master`
- `heroku run bash -a hg-backend-learnings-deploy`
- `heroku logs --tail`

## Server Health API

- `${host}/api/status/system` - Return the system information in response
- `${host}/api/status/time` - Return the current time in response
- `${host}/api/status/usage` - Return the process and system memory usage in response
- `${host}/api/status/process` - Return the process details in response
- `${host}/api/status/error` - Return the error generated object in response

## SonarQube Integration

This project contains a `docker-compose.yml` which contains configurations for [bitnami/sonarqube](https://hub.docker.com/r/bitnami/sonarqube/). Please refer below commands to configure and running the `SonarQube` -

- `docker-compose up` - to make SonarQube up-and-running on local serve at <http://192.168.64.65/dashboard?id=backend-learnings>

- `npm run sonar`

## Best Practices

- `[To Be Created]`

## Get In Touch

- For any query or issue, please send me an email at himanshu.goel.mca@gmail.com
