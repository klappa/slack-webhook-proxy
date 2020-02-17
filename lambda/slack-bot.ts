require('dotenv').config();

import { WebClient } from '@slack/web-api';

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token);

export const handler = async (event, context) => {
  const { channel: rawChannel, ...rest } = JSON.parse(event.body);

  const channel = rawChannel.replace(/[\s#]/g, '');
  const groups = await web.groups.list();
  if (groups.ok && Array.isArray(groups.groups) && groups.groups.length > 0) {
    const foundChannel = groups.groups.find(a => a.name === channel);
    if (foundChannel) {
      await web.chat.postMessage({
        channel: foundChannel.id,
        ...rest,
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Message sent to #${channel}`,
        }),
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: `Did not find the channel, please make sure to invite it to your channel!`,
    }),
  };
};
