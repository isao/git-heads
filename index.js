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
    CHUNK_RE = /^([* ]) (\S+)\s+([0-9a-f]+) (.+)$/,
    REMOTE_RE = /^remotes\/([\w.\-]+)\/([\w.\-]+)/,
    branches = {}, //hash of local branch names
    remotes = {},  //hash of remote names
    heads = {};    //hash of git head data, keyed by 'remote,branch'

function extract(star, ref, sha, msg) {
    var branch,
        remote,
        parts = ref.match(REMOTE_RE);

    if (parts) {
        remote = parts[1];
        branch = parts[2];
    } else {
        remote = 'local';
        branch = ref;
        branches[ref] = null; //index just the local branches
    }

    if (!remotes.hasOwnProperty(remote)) {
        remotes[remote] = null; //index all remotes
    }

    heads[[remote, branch].join()] = {star: star, sha: sha, msg: msg};
}

function map(remotes, branches) {
    var title = ['branch'].concat(remotes),
        style = {compact: true, 'padding-left': 1, 'padding-right': 2},
        table = new Table({head: title, style: style});

    function perBranch(branch) {
        var star = heads[['local', branch].join()].star,
            row = [branch + ' ' + star],
            blank = {sha: ''},
            prev;

        remotes.forEach(function (remote) {
            var head = heads[[remote, branch].join()] || blank;
            row.push(prev && prev === head.sha ? '✔' : head.sha);
            prev = head.sha;
        });

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
            extract(parts[1], parts[2], parts[3], parts[4]);
        }
    });

    console.log(map(Object.keys(remotes), Object.keys(branches)).toString());
}

exec('git branch -av', chunk);
