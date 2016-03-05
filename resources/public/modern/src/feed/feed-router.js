'use strict'

import { Observable } from 'rx'
import { Entries } from './entries'
import {div, span, a} from '@cycle/dom'
import {ApiBase } from "../api/api"

export let FeedRouter = (sources) => {            
    const entriesRoot = sources.router.path("/entries")
    
    const user$ = entriesRoot.define({
        "/user/:user": user => user
    }).map(({value}) => ({ 
        "url": `${ApiBase}/ex-list-filter?user=${value}&page=1`,
        "category": "feed"
    }))
    
    const latest$ = entriesRoot.define({ 
        "/" : "latest"
    }).doAction(e => console.log("latest", e)).map(({value}) => ({
        "url": `${ApiBase}/ex-list-all/1`,
        "category": "feed"
    }))
           
    const responses$ = sources.HTTP
        .filter(res => res.request.category === "feed")
        .flatMap(x => x)
        .map(res => res.body.results)
        
    responses$    
        .subscribe(e => {
            console.log("resp", e)
        })
             
    const vtree$ = Entries({ entries$: responses$, sources }).DOM
                           
    const pages$ = sources.DOM.select(".pageLink")
        .events('click')
        .map(e => e.target.dataset["target"])
        
    return {
        HTTP: latest$,
//        HTTP: user$.merge(latest$).doAction(u => console.log("url", u)),
        DOM: vtree$,
        router: pages$.startWith("entries/")
    }   
}
