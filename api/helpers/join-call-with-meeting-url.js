module.exports = {


  friendlyName: 'Join call with meeting url',


  description: 'Join meeting with objectids and URL',


  inputs: {
    
    threadId: {
      type: 'string',
      example: 'https://www.meetingonline.com/19:xxxx',
      description: 'threadId',
      required: true
    },
    objectIds: {
      type: 'ref',
      example: 'objectIds: []',
      description: 'meeting participants object ID',
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
    
      var result = {};
      try {

        var meetingCallId='';

        //Calling Teams
        const options = {
          url: 'https://graph.microsoft.com/v1.0/communications/calls',
          headers: { 
              'Authorization' : 'Bearer '+ AzureBearerToken,
              'Content-Type' : 'application/json' 
          },
          json: {
              "@odata.type": "#microsoft.graph.call",
              "callbackUri": sails.config.WebHookUrl + "/callback/calling",
              "requestedModalities": [
                "audio"
              ],
              "mediaConfig": {
                "@odata.type": "#microsoft.graph.serviceHostedMediaConfig",
                "preFetchMedia": [
                  {
                      "uri": sails.config.WebHookUrl  +"/audio/responder-notification.wav",
                      "resourceId": "f8971b04-b53e-418c-9222-c82ce681a582"
                    },
                    {
                      "uri": sails.config.WebHookUrl  +"/audio/responder-transfering.wav",
                      "resourceId": "86dc814b-c172-4428-9112-60f8ecae1edb"
                    }
                ],
              },
              "chatInfo": {
                "@odata.type": "#microsoft.graph.chatInfo",
                "threadId": inputs.threadId,
                "messageId": "0"
              },
              "meetingInfo": {
                "@odata.type": "#microsoft.graph.organizerMeetingInfo",
                "organizer": {
                  "@odata.type": "#microsoft.graph.identitySet",
                  "user": {
                    "@odata.type": "#microsoft.graph.identity",
                    "id": sails.config.bot.MeetingOrganizerObjectId,
                    "displayName": "MS Graph API User",
                    "tenantId":sails.config.bot.TenantID
                  }
                },
                "allowConversationWithoutHost": true
              },
              "tenantId":sails.config.bot.TenantID 
            } 
      };
      meetingCallId = 'blank';
      request.post(options, async function(callingErr, callingResponse, callingBody){
          if(!callingErr) {
              sails.log.debug("joinCallwithMeetingUrl Response: " + JSON.stringify(callingResponse)); //temp
              sails.log.debug("Response from Communication calls **** "); //temp
              sails.log.debug(callingResponse.body); //temp
              let meetingCallId= callingResponse.body.id;
              for (let index = 0; index < inputs.objectIds.length; index++) {
                  const objectId = inputs.objectIds[index];
                  //Calling each participant
                  await sails.helpers.createCall.with({ 
                    meetingCallId: meetingCallId,
                    objectId: objectId
                  });
              }

              result = { "callId": meetingCallId };
              inputs.callback(result);
          } else {

              sails.log.error(callingErr);
          }
      });
    } catch(e) {

      sails.log.error(e);
    }    
  }


};

