// import supabaseClient, { supabaseUrl } from "../utils/supabase.js";

// export async function getTopics(token) {
//     const supabase = await supabaseClient(token);

 
//     const { data, error} = await supabase
//       .from("topics")
//       .select("*");

//       if (error) {
//         console.error("Error fetching topics :", deleteError);
//         return null;
//       }
//       return data;
// }

// export async function addNewTopic(token, _, topicData) {
//   const supabase = await supabaseClient(token);

//   const random = Math.floor(Math.random() * 90000);
//   const fileName = `logo-${random}-${topicData.name}`;

//   const { error: storageError } = await supabase.storage
//     .from("topics-logo")
//     .upload(fileName, topicData.logo);

//   if (storageError) throw new Error("Error uploading topic Logo");

//   const topic_logo_url = `${supabaseUrl}/storage/v1/object/public/topics-logo/${fileName}`;

//   const { data, error } = await supabase
//     .from("topics-logo")
//     .insert([
//       {
//         name: topicData.name,
//         topic_logo_url,
//       },
//     ])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Error submitting Companys");
//   }

//   return data;
// }

import { getSupabase } from '@/lib/supabase'

export async function getTopics(token) {
    const supabase = getSupabase(token)
    
    const { data, error } = await supabase
      .from("topics")
      .select("id, name, topic_logo_url");

    if (error) {
        console.error("Error fetching topics:", error);
        throw new Error("Error fetching topics");
    }
    return data;
}

export async function addNewTopic(token, _, topicData) {
  const supabase = await supabaseClient(token);

  try {
    // 1. Upload the logo to storage
    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${topicData.name}`;

    const { error: storageError } = await supabase.storage
      .from("topics-logo")
      .upload(fileName, topicData.logo);

    if (storageError) throw new Error("Error uploading topic Logo");

    // 2. Generate the public URL for the logo
    const topic_logo_url = `${supabaseUrl}/storage/v1/object/public/topics-logo/${fileName}`;

    // 3. Insert the topic with the logo URL
    const { data, error } = await supabase
      .from("topics")
      .insert([
        {
          name: topicData.name,
          topic_logo_url,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      throw new Error("Error submitting topic");
    }

    return data;
  } catch (error) {
    console.error("Error in addNewTopic:", error);
    throw error;
  }
}