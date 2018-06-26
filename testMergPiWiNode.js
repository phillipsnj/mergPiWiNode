'use strict';

const pcCbus = require('mergethnode')
//const pcCbus = require('../mergEthNode/mergEthNode')
const Gpio = require('onoff').Gpio;

const file = './nodeConfig.json'

const NET_PORT = 5550;
const NET_ADDRESS = "mergDev0";

let node = new pcCbus.mergEthNode(file,NET_ADDRESS,NET_PORT);

console.log('New Node :'+node.nodeId)
console.log('New Name :'+node.name)
//console.log('Action 2 :'+node.actions['90'])
//console.log(`New Actions :${JSON.stringify(node.actions)}`)

const argv = require('minimist')(process.argv.slice(2))

const redLed = new Gpio(22, 'out');
const yellowLed = new Gpio(23, 'out');
const greenLed = new Gpio(24, 'out');
const button = new Gpio(17, 'in', 'both');

button.watch(function(err, value) {
    //redLed.writeSync(value);
    if (value == 0){
        node.cbusSend(node.ACON(1));
    } else {
        node.cbusSend(node.ACOF(1));
    }
});

node.on('event', function (task) {
    console.log(`Event :${JSON.stringify(task)}`)
    if (task.variable[1] == 1){
        if (task.type == 'on'){
            console.log(`Task 1 On`)
            redLed.writeSync(1)
        } else {
            console.log(`Task 1 Off`)
            redLed.writeSync(0)
        }
    }
    if (task.variable[2] == 1) {
        if (task.type == 'on') {
            console.log(`Task 2 On`)
            yellowLed.writeSync(1);
        } else {
            console.log(`Task 2 Off`)
            yellowLed.writeSync(0)
        }
    }
    if (task.variable[3] == 1) {
        if (task.type == 'on') {
            console.log(`Task 3 On`)
            greenLed.writeSync(1);
        } else {
            console.log(`Task 3 Off`)
            greenLed.writeSync(0)
        }
    }
})

if (argv.setup) {
    console.log(`Set TEACH_MODE = True`)
    //node.setTeachModeTrue()
    node.TEACH_MODE = true
    node.cbusSend(node.RQNN())
} else {
    node.cbusSend(node.ASON(1))
}


