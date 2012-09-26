#!/usr/bin/env node

var exec = require('child_process').exec,
    Table = require('cli-table'),
    CHUNK_RE = /^([* ]) (\S+)\s+([0-9a-f]+) (.+)$/,
    REMOTE_RE = /^remotes\/([\w.-]+)\/([\w.-]+)/,
    branches = {},
    remotes = {},
    heads = {};

function chunk(err, stdout, stderr) {
    if(err) {
        console.error(stderr);
        return process.exit(err.code);
    }

    stdout.split("\n").forEach(function(str) {
        var parts = str.match(CHUNK_RE);
        if(parts) {
            extract(parts[1], parts[2], parts[3], parts[4]);
        }
    });

    //console.log(Object.keys(remotes), Object.keys(branches));
    //console.log(heads);
    console.log(map(Object.keys(remotes), Object.keys(branches)));
}

function extract(star, ref, sha, msg) {
    var branch,
        remote,
        parts = ref.match(REMOTE_RE);

    if(parts) {
        //this is a remote head
        remote = parts[1];
        branch = parts[2];
    } else {
        //this is a local head
        remote = 'local';
        branch = ref;
        branches[ref] = null;//just track local branches
    }

    if(!remotes.hasOwnProperty(remote)) {
        remotes[remote] = null;
    }

    heads[remote + ',' + branch] = {sha: sha, msg: msg};
}

function map(remotes, branches) {
    var rows = [''].concat(remotes);

    branches.forEach(function(branch) {
        var row = [branch];
        remotes.forEach(function(remote) {
            var head = heads[remote + ',' + branch] || {sha:''};
            row.push(head.sha);
        });
        rows.push(row)
    });
    return rows;
}

exec('git branch --all --verbose', chunk);
