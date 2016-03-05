'use strict'

import 'babel-polyfill'

import { Observable } from 'rx'
import { FeedRouter } from "./feed/feed-router"
import Cycle from '@cycle/core'
import { makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import { makeRouterDriver, createLocation } from 'cycle-router'


Cycle.run(FeedRouter, {
    HTTP: makeHTTPDriver(),
    DOM: makeDOMDriver('#content-entries'),
    router: makeRouterDriver({ hash: true }),
    entries$: () => Observable.of( [{ "id": 1, "title": "entry 1"}, {"id": 2, "title": "entry 2"} ])
})
console.log("hello ontrail")