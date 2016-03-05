'use strict'

import 'babel-polyfill'

import { Observable } from 'rx'
import { Entries } from "./feed/entries"
import Cycle from '@cycle/core'
import { makeDOMDriver} from '@cycle/dom'
import { makeRouterDriver, createLocation } from 'cycle-router'


Cycle.run(Entries, {
    DOM: makeDOMDriver('#content-entries'),
    router: makeRouterDriver(createLocation("/entries")),
    entries$: () => Observable.of( [{ "id": 1, "title": "entry 1"}, {"id": 2, "title": "entry 2"} ])
})
console.log("hello ontrail")