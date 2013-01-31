git-heads
=========
A small script that summarizes `git branch --all --verbose` into a table, something like:

![screenshot](http://f.cl.ly/items/23421p1s180K0M023L2K/githead-scrnshot.png)

The HEAD commit hashes of all local branches are shown, with those of any corresponding remotes. Checkmarks are used for hashes that are the same as the one to it's left.

Use it like a regular git command to see how the HEADs of your local and remote branches compare. Useful if you have many active git remotes and branches.

install
-------

    npm i -g git-heads

acknowledgments
---------------

Table formatted using Guillermo Rauch's [cli-table](/LearnBoost/cli-table).

See also [michaelklishin/git-wtf](https://github.com/michaelklishin/git-wtf), [drewfish/git-moo](https://github.com/drewfish/git-moo), et al.

license
-------
Copyright (c) 2012 Yahoo! Inc.  All rights reserved.
Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
