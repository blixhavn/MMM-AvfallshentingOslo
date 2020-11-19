Module.register("MMM-AvfallshentingOslo", {
    defaults: {
		address: "Maridalsveien 52",
		dateFormat: "dddd Do MMM",
		showHeader: true,
		updateSpeed: 1000,
		refresh: 3600,
		displayIcons: true,
		displayWasteType: false,
		exclusions: ["Restavfall"],
    },

    getScripts: function() {
        return [ "moment.js" ];
	},

	getStyles: function () {
		return ["style.css"];
	  },
	
    getTranslations: function() {
        return {
            nb: "translations/nb.json",
            en: "translations/en.json"
        };
    },

    start: function() {
		var self = this;
		moment.locale(config.language);

        this.journeys = [];
        this.getPickupDates();
        setInterval( function(){
            self.getPickupDates();
        }, this.config.refresh*1000);
	},
	
	getPickupDates: function() {
		Log.info(`Fetching pickup dates for ${this.config.address}`);
		this.sendSocketNotification("GET_PICKUP_DATES", this.config.address);
	},

	getImage: function(wasteType) {
		src = "/modules/MMM-AvfallshentingOslo/img/"
		switch(wasteType) {
			case 'Restavfall':
				src += "restavfall.svg";
				break;
			case "Restavfall til forbrenning":
				src += "brennbar-rest.jpg";
				break;
			case "Papir":
				src += "papir.svg";
				break;
		}
		let icon = document.createElement("img");
		icon.src = src;
		icon.className += ' icon';
		return icon;
	},

    getCell: function(cellText, className) {
        let cell = document.createElement("td");
        if (!!className) {
            cell.className = className;
        }
        cell.innerHTML = cellText;
        return cell;
    },

    getDom: function(){
        let wrapper = document.createElement("div");
        wrapper.className = `light bright`;
        if (this.pickupDates && Object.keys(this.pickupDates).length > 0){
			let table = document.createElement("table");
            if (this.config.showHeader){
                let hrow = document.createElement("div");
                hrow.className = "light small align-right";
                hrow.innerHTML = this.translate('waste_pickup_header')
                wrapper.appendChild(hrow);
			}
			if(Object.keys(this.pickupDates).includes('error')) {
				let row = document.createElement("tr");
				row.appendChild(this.getCell(this.pickupDates.error));
				table.appendChild(row);
			} else {
				for (const [wasteType, pickupDate] of Object.entries(this.pickupDates)){
					let exclusions = this.config.exclusions.map( (excl) => { return excl.toLowerCase(); } );
					if (exclusions.includes(wasteType.toLowerCase())){
						continue;
					}
					let row = document.createElement("tr");
					row.className += "medium";
					if(this.config.displayIcons) {
						let cell = document.createElement("td");
						cell.appendChild(this.getImage(wasteType))
						row.appendChild(cell);
					}
					if(this.config.displayWasteType) {
						row.appendChild(this.getCell(wasteType, "align-left small wasteType light"));
					}
					row.appendChild(this.getCell(moment(pickupDate).local().format(this.config.dateFormat)));
					table.appendChild(row);
				}
			}
            wrapper.appendChild(table);
        } else {
            wrapper.innerHTML = this.translate("LOADING");
        }
        return wrapper;
    },

    socketNotificationReceived: function(message, payload){
        if (message === "PICKUP_DATES"){
			this.pickupDates = payload;
            this.updateDom(this.config.updateSpeed);
        }
    }
});