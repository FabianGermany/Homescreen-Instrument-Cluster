import { load as load_template } from './templates';
import * as network from './network';
import * as apps from './apps';
import * as time from './time';
import Mustache from 'mustache';

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
        level: 48,
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
}



