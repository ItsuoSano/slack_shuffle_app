import {
  DefineFunction,
  Schema,
  SlackFunction,
} from "https://deno.land/x/deno_slack_sdk@1.4.2/mod.ts";

import UserDataStore, { DATASTORE_ID } from "../datastores/user_datastore.ts";

export const SaveUsersFunctionDefinition = DefineFunction({
  callback_id: "save_users_function",
  title: "save users",
  source_file: "functions/save_users_function.ts",
  input_parameters: {
    properties: {
      user_ids: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      is_save: {
        type: Schema.types.boolean,
      },
    },
    required: ["user_ids", "channel_id", "is_save"],
  },
  output_parameters: {
    properties: {
      saved: {
        type: Schema.types.boolean,
      },
    },
    required: ["saved"],
  },
});

export default SlackFunction(
  SaveUsersFunctionDefinition,
  async ({ inputs: { user_ids, channel_id, is_save }, client }) => {
    if (!is_save) return { outputs: { saved: false } };

    const result = await client.apps.datastore.put<
      typeof UserDataStore.definition
    >({
      datastore: DATASTORE_ID,
      item: {
        channel_id,
        user_ids,
      },
    });
    return { outputs: { saved: result.ok } };
  },
);
