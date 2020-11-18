const NodeHelper = require("node_helper");
const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");
const Log = require("../../js/logger");


module.exports = NodeHelper.create({

    start: function(){
        console.log("Starting node helper for: " + this.name);
    }, 

    getPickupDates: function(address) {
        self = this;
        address = address.replace(' ', '+');
        url = `https://www.oslo.kommune.no/avfall-og-gjenvinning/avfallshenting/?sid=&street=${address}`;
        request.get(url, function(error, response) {
            const pickup_dates = Object();
            const $ = cheerio.load(response.body);
            
            hits = $('div.ioRenSearchData tbody tr');
            if (hits.length) {
                hits.each((_idx, el) => {
                    let category = $(el).find('td:nth-child(1)').text();
                    let pickup_date = moment(
                        $(el).find('td:nth-child(2)').text().split(' ')[1],
                        'DD.MM.YYYY'
                    );
                    if (!Object.keys(pickup_dates).includes(category)) {
                        pickup_dates[category] = pickup_date;
                    }
                });
            }
    
            if(Object.keys(pickup_dates).length == 0) {
                Log.error(`${self.name}: No trash pickup found for configured address`);
            }
            self.sendSocketNotification('PICKUP_DATES', pickup_dates);
        });
    },

    socketNotificationReceived: function(message, payload){
        if (message === "GET_PICKUP_DATES"){
            this.getPickupDates(payload);
        }
    }

});
