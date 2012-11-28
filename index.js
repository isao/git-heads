#!/usr/bin/env node
/**
 * Copyright (c) 2012 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jslint node:true, regexp:true */
'use strict';

var exec = require('child_process').exec,
    Table = require('cli-table'),
    colors = require('cli-table/node_modules/colors'),

    CHUNK_RE = /^([* ]) (\S+)\s+([0-9a-f]+) (.+)$/,
    REMOTE_RE = /^remotes\/([\w.\-]+)\/([\w.\-]+)/,
    msg_len_opt,

    branches = {}, //hash of local branch names[1], no values
    remotes = {},  //hash of remote names[2], no values
    meta = {};     //hash to look up git metadata by 'remote,branch'[3]


function index(star, ref, sha, msg) {
    var branch,
        remote,
        parts = ref.match(REMOTE_RE);

    if (parts) {
        remote = parts[1];
        branch = parts[2];
    } else {
        remote = 'local';
        branch = ref;
        branches[ref] = null; //local branches
    }

    if (!remotes.hasOwnProperty(remote)) {
        remotes[remote] = null; //index all remotes
    }

    meta[[remote, branch].join()] = {star: star, sha: sha, msg: msg};
}

function getMeta(repo, branch) {
    return meta[[repo, branch].join()];
}

function format(meta, local, prev) {
    var out = [];
    if (local === meta.sha) {
        //this column/repo branch head sha is same as local one (1st column)
        out.push('✔ '.green);
    } else {
        out.push(meta.sha);
        //optionally show commit message unless it's the same as prev column
        if (msg_len_opt && (prev !== meta.sha)) {
            out.push(meta.msg.slice(0, msg_len_opt).grey);
        }
    }
    return out.join(' ');
}

function map(remotes, branches) {
    var title = ['branch'].concat(remotes),
        style = {compact: true, 'padding-left': 1, 'padding-right': 2},
        table = new Table({head: title, style: style}),
        blank = {sha: '', msg: ''};

    function perBranch(branch) {
        var localmeta = getMeta('local', branch) || blank,
            star = localmeta.star ? ' ' + localmeta.star : '',
            row = [branch + star.blue],
            lsha = '', //local, for ✔
            psha = ''; //previous, for optional msg dedupe

        function perRow(remote) {
            var head = getMeta(remote, branch) || blank;
            row.push(format(head, lsha, psha));
            if (!lsha) {
            	lsha = localmeta.sha;
            }
            psha = head.sha;
        }

        remotes.forEach(perRow);
        table.push(row);
    }

    branches.forEach(perBranch);
    return table;
}

function chunk(err, stdout, stderr) {
    var table;

    if (err) {
        console.error(stderr);
        return process.exit(err.code);
    }

    stdout.split('\n').forEach(function (str) {
        var parts = str.match(CHUNK_RE);
        if (parts) {
            index(parts[1].trim(), parts[2], parts[3], parts[4]);
        }
    });

    console.log(map(Object.keys(remotes), Object.keys(branches)).toString());
}

colors.mode = process.stdout.isTTY ? 'console' : 'none'; // doesn't work

msg_len_opt = process.argv.length > 2 ? +process.argv.pop() || 18 : 0;

exec('git branch -av', chunk);

/*
1. branches => {
      arrowtests: null,
      connect: null,
      develop: null,
      'develop-perf': null,
      master: null,
      testjs: null
   }

2. remotes => { local: null, my: null, up: null }

3. meta => {
  'local,arrowtests':
   { star: '',
     sha: 'df4666f',
     msg: 'tweak to use MOJITO_DIR instead of path.join etc' },
  'local,connect':
   { star: '',
     sha: '1b1e3b1',
     msg: 'rm useless function wrapper, +lint/strict' },
  'local,develop':
   { star: '*',
     sha: '748e74b',
     msg: 'Merge pull request #740 from isao/develop' },
   ...
*/
