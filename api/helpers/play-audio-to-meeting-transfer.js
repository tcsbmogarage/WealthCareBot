module.exports = {


  friendlyName: 'Play audio to meeting transfer',


  description: '',


  inputs: {

    participantCallId: {
      type: 'string',
      example: 'xxxx-xxxxx-xxxxxx',
      description: 'communication Id',
      required: true
    },
    callId: {
      type: 'string',
      example: 'xxxx-xxxxx-xxxxxx',
      description: 'communication Id',
      required: true
    },
    objectId: {
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
                      "uri": sails.config.WebHookUrl  +"/audio/responder-transfering.wav",
                      "resourceId": "86dc814b-c172-4428-9112-60f8ecae1edb"
                  }
                  }
              ],
              "loop": false
          }
          };
      sails.log.debug(options); //debug
      request.post(options, function(callingErr, callingResponse, callingBody){
          if(!callingErr) {
              sails.log.debug("playAudioToMeetingTransfer Response: " + JSON.stringify(callingResponse)); //temp
              inputs.callback(callingErr, callingResponse, callingBody);
          } else {
              sails.log.error(callingErr);
          }
      });

    } catch(e) {

      sails.log.error(e);
    }
  }


};

