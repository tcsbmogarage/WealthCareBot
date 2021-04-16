module.exports = {


  friendlyName: 'Play audio to dial tone',


  description: 'Play guidance audio to initiate the call',


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

      let playPromptgraphURL = 'https://graph.microsoft.com/v1.0/communications/calls/' + inputs.callId + '/playPrompt';
   
      const options = {
          url: playPromptgraphURL,
          headers: { 
              'Authorization' : 'Bearer ' + AzureBearerToken,
              'Content-Type' : 'application/json' 
           },
          json:  {
              "clientContext": "playprompt-client-context",
              "prompts": [
                  {
                  "@odata.type": "#microsoft.graph.mediaPrompt",
                  "mediaInfo": {
                      "@odata.type": "#microsoft.graph.mediaInfo",
                      "uri": sails.config.WebHookUrl  +"/audio/responder-notification.wav",
                      "resourceId": "f8971b04-b53e-418c-9222-c82ce681a582"
                  }
                  }
              ],
              "loop": false
          }
          };
      sails.log.debug(options); //debug
      request.post(options, inputs.callback);

    } catch(e) {

      sails.log.error(e);
    }
  }


};

