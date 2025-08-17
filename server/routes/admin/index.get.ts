import { createError, defineEventHandler, getQuery } from "h3";
import axios from "axios"
import { supabase } from "../../utils/supabase"

export default defineEventHandler ( async (event) => {
    const { token } = getQuery(event)

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage : "Token not found"
        })
    }

    const { data : userid } = await axios.get("http://127.0.0.1:5000/verify", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
    console.log(token)

    if (!userid) {
        throw createError({
            statusCode: 403,
            statusMessage: "Invalid Token"
        })
    }

    const { data: associates, error: associatesError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Associate");

    if (associatesError) {
        throw createError({
            statusCode : 500,
            statusMessage : associatesError.message
        })
    }


    const { data: managers, error: managersError } = await supabase
        .from("users")
        .select("*")
        .eq("role","Manager")

    if (managersError) {
        throw createError({
            statusCode : 500,
            statusMessage : managersError.message
        })
    }

    const { data: admins, error: adminsError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Admin");

    if (adminsError) {
        throw createError({
            statusCode : 500,
            statusMessage : adminsError.message
        })
    }

    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .is("role",null)

    if (usersError) {
        console.log("invalid 4")
        throw createError({
            statusCode : 500,
            statusMessage : usersError.message
        })
    }

    return { req_data: [admins,managers,associates,users]}
})