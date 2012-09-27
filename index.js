#!/usr/bin/env node

var exec = require('child_process').exec,
    Table = require('cli-table'),
    CHUNK_RE = /^([* ]) (\S+)\s+([0-9a-f]+) (.+)$/,
    REMOTE_RE = /^remotes\/([\w.-]+)\/([\w.-]+)/,
    branches = {},
    remotes = {},
    heads = {};

function chunk(err, stdout, stderr) {
    var table;

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

    console.log(map(Object.keys(remotes), Object.keys(branches)).toString());
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
        branches[ref] = null; //just track local branches
    }

    if(!remotes.hasOwnProperty(remote)) {
        remotes[remote] = null;
    }

    heads[remote + ',' + branch] = {sha: sha, msg: msg};
}

function map(remotes, branches) {
    var table = new Table({head: [''].concat(remotes)});

    branches.forEach(function(branch) {
        var row = [branch], blank = {sha:''};
        remotes.forEach(function(remote) {
            var head = heads[remote + ',' + branch] || blank;
            row.push(head.sha);
        });
        table.push(row);
    });
    return table;
}

exec('git branch --all --verbose', chunk);
