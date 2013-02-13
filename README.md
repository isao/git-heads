git-heads
=========
A small script that summarizes `git branch --all --verbose` into a table, so you can see if you need to push or fetch/pull from particular remote and branch combination. Useful if you have many active git remotes and branches.

![screenshot](http://f.cl.ly/items/23421p1s180K0M023L2K/githead-scrnshot.png)

The HEAD commit hashes of all local branches are shown, with those of any corresponding remotes. Checkmarks are used in place of remote HEAD hashes that are the same the local repo HEAD's.

Use it like a regular git command (i.e. `% git heads`) when it's installed in your `$PATH`.

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
