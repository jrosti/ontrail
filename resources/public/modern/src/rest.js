import Rx from 'rx'
import superagent from 'superagent'
import Lambda from 'core.lambda'
import Validation from 'data.validation'

export const ApiBase = "/rest/v1"

let from = url => `${ApiBase}/${url}`
let to = from

let login = credentials =>
    superagent
        .post(to('/auth/login'))
        .query(credentials)
        .accept("json")

let logout = () => 
    superagent
        .post(to("/auth/logout"))
        .accept("json")

let send = request => callback => request.end(callback)

let validateResponse = (resp) => {
    if (resp.status >= 200 && resp.status < 400)
        return Validation.Success(resp.data)
    return Validation.Failute(resp.error)
}

export const Api = {
    login$: Rx.Observable.fromCallback( Lambda.compose(send)(login) )
        .map(validateResponse),
    logout$: Rx.Observable.fromCallback( Lambda.compose(send)(logout) )
        .map(validateResponse)    
}