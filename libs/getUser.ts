import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@1.4.0/types.ts";
import { DATASTORE_ID } from "../datastores/user_datastore.ts";

export const getUsers = async (client: SlackAPIClient, channel_id: string) => {
  const result = await client.apps.datastore.get({
    datastore: DATASTORE_ID,
    id: channel_id,
  });

  if (!result.ok) {
    return [];
  }

  return result.item.user_ids;
};
