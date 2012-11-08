git-heads
=========
A small script that summarizes `git branch --all --verbose` into a table, something like:

    % cd my/git/repo
    % git heads
![screenshot](http://f.cl.ly/items/3m460b2N191t3s3T1S1p/Image%202012.11.07%205:42:40%20PM.png)

The HEAD commit hashes of all local branches are shown, with those of any corresponding remotes. Checkmarks are used for hashes that are the same as the one to it's left.

Use it like a regular git command to see how the HEADs of your local and remote branches compare. Useful if you have many active git remotes and branches.

install
-------

    npm i -g git-heads

acknowledgments
---------------

Table formatted using Guillermo Rauch's `cli-table`.

See also [michaelklishin/git-wtf](https://github.com/michaelklishin/git-wtf), [drewfish/git-moo](https://github.com/drewfish/git-moo), et al.

license
-------
Copyright (c) 2012 Yahoo! Inc.  All rights reserved.
Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
