module.exports = {


  friendlyName: 'Create call',


  description: 'Creating call with object and meeting ID',


  inputs: {

    meetingCallId: {
      type: 'string',
      example: 'xxxx-xxxxx-xxxxxxx-xxxxx',
      description: 'Meeting call ID',
      required: true
    },
    objectId: {
      type: 'string',
      example: 'objectId: xxxxxx-xxxx-xxx',
      description: 'meeting participant object ID',
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

      global.dicCallResponderDetails = new Array();

      class CallResponderStatusData {
        constructor(objectId,notificationCallId, meetingCallId,  notificationStatus, meetingStatus) {
          this.objectId = objectId;
          this.notificationStatus = notificationStatus;
          this.meetingStatus = meetingStatus;
          this.notificationCallId = notificationCallId;
          this.meetingCallId = meetingCallId;
        }
      }

        const options = {
          url: 'https://graph.microsoft.com/v1.0/communications/calls',
          headers: { 
              'Authorization' : 'Bearer '+ AzureBearerToken,
              'Content-Type' : 'application/json' 
          },
          json: {
              "@odata.type": "#microsoft.graph.call",
              "callbackUri": sails.config.WebHookUrl + "/callback/calling",
              "targets": [
                {
                  "@odata.type": "#microsoft.graph.invitationParticipantInfo",
                  "identity": {
                    "@odata.type": "#microsoft.graph.identitySet",
                    "user": {
                      "@odata.type": "#microsoft.graph.identity",
                      "id": inputs.objectId,
                      "displayName": "displayName",
                    "tenantId":sails.config.bot.TenantID 
                    }
                  }
                }
              ],
              "requestedModalities": [
                "audio"
              ],
              "mediaConfig": {
                "@odata.type": "#microsoft.graph.serviceHostedMediaConfig"  ,
                "preFetchMedia": [
                  {
                    "uri": sails.config.WebHookUrl+"/audio/responder-notification.wav",
                    "resourceId": "f8971b04-b53e-418c-9222-c82ce681a582"
                  },
                  {
                    "uri": sails.config.WebHookUrl +"/audio/responder-transfering.wav",
                    "resourceId": "86dc814b-c172-4428-9112-60f8ecae1edb"
                  }
                ],
              },
              "tenantId":sails.config.bot.TenantID
            }
          };
      sails.log.debug(options); //temp
      
      request.post(options, function(callingErr, callingResponse, callingBody){

          if(!callingErr) {
              sails.log.debug("createCall Response: " + JSON.stringify(callingResponse)); //temp

              var callId=callingResponse.body.id;

              let participantCall = new CallResponderStatusData(inputs.objectId, callId, inputs.meetingCallId);
              dicCallResponderDetails[callId]=participantCall;
        
          } else {
              
            sails.log.error(callingErr);
          }
      });
    } catch(e) {

      sails.log.error(e);
    }


  }
};

