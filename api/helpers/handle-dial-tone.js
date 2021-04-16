module.exports = {


  friendlyName: 'Handle dial tone',


  description: 'Handle dialer tone',


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
    dialedTone: {
      type: 'string',
      example: 'https://',
      description: 'dialed tone',
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

      switch(inputs.dialedTone) {
      
        // Play Meeting Joining Audio and add participant into meeting.
        case '1':

            //Play audio to the meeting
            await sails.helpers.playAudioToMeetingTransfer.with({
              participantCallId: inputs.participantCallId, 
              callId: inputs.callId, 
              objectId: inputs.objectId,
              callback: inputs.callback
            });
            
            //Add participants
            await sails.helpers.addParticipants.with({
              participantCallId: inputs.participantCallId,
              callId: inputs.callId,
              objectId: inputs.objectId,
              callback: inputs.callback
            });
           
            sails.log.debug('Adding participant into meeting.'); //temp
        break;
      }

    } catch(e) {

      sails.log.error(e);
    }
  }


};

