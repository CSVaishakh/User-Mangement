export interface User {
    userid : string
    name : string
    email : string
    role : string
    created_at : string
}

export interface Tokens {
    token_id : string
    userid : string
    role : string
    token_type : string
    expires_at : Int8Array
    issued_at : Int8Array
    status : boolean
}