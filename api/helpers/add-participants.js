module.exports = {


  friendlyName: 'Add participants',


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

      // Adding participants into Meeting with Join URL( Created in func joinCallwithMeetingUrl)
      const options = {
        url: 'https://graph.microsoft.com/v1.0/communications/calls/' + inputs.participantCallId + '/participants/invite',
        headers: { 
            'Authorization' : 'Bearer ' + AzureBearerToken,
            'Content-Type' : 'application/json' 
         },
        json: {
            "participants": [
              {
                "@odata.type": "#microsoft.graph.invitationParticipantInfo",
                "replacesCallId": inputs.callId,
                "identity": {
                  "@odata.type": "#microsoft.graph.identitySet",
                  "user": {
                    "@odata.type": "#microsoft.graph.identity",
                    "id": inputs.objectId,
                    "displayName": "string"
                  }
                }
              }
            ],
            "clientContext": "f2fa86af-3c51-4bc2-8fc0-475452d9764f"
          }
        };
        sails.log.debug(options); //debug
        request.post(options, function(callingErr, callingResponse, callingBody){
            if(!callingErr) {

                sails.log.debug("addParticipants Response: " + JSON.stringify(callingResponse)); //temp
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

