import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ShuffleFunctionDefinition } from "../functions/shuffle_function.ts";
import { FormFunctionDefinition } from "../functions/form_function.ts";
import { SaveUsersFunctionDefinition } from "../functions/save_users_function.ts";

const ShuffleWorkflow = DefineWorkflow({
  callback_id: "shuffle_workflow",
  title: "shuffle members",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel"],
  },
});

const inputForm = ShuffleWorkflow.addStep(FormFunctionDefinition, {
  interactivity: ShuffleWorkflow.inputs.interactivity,
  channel_id: ShuffleWorkflow.inputs.channel,
});

ShuffleWorkflow.addStep(SaveUsersFunctionDefinition, {
  user_ids: inputForm.outputs.user_ids,
  is_save: inputForm.outputs.is_save,
  channel_id: ShuffleWorkflow.inputs.channel,
});

const ShuffleFunctionResult = ShuffleWorkflow.addStep(
  ShuffleFunctionDefinition,
  {
    user_ids: inputForm.outputs.user_ids,
    chosen_number: inputForm.outputs.chosen_number,
  },
);

ShuffleWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ShuffleWorkflow.inputs.channel,
  message: ShuffleFunctionResult.outputs.outputString,
});

export default ShuffleWorkflow;

/*
const inputForms = ShuffleWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "だれになるか？",
    interactivity: ShuffleWorkflow.inputs.interactivity,
    submit_label: "選ぶ！",
    fields: {
      elements: [
        {
          name: "group",
          title: "ユーザ",
          type: Schema.types.array,
          items: {
            type: Schema.slack.types.user_id,
          },
        },
        {
          name: "chosen_number",
          title: "何人選ぶ？",
          type: Schema.types.number,
          default: 1,
        },
        {
          name: "is_save_users",
          title: "ユーザを保存",
          description: "選択したユーザを保存します。チャンネルごとに保存されており、\n上書きされます",
          type: Schema.types.boolean,
          default: true,
        },
      ],
      required: ["group", "chosen_number", "is_save_users"],
    },
  },
);
*/
