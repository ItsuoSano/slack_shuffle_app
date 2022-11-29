import { Trigger } from "https://deno.land/x/deno_slack_api@1.4.0/types.ts";
import ShuffleWorkflow from "../workflows/shuffle_workflow.ts";

const shuffleTrigger: Trigger<typeof ShuffleWorkflow.definition> = {
  type: "shortcut",
  name: "shuffle!!",
  workflow: "#/workflows/shuffle_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default shuffleTrigger;
