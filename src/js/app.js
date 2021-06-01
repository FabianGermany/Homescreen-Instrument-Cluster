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


export function show() {
    document.body.innerHTML = Mustache.render(template, page);
    network.init(document.getElementById('NetworkContainer'));
    apps.init(document.getElementById('AppsContainer'));
    time.init(document.getElementById('TimeContainer'));
}

export function init() {
    load_template('main.template.html').then(function(result) {
        template = result;
        Mustache.parse(template);
        show();
    }, function(error) {
        console.error('ERRROR loading main template', error);
    });

    
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

    //obd diagnostic
    lowcan.subscribe_by_event(function(data){
        console.log("can subscribe_by_event CHANGED");
        console.log(data);
        alert("Value changed.");
        if (data["name"] == "diagnostic_messages.engine.speed") {
            rpm_value_formatted = data["value"];
        }
        else if (data["name"] == "diagnostic_messages.vehicle.speed") {
            speed = data["value"];
        }
        else if (data["name"] == "diagnostic_messages.fuel.level") {
            fuel.level = data["value"];
        }
    },"diagnostic_messages").then(function(result) {
        console.log("SUBSCRIBED TO can subscribe_by_event CHANGED");
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



