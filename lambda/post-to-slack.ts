require('dotenv').config();

import { WebClient } from '@slack/web-api';

// read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// initialize slack web client
const web = new WebClient(token);

export const handler = async (event: any) => {
  // CORS is handled in netlify.toml
  // this is just to provide a prettier response
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'You can use CORS' }),
    };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: `Method Not Allowed. Only POST is allowed.`,
    };
  }

  const { channel: rawChannel, ...rest } = JSON.parse(event.body);

  // clean channel name from unwanted characters
  const channel = rawChannel.replace(/[\s#]/g, '');

  // send the message
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
