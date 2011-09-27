# Tricorder
Tricorder is a web application that uses [RDP Classifer](http://rdp.cme.msu.edu/classifier/classifier.jsp;jsessionid=E26F225EDFF5BE39E4DFF740A35594ED) to place 16s rRNA sequences in a taxonomic hierarchy, and [d3.js](http://mbostock.github.com/d3/) to visualize that hierarchy as a treemap.

# Installation
Tricorder is a [Rails](http://rubyonrails.org/) application, so if you have Ruby and Rails installed, you're most of the way there.  You still need to

1. Download and install the RDP Classifier command line application: [http://rdp.cme.msu.edu/download/rdp_multiclassifier.zip](http://rdp.cme.msu.edu/download/rdp_multiclassifier.zip)

2. Copy <code>config/tricorder.yml.example</code> to <code>config/tricorder.yml</code> and change the path to point toward your RDP Classifier script.

3. Run <code>bundle</code> to install all the dependent gems.

4. Run <code>./script/delayed_job</code> to start the DelayedJob daemon

From there you should be able to start the server locally with <code>rails server</code>, or serve the app publicly in any way you choose.

If you just want to see Tricorder in action, check out [http://genegrabber.berkeley.edu/tricorder/](http://genegrabber.berkeley.edu/tricorder/).

Active development on this project has mostly ceased, but if you want to fork and run with it, have a blast!

# Credits
Tricorder was written by Ken-ichi Ueda, but the original idea belonged to [Chris Miller](https://github.com/csmiller), with input from [Brian Thomas](https://github.com/bcthomas).
