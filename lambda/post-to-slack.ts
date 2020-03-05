require('dotenv').config();

import { WebClient } from '@slack/web-api';

// read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// initialize slack web client
const web = new WebClient(token);

const headers = {
  'Access-Control-Allow-Origin': '*',
};

export const handler = async (event: any) => {
  try {
    // CORS
    if (event.httpMethod === 'OPTIONS') {
      return {
        headers,
        statusCode: 200,
      };
    }
    if (event.httpMethod !== 'POST') {
      return {
        headers,
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
      headers,
      statusCode: 200,
      body: JSON.stringify({
        message: `Message sent to #${channel}`,
      }),
    };
  } catch (e) {
    console.log(e);
    console.log('Event failed:', event);
    return {
      headers,
      statusCode: 500,
      body: 'Something went wrong, please check your request and try again!',
    };
  }
};
