import axios from "axios";
import { createError, defineEventHandler, getQuery } from "h3";
import { supabase } from "server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);

  if(!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token not found"
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

  const { data: associates, error: associatesError } = await supabase
    .from("users")
    .select("*")
    .eq("role", "Associate")
  
  if (associatesError) {
    throw createError({
      statusCode: 500,
      statusMessage: associatesError.message,
    });
  }

  return { req_data: [associates]}
});
