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
        remote = parts[1];
        branch = parts[2];
    } else {
        remote = 'local';
        branch = ref;
        branches[ref] = null; //index local branches
    }

    if(!remotes.hasOwnProperty(remote)) {
        remotes[remote] = null; //index all remotes
    }

    heads[[remote, branch].join()] = {star: star, sha: sha, msg: msg};
}

function map(remotes, branches) {
    var title = ['branch\\remote'].concat(remotes),
        style = {compact: true, 'padding-left': 1, 'padding-right': 2},
        table = new Table({head: title, style: style});

    function perBranch(branch) {
        var star = heads[['local', branch].join()].star,
            row = [branch + ' ' + star],
            blank = {sha: '✖'},
            prev;

        remotes.forEach(function(remote) {
            var head = heads[[remote, branch].join()] || blank;
            row.push(head.sha === prev ? '✔' : head.sha);
            prev = head.sha;
        });

        table.push(row);
    }

    branches.forEach(perBranch);
    return table;
}

exec('git branch --all --verbose', chunk);
