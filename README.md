# Information panel for a navigation system on Automotive Grade Linux (AGL) operating system

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li>
      <a href="#install-and-run-app">Install and run app</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#preparations">Preparations</a></li>
        <li><a href="#launch-in-browser">Launch in browser</a></li>
        <li><a href="#launch-in-agl-virtual-machine">Launch in AGL virtual machine</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#developer-information">Developer Information</a></li>
  </ol>
</details>



## About

<!--![preview](readme_files/preview8.png)-->
![preview](readme_files/Animation_Snippet.gif)

University project about creating a navigation system for an automotive driving simulator on Automotive Grade Linux (AGL) operating system. 
The navigation system software consists of multiple parts, namely:

- [Persistent information panel of the Instrument Cluster](https://github.com/FabianGermany/Homescreen-Instrument-Cluster) (left part of the Instrument Cluster, also called homescreen)
- [Navigation Screen of the Instrument Cluster](https://github.com/FabianGermany/Navigation-System-Instrument-Cluster) (right part of the Instrument Cluster)
- [Navigation Screen of the Central Console](https://github.com/philipnglr/agl-html5-navigation) (not part of the screenshots below)
- [Routing algorithm](https://github.com/SebEckl/agl-service-routing.git)
- [LED panel for visualization of navigation instructions](https://github.com/mueller-kai/Arduino_LedCode-for-Driving-Simulator)


This repository is about the homescreen (left part of the Instrument Cluster).

<!--![preview](readme_files/preview3.png)-->
![preview](readme_files/Mockup-Separation-into-Apps.png)

The mockup-files created with Figma software can be seen in the mockup folder of the other project [other project](https://github.com/FabianGermany/Navigation-System-Instrument-Cluster).




## Install and run app

This is how to run this software part (repository) in a browser and how to run it inside the AGL virtual machine.

### Prerequisites

For the following steps, you need node.js/npm. If node.js/npm is not installed, make sure to install a suitable node version such as v12.18.4. Very recent versions may not compatible with the remaining software.

This app can run in a browser since it's a HTML app. However, it's recommended to run the software in a AGL virtual machine. For that you need to create an AGL virtual machine using VirtualBox software and find a way to connect this machine to your own operating system. One way is SSH/SCP.


### Preparations

1\. Open a terminal or shell in your operation system
<!--Or in the Linux VM: ssh -p 2222 agl-devel@localhost-->
   
2\. Clone this repo:
   ```
   git clone https://github.com/FabianGermany/Homescreen-Instrument-Cluster.git
   ```

3\. Change the directory:
   ```
   cd Homescreen-Instrument-Cluster
   ```

4\. Install npm packages:
   ```
   npm install
   ```
5\. Build app and create .wgt-file:
   ```
   npm run build
   ```

### Launch in browser


6\. Launch the app:
   ```
   npm start
   ```
7\. Type 
```http://localhost:9001/```
in a browser such as Firefox Developer Edition. 
The app will run in the browser now.


### Launch in AGL virtual machine

8\. Change the directory in order to see the .wgt file:

   ```
   cd package
   ```


9\. Transfer the .wgt file to the AGL system. Depending on your operating system and on how your AGL virtual machine is connected to your current operation system, one way might be using SSH/SCP such as:

   ```
   scp -P 2223 homescreen.wgt root@[IP-Address]:/tmp/
   ```
Instead of ```[IP-Address]``` use your own IP address.
For more information, see our documentation which is not published here on GitHub. If you need the documentation, feel free to get in touch with us. 




10\. Open another terminal in your operating system

11\. Log into your AGL machine. Depending how your AGL virtual machine is connected to your current operating system, one way might be:
   ```
   ssh -p 2223 root@localhost
   ```

12\. Change directory:
   ```
   cd /tmp/
   ```


13\. Install .wgt file on AGL:
   ```
   afm-util install homescreen.wgt
   ```
14\. Reboot AGL machine. It's recommended to reboot at least twice.
   ```
   reboot
   ```

Now the AGL machine will run with the new app/functionality.



## License
For License information please also see the license file and potential other license files inside the used packages.
This app is based on an [AGL template](https://git.automotivelinux.org/apps/html5-homescreen/tree/src). To see more information about the packages of the [other app component](https://github.com/FabianGermany/Navigation-System-Instrument-Cluster) see the license section over there.

## Developer Information
In package.json there is two options:
Original AGL-JS-API:
```
"agl-js-api": "https://github.com/AGL-web-applications/agl-js-api.git#master",
```
Custom one:
```
"agl-js-api": "https://github.com/walzert/agl-js-api.git#master",
```


The custom one is needed if you want to use CAN features. However, this repo has a bug which leads to the loss of ability in include other .wgt-apps. Consequently, there is a few ways to solve that. One way is using the original link and then manually add the CAN functions in the node folder or locally. This particularly includes this code:

```
export function subscribe_by_event(handler,event) {
    return api_subscribe("low-can/subscribe", {
        "event": event
    }, handler);
}
```


