module.exports = {


  friendlyName: 'Get oauth 2 token microsoftonline',


  description: 'Get oauth token from microsoftonline.com',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Oauth 2 token microsoftonline',
    },

  },


  fn: async function (inputs) {

    try {

      /****************************************************************************
      *                                                                           *
      * Whether to expose the locally-installed request as a global variable      *
      * (`request`), making  it accessible throughout your app.                   *
      *                                                                           *
      ****************************************************************************/

      global.request =  require('request');
      
      // Get oauth 2 token microsoftonline.
      var oauth2TokenMicrosoftonline;

      var tokenEndpoint = 'https://login.microsoftonline.com/' + sails.config.bot.TenantID + '/oauth2/v2.0/token';

      request.post({
          url: tokenEndpoint,
          form: {
              grant_type: 'client_credentials',
              client_id: sails.config.bot.MicrosoftAppId,
              client_secret: sails.config.bot.MicrosoftAppPassword,
              scope: 'https://graph.microsoft.com/.default'
          }
      }, function (err, res, body) {
          if(err) {
            
            sails.log.error(err);
          } else {

          //Storing in global variable
          AzureBearerToken = JSON.parse(body).access_token
          sails.log.debug(`Azure bearer token from microsoftonline.com: ${AzureBearerToken.substring(0, 25)}...`);
          sails.log.debug("Waiting for calls to be placed...");
          }
      });
    } catch(e) {

      sails.log.error(e);
    }

    // Send back the result through the success exit.
    return oauth2TokenMicrosoftonline;

  }


};

