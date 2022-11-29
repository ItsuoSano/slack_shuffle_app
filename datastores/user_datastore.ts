import {
  DefineDatastore,
  Schema,
} from "https://deno.land/x/deno_slack_sdk@1.4.2/mod.ts";

export const DATASTORE_ID = "userIds";

const UserDataStore = DefineDatastore({
  name: DATASTORE_ID,
  primary_key: "channel_id",
  attributes: {
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    user_ids: {
      type: Schema.types.array,
      items: {
        type: Schema.slack.types.user_id,
      },
    },
  },
});

export default UserDataStore;
