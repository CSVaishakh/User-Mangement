import { defineEventHandler, getQuery, createError } from "h3";
import axios from "axios";
import { supabase } from "server/utils/supabase";

export default defineEventHandler (async (event) => {
    const { token, teamid, members } = getQuery(event);

    if(!token) {
        throw createError({
        statusCode: 401,
        statusMessage: "Token not found"
        })
    }

    if(!teamid) {
        throw createError({
        statusCode: 400,
        statusMessage: "Team ID is required"
        })
    }

    if(!members || !Array.isArray(members)) {
        throw createError({
        statusCode: 400,
        statusMessage: "Members array is required"
        })
    }

    const { data: userid } = await axios.get("http://127.0.0.1:5000/verify", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!userid) {
        throw createError({
        statusCode: 403,
        statusMessage: "Invalid Token",
        });
    }

    const { error: teamError } = await supabase
        .from('teams')
        .insert({
            team_id: teamid,
            manager: userid
        })

    if(teamError){
        throw createError({
            statusCode: 401,
            statusMessage: "Team Creation Failed"
        })
    }

    const mapMembers = (members as string[]).map((member: string) => ({
        team_id: teamid,
        member: member
    }))
    
    const { error: membersError } = await supabase
        .from('members')
        .insert(mapMembers)

    if(membersError){
        throw createError({
            statusCode: 401,
            statusMessage: "Members insertion failed"
        })
    }

    return {
        statusCode: 200,
        statusMessage: "Team and members created successfully"
    }
})