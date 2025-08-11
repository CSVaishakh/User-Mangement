import { createError, defineEventHandler, getQuery } from "h3";
import axios from "axios"
import { supabase } from "server/utils/supabase";

export default defineEventHandler ( async (event) => {
    const { token } = getQuery(event)

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage : "Token not found"
        })
    }

    const { data : userid } = await axios.post("https://localhost:3000/verify",{token})

    if (!userid) {
        throw createError({
            statusCode: 403,
            statusMessage: "Invalid Token"
        })
    }

    const { data: associates, error: associatesError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "associate");

    if (associatesError) {
        throw createError({
            statusCode : 500,
            statusMessage : associatesError.message
        })
    }


    const { data: managers, error: managersError } = await supabase
        .from("users")
        .select("*")
        .eq("role","manager")

    if (managersError) {
        throw createError({
            statusCode : 500,
            statusMessage : managersError.message
        })
    }

    return { req_data: [associates,managers]}
})