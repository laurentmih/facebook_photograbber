__This is arguably the most efficient way to get banned from Facebook for violating their TOS. Use at your own risk__

# Introduction
Hi and welcome to this fantastic exercise in breaking all JS etiquette, wildly ignoring Facebook's TOS and general JavaScriptastic shenanigans. This plugin gives you the control Facebook took from you, namely downloading all the pictures you're tagged in. I had alarmingly little reason to be working on this, so it's probably best if you just keep reading.

# Instructions:
* Go to Facebook
* Search for `Photos of $YOURNAME`
* Click on the top hit that says something like `Photos of $YOURNAME`
* Once the page is loaded, hit the extension's button
* It will attempt to scroll down automagically in order to load all your pictures
* It then scrolls back up to prevent loading anything else (thank Facebook for that type of nonsense)
* Every 10 seconds it will attempt to load a full-sized image
* Because of ~~Facebook's offensively bloated lightbox monstrosity~~ some JavaScript inefficienties, there's a 4 second timeout __after__ that
* Let it run for a while so it downloads files named like `image-xxx`, where `xxx` is a zero-padded number
* ?????
* Profit

# Stuff you should probably know before running this
I've been giving this plugin a run on nearly 400 images, with an ok internet connection. Memory usage for that particular tab tends to spike though, so be warned, don't run this on your Pentium box.
