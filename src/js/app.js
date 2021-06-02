import { load as load_template } from './templates';
import * as network from './network';
import * as apps from './apps';
import * as time from './time';
import Mustache from 'mustache';
import {  api, lowcan,signalcomposer  } from 'agl-js-api';


export function niceFormat(unformatted_number){
    return unformatted_number.toLocaleString('de-DE')
}

var rpm_raw = 2400
var rpm_formatted = niceFormat(rpm_raw)

var template;
var page = {
    speed: 50,
    rpm: {
        value: rpm_raw,
        percent: 0
    },
    rpm_value_formatted: rpm_formatted,
    isWarning: true,
    fuel: {
        percent: 75,
        level: 48, //todo gucken ob Einheit Gallonen etc.
        range: 650,
        avg: 25.5
    }
}

var debug_container;
var debug_counter = 0;

export function show() {
    document.body.innerHTML = Mustache.render(template, page);
    network.init(document.getElementById('NetworkContainer'));
    apps.init(document.getElementById('AppsContainer'));
    time.init(document.getElementById('TimeContainer'));
    debug_container = document.getElementById('debug_id');
}


export function init() {
    load_template('main.template.html').then(function(result) {
        template = result;
        Mustache.parse(template);
        show();
        CANinit();
    }, function(error) {
        //console.error('ERRROR loading main template', error);
    });

}


//obd diagnostic
export function CANinit() {

//signal = {'signal': 'wantedsignal'[, 'options': {['average': nb_seconds,] ['minimum': nb_seconds,] ['maximum': nb_seconds] }]};
// var signal_engine_speed = 'engine_speed';    // "diagnostic_messages.engine.speed"
// var signal_vehicle_speed = 'vehicle_speed';    // "diagnostic_messages.vehicle.speed"
// var signal_fuel_level = 'fuel_level';    // "diagnostic_messages.fuel.level"

// console.log(signalcomposer.get(signal_engine_speed));
// console.log(signalcomposer.list());
// file = "../json/sig-demoboard.json"
// signalcomposer.addObjects(file);
// console.log(lowcan.get_list());
// console.log(lowcan.get_signal("messages.engine.speed"));

lowcan.subscribe_by_event(function(data){
    //console.log("can subscribe_by_event CHANGED");
    console.log(data);
    //alert("Value changed.");
    //debug_container.innerHTML = debug_counter;
    //debug_counter = debug_counter + 1; //= data; //this is for debugging purposes
    if (data["name"] == "diagnostic_messages.engine.speed") {
        page.rpm.value = data["value"];
    }
    else if (data["name"] == "diagnostic_messages.vehicle.speed") {
        page.speed = data["value"];
    }
    else if (data["name"] == "diagnostic_messages.fuel.level") {
        page.fuel.level = data["value"];
    }
    page.rpm_value_formatted = niceFormat(page.rpm.value);
    show();
},"diagnostic_messages").then(function(result) {
    //console.log("SUBSCRIBED TO can subscribe_by_event CHANGED");
});

// vehicle_speed
// engine_speed
// fuel_level



// lowcan.subscribe_by_event(function(data){
//     console.log("can subscribe_by_event engine speed CHANGED");
//     console.log(data);
//     alert("Value changed.");
// },"engine_speed").then(function(result) {
//     console.log("SUBSCRIBED TO can subscribe_by_event CHANGED");
// });

// lowcan.subscribe_by_event(function(data){
//     console.log("can subscribe_by_event car speed CHANGED");
//     console.log(data);
//     alert("Value changed.");
// },"vehicle_speed").then(function(result) {
//     console.log("SUBSCRIBED TO can subscribe_by_event CHANGED");
// });

// lowcan.subscribe_by_event(function(data){
//     console.log("can subscribe_by_event fuel level CHANGED");
//     console.log(data);
//     alert("Value changed.");
// },"fuel_level").then(function(result) {
//     console.log("SUBSCRIBED TO can subscribe_by_event CHANGED");
// });

// signalcomposer.subscribe_by_signal(function(data){
//     console.log("subscribe_by_signal CHANGED");
//     console.log(data);
//     alert("Value changed.");
// },signal_engine_speed).then(function(result) {
//     console.log("SUBSCRIBED TO subscribe_by_signal CHANGED");
// });

// signalcomposer.subscribe_by_signal(function(data){
//     console.log("subscribe_by_signal CHANGED");
//     console.log(data);
//     alert("Value changed.");
// },signal_vehicle_speed).then(function(result) {
//     console.log("SUBSCRIBED TO subscribe_by_signal CHANGED");
// });

// signalcomposer.subscribe_by_signal(function(data){
//     console.log("subscribe_by_signal CHANGED");
//     console.log(data);
//     alert("Value changed.");
// },signal_fuel_level).then(function(result) {
//     console.log("SUBSCRIBED TO subscribe_by_signal CHANGED");
// });

}


export function simulate() {
    var counter = 0;
    var interval = setInterval(function() {
        console.log("SIMULATE");
        counter ++;
        if( page.speed < 60 ) {
            page.speed += Math.floor(Math.random()*10);
            if( page.rpm.value < 80/100*5000 ) {
                page.rpm.value += Math.floor(Math.random()*25);
            } else {
                page.rpm.value = 40/100*5000;
            }
        } else if (Math.random() > 0.5 ) {
            page.speed += Math.floor(Math.random()*10);
            page.rpm.value = Math.min(80, Math.floor(Math.random()*90))/100*5000;
        } else {
            page.speed -= Math.floor(Math.random()*10);
            page.rpm.value = Math.min(80, Math.floor(Math.random()*90))/100*5000;
        }

        if(page.fuel.level > 0) {
            if(counter == 100) {
                page.fuel.level = page.fuel.level -1;
            }
        }

        else {
            page.fuel.level = 0;
        }

        page.rpm_value_formatted = niceFormat(page.rpm.value);

        show();

        if( counter > 600 ) {
            clearInterval(interval);
        }
    }, 1000);
}


