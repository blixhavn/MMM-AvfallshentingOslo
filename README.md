# MMM-AvfallshentingOslo

This is a module for [MagicMirror²](https://magicmirror.builders/) to show the next trash pickup dates for any address in Oslo, Norway. It gets the dates by scrapes the [municipal lookup service](https://www.oslo.kommune.no/avfall-og-gjenvinning/avfallshenting/). All of the information on the board can be configured, ensuring you can get the exact look you want.

It uses the [official norwegian icons for waste](https://sortere.no/avfallssymboler), and 

<img src="./img/examples.png">

## Installation

Enter your MagicMirror² module folder, e.g.:

    cd ~/MagicMirror/modules

Clone the repository

    git clone https://github.com/blixhavn/MMM-AvfallshentingOslo.git

Add the module to your configuration file, for instance:

    {
        module: "MMM-AvfallshentingOslo",
        position: "top_right",
        config: {
            address: "Maridalsveien 52",
            dateFormat: "dddd Do MMM",
            showHeader: false,
            updateSpeed: 1000,
            refresh: 3600,
            displayIcons: true,
            displayTrashType: false,
            exclusions: ["Restavfall"],

        }
    },
