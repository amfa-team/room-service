const mainConfig = {
  branches: [
    "master",
    { name: "develop", channel: "beta", prerelease: "beta" },
  ],
  repositoryUrl: "https://github.com/amfa-team/room-service.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          "chore(release): ${nextRelease.version}",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        publishCmd: "git checkout -- package.json",
      },
    ],
    [
      "semantic-release-slack-bot",
      {
        notifyOnSuccess: true,
        notifyOnFail: true,
        markdownReleaseNotes: true,
      },
    ],
  ],
};

const { execSync } = require("child_process");
const { createHash } = require("crypto");

const branch = execSync("git branch --show-current").toString().trimEnd("\n");
const channel = createHash("md5").update(branch).digest("hex");

const localConfig = {
  branches: [
    "master",
    { name: "develop", channel: "beta", prerelease: "beta" },
    {
      name: branch,
      channel,
      prerelease: channel,
    },
  ],
  repositoryUrl: "https://github.com/amfa-team/room-service.git",
  plugins: ["@semantic-release/commit-analyzer", "@semantic-release/npm"],
};

module.exports = process.env.LOCAL_RELEASE ? localConfig : mainConfig;
