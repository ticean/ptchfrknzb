Ptchfrknzb
===========================

Ptchfrknzb is a Chrome Extension that scrapes review websites for Artist/Album information. It automatically
searches NzbMatrix for results, and presents information within the webpage.

It's basically CouchPotato's Automatic Movie Downloader for music, but leaves out the vowels.


Supported Sites
------------------------------------------------
As the name suggests, it works with a site that sndslkPtchfrk. That's it for now, but there's room for more.


A SiteFactory is in place. Site objects need to implement 2 methods:

 - scrape() provides site-specific scraping for search terms.
 - place() renders search results out to screen.


If there's a site you'd like to see supported, your best bet is to frkndsbmtpllrqst.


The TODO List:
-----------------------------------
- Fix the ugly stuff.
- Add site support.