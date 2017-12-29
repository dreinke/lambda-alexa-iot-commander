# The Lambda Alexa IoT Commander WOOOWW

## Lambda
- Create your lambda function
- Don't forget to create the role like this..
  ```
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "iot:*"
        ],
        "Resource": "*"
      }
    ]
  }
  ```
- Set the environment variables
  ```
    IOT_NAME // "Alexa, ask {IOT_NAME}"
    IOT_TOPIC // the one you will subscribe on the device
    IOT_ENDPOINT // you know... xxxxxxxxxxxxx.iot.us-east-1.amazonaws.com
    IOT_REGION, // the iot region DUH
  ```
- Define Alexa Skills Kit as trigger
- Write the ARN id (top right corner) in your left hand

## Alexa
- Go to the [Alexa Dev Portal](https://developer.amazon.com/edw/home.html#/skills)
- Yes, login again :/
- "Alexa Skills Kit - Get started >"
- "Add a New Skill"
- Set the "Name", "Invocation Name" and go ahead
- Ok, now pay attention:
  ### Intent Schema:
  ```
  {
    "intents": [
      {
        "slots": [
          {
            "name": "Command",
            "type": "LIST_OF_COMMANDS"
          }
        ],
        "intent": "CommandIsIntent"
      },
      {
        "intent": "AMAZON.HelpIntent"
      },
      {
        "intent": "AMAZON.StopIntent"
      },
      {
        "intent": "AMAZON.CancelIntent"
      }
    ]
  }
  ```

  ### Type:
  `LIST_OF_COMMANDS`

  ### Enter Values:

  Something like...

  ```
  turn on tv
  turn off tv
  be amazing
  make coffee
  create a new js framework
  ```
  Click "Add"

  ### Sample Utterances:

  `CommandIsIntent {Command}`

- "Next"
- Service Endpoint Type: AWS Lambda ARN (Amazon Resource Name)
- Default: check your left hand ;)
- Next
- Now you can test in the Test Simulator

## IoT
- [Connecting Your Raspberry Pi](http://docs.aws.amazon.com/iot/latest/developerguide/iot-sdk-setup.html)
- Try the [device example](/device)


**Be happy!**
