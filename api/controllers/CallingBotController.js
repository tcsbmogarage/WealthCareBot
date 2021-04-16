/**
 * CallingBotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    //raise incident end point
    raiseIncident: async function(req, res) {
        
        var response = {}
        try {

            sails.log.debug('Creating CALL...'); //temp
    
            var rexp = new RegExp("\\b" + sails.config.bot.ThreadRegex + "\\b")
            var threadID = "blank";
            var match = rexp.exec(decodeURIComponent(req.body.joinURL));

            if(match != null && match.length > 0)
                threadID = match[1]
            else
                throw new Error("Couldn't parse meeting Thread ID from the URL invite.")

            sails.log.debug("ThreadID: "+ threadID); //temp

            var result = await sails.helpers.joinCallWithMeetingUrl.with({ 
                threadId: threadID, 
                objectIds: req.body.objectIds,
                callback: (result) => {

                    return res.status(200).json(result);
                }
            });

        } catch(e) {

            sails.log.error(e);
            response = res.status(500).json({err: e.msg});
            return response;
        }

    },

    //callback from teams end point
    arrangeMeeting: async function(req, res) {

        try {

            res.send(202);

            let callId = req.body.value[0].resourceUrl.split("/")[3];

            if ((req.body.value[0].resourceData).hasOwnProperty('state')) {

                sails.log.debug("callback resourceData= "+ JSON.stringify(req.body.value[0].resourceData)); //temp
                var state = req.body.value[0].resourceData.state;
                sails.log.debug("callback state= "+ state) //temp

                switch(state) {
                
                    // CALL ESTABLISHING
                    case 'establishing':

                        sails.log.debug('The call establishing... :D'); //temp
                    break;
            
                    // CALL ESTABLISHED
                    case 'established':

                        // CALL ESTABLISHED, PLAY MEDIA PROMPT
                        if ((req.body.value[0].resourceData).hasOwnProperty('mediaState')) {

                            sails.log.debug('Call Established. Press 1 to join meeting'); //temp
                            
                            //Play guidance audio
                            await sails.helpers.playAudioToDialTone.with({
                                callId: callId,
                                callback: (err, res, body) => {
                                    
                                    if(err) {

                                        sails.log.error(err);
                                    } else {

                                        sails.log.debug(body); //temp
                                        sails.log.debug("Successfully played the tone :D"); //temp
                                    }
                                }
                            });
                            
                            //Subscribe to tone
                            await sails.helpers.subscribeToTone.with({
                                callId: callId,
                                callback: (err, res, body) => {
                                    
                                    if(err) {

                                        sails.log.error(err);
                                    } else {

                                        sails.log.debug(body); //temp
                                        sails.log.debug("Successfully subsribed to tone :D"); //temp
                                    }
                                }
                            });
                            
                        }

                        // ACT ON TONE RECEIVED
                        if ((req.body.value[0].resourceData).hasOwnProperty('toneInfo')) {

                            let participantObj = dicCallResponderDetails[callId];
                            let dialedTone = (req.body.value[0].resourceData.toneInfo.tone).substr(-1);             
                            sails.log.debug('You pressed the tone ' + dialedTone); //temp
                            await sails.helpers.handleDialTone.with({
                                participantCallId: participantObj.meetingCallId,
                                callId: callId, 
                                dialedTone: dialedTone,
                                objectId: participantObj.objectId,
                                callback: (err, res, body) => {
                                    
                                    if(err) {

                                        sails.log.error(err);
                                    } else {

                                        sails.log.debug(body); //temp
                                        sails.log.debug("Successfully run a tone :D"); //temp
                                    }
                                }
                            });
                        }
                    break;

                    // CALL BEING TERMINATED
                    case 'terminating':

                        sails.log.debug('The call is terminating... :('); //temp
                    break;
            
                    // CALL TERMINADA
                    case 'terminated':

                        sails.log.debug('Call Terminated :/'); //temp
                    break;
            
                    // DEFAULT ROUTE
                    default:
                }

            } else {

                    //throw new Error("Invalid request towards callback/calls");
            }
        } catch (e) {

            sails.log.error(e);
            response = res.status(500).json({err: e.msg});
            return response;
        }
    },
};

