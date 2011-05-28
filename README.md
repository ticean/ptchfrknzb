Ptchfrknzb
===========================

Ptchfrknzb is a Chrome Extension that scrapes websites for search terms and searches NzbMatrix for results.
It presents search results within the webpage, and lets the user take action.

It's like CouchPotato's Automatic Movie Downloader, but it leaves out the vowels.


### NzbMatrix and Downloads ###
NzbMatrix bookmarks are the supported method of taking action. It's super simple to set up an RSS watch from sabnzbd.
Plugins can provide category id's so the bookmark feeds can be sorted.



### Supported Sites ###
Ptchfrknzb currently supports searching while browsing album reviews on Pitchfork.com.

But is designed to be extensible. Plugins can be written for any site. IMDB and others are on the short list.



### Writing Plugins ###
Plugins are fairly simple to write. Simply implement 2 methods:

 - scrape() provides site-specific scraping for search terms.
 - place() renders search results out to screen.

Plugins can also set some basic NzbMatrix settings.



### Contributing ###
If there's a site you'd like to see supported, your best bet is to frkndsbmtpllrqst.




### The TODO List: ###
- Fix the ugly stuff.
- Add more plugins!


-----------------------------------

### LICENSE ###

Copyright 2011, Ptchfrknzb.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.