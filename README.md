Ptchfrknzb
===========================

Ptchfrknzb is a Chrome browser extension that scrapes the content of a webpage and searches NzbMatrix.

It presents the NzbMatrix search results within the webpage, and lets the user take action.

It's like CouchPotato's Automatic Movie Downloader, but it leaves out the vowels.


### Supported Sites ###
Ptchfrknzb has a plugin system, so you can write plugins for any site. Currently supported sites:

 - Pitchfork.com


### Writing Plugins ###
Plugins are simple to write. Simply implement 2 methods:

 - scrape(): Define how you'd like your plugin to scrape content.
 - place() Define how you'd like to render the results.


### NzbMatrix and Downloads ###
NzbMatrix bookmarks are the supported method of taking action. It's super simple to set up an RSS watch from sabnzbd.
Plugins can provide category id's so the bookmark feeds can be sorted.


### Contributing ###
If there's a site you'd like to see supported, your best bet is to frkndsbmtpllrqst.




### The TODO List: ###

- Add more plugins!
- Add a generic place(), so it's even easier to write plugins.



### LICENSE ###

Copyright 2011, Ticean Bennett

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.