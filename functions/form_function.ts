import {
  DefineFunction,
  Schema,
  SlackFunction,
} from "https://deno.land/x/deno_slack_sdk@1.4.2/mod.ts";
import { getUsers } from "../libs/getUser.ts";

export const FormFunctionDefinition = DefineFunction({
  callback_id: "formFunction",
  title: "form",
  source_file: "functions/form_function.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel_id"],
  },
  output_parameters: {
    properties: {
      user_ids: {
        type: Schema.types.array,
        items: { type: Schema.slack.types.user_id },
      },
      chosen_number: {
        type: Schema.types.number,
      },
      is_save: {
        type: Schema.types.boolean,
      },
    },
    required: ["user_ids", "chosen_number", "is_save"],
  },
});

export default SlackFunction(
  FormFunctionDefinition,
  async ({ inputs, client }) => {
    const users = await getUsers(client, inputs.channel_id);

    await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "誰になるかな？",
        },
        blocks: [
          {
            type: "input",
            block_id: "section1",
            element: {
              type: "multi_users_select",
              action_id: "selected_users",
              initial_users: users,
            },
            label: {
              type: "plain_text",
              text: "ユーザ",
            },
          },
          {
            type: "input",
            block_id: "section2",
            element: {
              type: "number_input",
              action_id: "chosen_number",
              is_decimal_allowed: true,
              initial_value: "1",
              min_value: "1",
            },
            label: {
              type: "plain_text",
              text: "何人選ぶ？",
            },
          },
          {
            type: "input",
            block_id: "section3",
            element: {
              type: "radio_buttons",
              action_id: "is_save",
              initial_option: {
                value: "1",
                text: {
                  type: "plain_text",
                  text: "する",
                },
              },
              options: [
                {
                  value: "1",
                  text: {
                    type: "plain_text",
                    text: "する",
                  },
                },
                {
                  value: "0",
                  text: {
                    type: "plain_text",
                    text: "しない",
                  },
                },
              ],
            },
            label: {
              type: "plain_text",
              text: "メンバーを保存する",
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "plain_text",
                text: "チャンネルごとに保存され、上書きされます",
              },
            ],
          },
        ],

        submit: {
          type: "plain_text",
          text: "選ぶ！",
        },
        callback_id: "choose_user", // <-- remember this ID, we will use it to route events to handlers!
      },
    });
    return {
      completed: false,
    };
  },
).addViewSubmissionHandler(
  "choose_user",
  async ({ view: { state: { values } }, client, body }) => {
    const user_ids = values.section1.selected_users.selected_users;
    const chosen_number = parseInt(values.section2.chosen_number.value);
    const is_save = values.section3.is_save.selected_option.value === "1";

    await client.functions.completeSuccess({
      function_execution_id: body.function_data.execution_id,
      outputs: { user_ids, chosen_number, is_save },
    });
    return {
      response_action: "clear",
    };
  },
);
