import { createError, eventHandler, getQuery } from "h3";
import { supabase } from "../../utils/supabase";

export default eventHandler(async (event) => {
    const { userId,role } = getQuery(event)

    if (!userId || !role) {
        throw createError({
            statusCode: 400,
            statusMessage: "Insufficient Data"
        })
    }

    const { data : checkUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("userid",userId)
        .single()

    if (checkError) {
        throw createError({
            statusCode: 500,
            statusMessage: checkError.message
        })
    }

    if (!checkUser) {
        throw createError({
            statusCode: 404,
            statusMessage: "User not found"
        })
    }

    if (checkUser.role) {
        throw createError({
            statusCode: 409,
            statusMessage: "User aldready has a role"
        })
    }

    const { error: putError } = await supabase
        .from("users")
        .update({role: role})
        .eq("userid",userId)
    
    if (putError) {
        throw createError({
            statusCode: 500,
            statusMessage: "Role of user not Added"
        })
    }

    return { message : "Role Added"}
})