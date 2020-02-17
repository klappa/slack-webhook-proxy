require('dotenv').config();

import { WebClient } from '@slack/web-api';

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const web = new WebClient(token);

export const handler = async (event: any) => {
  const { channel: rawChannel, ...rest } = JSON.parse(event.body);

  const channel = rawChannel.replace(/[\s#]/g, '');
  await web.chat.postMessage({
    channel,
    ...rest,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Message sent to #${channel}`,
    }),
  };
};
