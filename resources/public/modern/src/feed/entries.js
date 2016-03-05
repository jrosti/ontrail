'use strict'

import { Observable } from 'rx'
import {div, span, a} from '@cycle/dom';

// Render current list of entries
export let Entries = (sources) => {   
    const vtree$ = sources.entries$.map( entries =>
        div(".entries", [ 
            entries.map(entry =>
                div('.exercise', [
                    span('.label', `hello ${entry.title}`),
                    a(".pageLink", {dataset: { target: "/entries/user/10"}},`Käyttäjä ${entry.id}`)
                ]))
        ]))
    
    return {
        DOM: vtree$
    }
}
