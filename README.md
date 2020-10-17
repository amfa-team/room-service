# Side By Side Service Template

## Getting Started

### Install

#### Copy template

- Copy template files

#### Update package.json

```diff
{
-  "name": "sbs-service-template",
+  "name": "test-service",
-  "repository": "https://github.com/amfa-team/sbs-service-template.git",
+  "repository": "https://github.com/amfa-team/test-service.git",
  "version": "0.1.0",
```

#### Update packages/react/package.json

```diff
{
-  "name": "@amfa-team/react-service-template",
+  "name": "@amfa-team/test-service",
-  "repository": "https://github.com/amfa-team/sbs-service-template.git",
+  "repository": "https://github.com/amfa-team/test-service.git",
  "version": "0.1.0",
```

#### Update packages/react/release.config.js

```diff
-  repositoryUrl: "https://github.com/amfa-team/sbs-service-template.git",
+  repositoryUrl: "https://github.com/amfa-team/test-service.git",
  plugins: [
```

#### Update packages/example/serverless.yml

```diff
-  service: example-template
+  service: example-test-service
```

```diff
  custom:
    client:
-      bucketName: "example-test-service-${opt:stage}"
+      bucketName: "example-test-service-${opt:stage}"
```

#### Create `packages/api/.env` from `packages/api/.env.example`

- Create Sentry project and set `SENTRY_DNS` env-vars

#### Create `packages/example/.env` from `packages/example/.env.example`

- Create Sentry project and set `SENTRY_DNS` env-vars

#### AWS Profile

- Create AWS profile named `picnic` https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

> You can also use `cd package/api && yarn serverless config credentials --provider aws --key xxxx --secret xxx --profile picnic`

#### Create Secrets

Add following secrets to your repository:

- `SLACK_WEBHOOK_SDK`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SENTRY_API_DNS`
- `SENTRY_EXAMPLE_DNS`
- `API_ENDPOINT_STAGING`: This is generated after first API deployment. You'll need to set a dummy value for the first deployment. Then you can retrieve it locally using `cd packages/api && yarn deploy:staging:info`
- `API_ENDPOINT_PROD`: This is generated after first API deployment. You'll need to set a dummy value for the first deployment. Then you can retrieve it locally using `cd packages/api && yarn deploy:prod:info`

#### Github Repository

- Open your github repository Settings
- Go to Branches
- Set `develop` as default branch

## Usage

### Github Packages

In order to use private npm packages, you need to set `.npmrc` using the `.npmrc.template`

see https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token

## What's included

### Start

Run `yarn && yarn start`

### Prettier

- Extensions: `js,ts,tsx,css,md,json`
- VsCode settings: AutoFormat on save
- Husky: AutoFormat on commit
- Github Action check

### Linter

- Includes `eslint` with `eslint-config-sbs`
- Includes `stylelint`

### Yarn Workspaces

- Uses yarn workspaces

### Github Actions

- prettier check
- build

### Commit Hooks

- Prettier
- Commit Lint with conventional commits (https://www.conventionalcommits.org/en/v1.0.0/#summary)

### Packages

#### Shared

- typescript
- shared code between environments

#### React

- React component library
- Deployment with Slack message on `#deploy` channel

#### Example

- React App example project using react component library
- Deployment with Slack message on `#deploy` channel

#### API

- Serverless API
- Deployment with Slack message on `#deploy` channel
