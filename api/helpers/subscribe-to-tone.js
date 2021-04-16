module.exports = {


  friendlyName: 'Subscribe to tone',


  description: '',


  inputs: {

    callId: {
      type: 'string',
      example: 'xxxx-xxxxx-xxxxxx',
      description: 'communication Id',
      required: true
    },
    callback: {
      type: 'ref',
      example: '{}',
      description: 'callback after response',
      required: true
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    try {

      let subscribeToTonegraphURL = 'https://graph.microsoft.com/v1.0/communications/calls/' + inputs.callId + '/subscribeToTone';
      // PLAY PROMPT
      request.post(
          {
              url:subscribeToTonegraphURL,
              headers: {
                  'Authorization' : 'Bearer ' + AzureBearerToken,
                  'Content-Type' : 'application/json'
               },
              json: 
              {
                  "clientContext": "subscribing-to-tone-client-context",
              }
      }, inputs.callback);

    } catch(e) {

      sails.log.error(e);
    }
  }
};

