import {
  DefineFunction,
  Schema,
  SlackFunction,
} from "https://deno.land/x/deno_slack_sdk@1.4.2/mod.ts";
import * as _ from "https://deno.land/x/lodash_es@v0.0.2/mod.ts";

export const ShuffleFunctionDefinition = DefineFunction({
  callback_id: "shuffle_function",
  title: "shuffle function",
  source_file: "functions/shuffle_function.ts",
  input_parameters: {
    properties: {
      user_ids: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
      },
      chosen_number: {
        type: Schema.types.number,
      },
    },
    required: ["user_ids", "chosen_number"],
  },
  output_parameters: {
    properties: {
      outputString: {
        type: Schema.types.string,
      },
    },
    required: ["outputString"],
  },
});

export default SlackFunction(
  ShuffleFunctionDefinition,
  async ({ inputs: { user_ids, chosen_number }, client }) => {
    const shuffledUsers = _.shuffle(user_ids);
    const chosenUsers = shuffledUsers.slice(0, chosen_number);

    const userStrings = [];

    for (const user of chosenUsers) {
      const userProfile = await client.users.profile.get({ user });
      userStrings.push(`\`${userProfile.profile.real_name}\` さん`);
    }

    const outputString = `:tada: 選ばれたのは\n ${userStrings.join("\n")} \nです！`;
    return { outputs: { outputString: outputString } };
  },
);
