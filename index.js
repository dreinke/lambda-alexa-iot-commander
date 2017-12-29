const AWS = require('aws-sdk');

const config = {
  name:  process.env.IOT_NAME, // "Alexa, ask {name}"
  topic:  process.env.IOT_TOPIC,
  endpoint: process.env.IOT_ENDPOINT, // xxxxxxxxxxxxx.iot.us-east-1.amazonaws.com
  region:  process.env.IOT_REGION,
};

const theThing = new AWS.IotData({
  endpoint: config.endpoint,
  region: config.region,
});

function buildResponse(title, output, shouldEndSession) {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: output,
      },
      card: {
        type: 'Simple',
        title: `SessionSpeechlet - ${title}`,
        content: `SessionSpeechlet - ${output}`,
      },
      reprompt: {
        outputSpeech: {
          type: 'PlainText',
          text: "I'm waiting for you!",
        },
      },
      shouldEndSession,
    }
  };
}

function getWelcomeResponse() {
  const cardTitle = "Welcome";
  const speechOutput = `Welcome to ${config.name}. I'm ready!`;
  const shouldEndSession = false;

  return buildResponse(cardTitle, speechOutput, shouldEndSession);
}

function getDefaultResponse() {
  const cardTitle = "Try again";
  const speechOutput = "I didn't understand. Please, try again.";
  const shouldEndSession = false;

  return buildResponse(cardTitle, speechOutput, shouldEndSession);
}

function getIntentResponse(cardTitle, command) {
  if (command) {
    const speechOutput = `Ok, calling ${command}`;
    const shouldEndSession = false;

    return buildResponse(cardTitle, speechOutput, shouldEndSession);
  }

  return getDefaultResponse();
}

function getByeResponse() {
  const cardTitle = "Bye";
  const speechOutput = `Have a nice day!`;
  const shouldEndSession = true;

  return buildResponse(cardTitle, speechOutput, shouldEndSession);
}

function iotPublish(payload) {
  var params = {
    topic: config.topic,
    payload: JSON.stringify(payload)
  };

  theThing.publish(params, (err, data) => {
    if(err) {
      console.log(err);
    } else {
      console.log("success", data);
    }
  });
}

function handleIntent({ slots }, callback) {
  let payload = {};

  if (slots.Command) {
    payload = { command: slots.Command.value };
    iotPublish(payload);
  }

  return payload;
}

exports.handler = ({ request, session }, context, callback) => {
  try {
    console.log(`applicationId=${session.application.applicationId}`);
    console.log(`on${request.type} requestId=${request.requestId}, sessionId=${session.sessionId}`);

    iotPublish({ event: request.type });

    if (request.type === 'LaunchRequest') {
      return callback(null, getWelcomeResponse());
    }

    if (request.type === 'IntentRequest') {
      const intent = request.intent;

      switch(intent.name) {
        case 'CommandIsIntent':
          const payload = handleIntent(intent);
          return callback(null, getIntentResponse(intent.name, payload.command));

        case 'AMAZON.HelpIntent':
          return callback(null, getWelcomeResponse());

        case 'AMAZON.StopIntent':
        case 'AMAZON.CancelIntent':
          return callback(null, getByeResponse());
      }
    }

    return callback(null, getDefaultResponse());
  } catch (err) {
    callback(err);
  }
};
