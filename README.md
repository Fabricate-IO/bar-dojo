# tavern-manager

[![CircleCI](https://circleci.com/gh/Fabricate-IO/tavern-manager.svg?style=svg)](https://circleci.com/gh/Fabricate-IO/tavern-manager) [![codecov](https://codecov.io/gh/Fabricate-IO/tavern-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/Fabricate-IO/tavern-manager)


A handy web app for managing a bar

## Setup

install Node, Rethink, `npm install && npm install -g gulp lab`

Create `BarDojo` db in Rethink: `r.dbCreate('BarDojo')`

run `npm test` to make sure everything's good

run `gulp` in the background to watch for file changes

run `npm start` to start the server

## References

Powered by React, [Material-UI](http://www.material-ui.com/), [RethinkDB](https://rethinkdb.com/api) via [RethinkDbDash](https://github.com/neumino/rethinkdbdash), [Splitwise](http://dev.splitwise.com/dokuwiki/doku.php?id=index)

Some coktail information borrowed from [TheCocktailDb](http://www.thecocktaildb.com/)