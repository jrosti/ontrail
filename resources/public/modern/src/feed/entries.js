'use strict'

import { Observable } from 'rx'
import {div, span} from '@cycle/dom';

// Render current list of entries
export let Entries = (sources) => {   
    let routes = {
        "/entries": 100
    }

    sources.router.path("/")
        .observable
        .subscribe(() => console.log("got route2 ", arguments))
   
    sources.router.define(routes)
    sources.router.observable
        .subscribe(() => console.log("got route ", arguments))
    
    const vtree$ = sources.entries$.map( entries =>
        div(".entries", [ 
            entries.map(entry =>
                div('.exercise', [
                    span('.label', `hello ${entry.title}`)
                ]))
        ]))
    
    return {
        DOM: vtree$,
        router: Observable.just("/entries")
    }
}
