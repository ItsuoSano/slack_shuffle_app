import { Manifest } from "deno-slack-sdk/mod.ts";
import UserDataStore from "./datastores/user_datastore.ts";
import ShuffleWorkflow from "./workflows/shuffle_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "shuffle_app",
  description: "A blank template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  functions: [],
  workflows: [ShuffleWorkflow],
  outgoingDomains: [],
  datastores: [UserDataStore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "users.profile:read",
    "datastore:read",
    "datastore:write",
  ],
});
