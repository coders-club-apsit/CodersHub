import supabaseClient from "../utils/supabase.js";

export async function getBlogs(token, { blog_id, searchQuery, topic_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("blogs")
    .select("*, topic: topics(name, topic_logo_url), saved: saved_blogs(id)");
  if (blog_id) {
    query = query.eq("blog_id", blog_id);
  }
  if (topic_id) {
    query = query.eq("topic_id", topic_id);
  }
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching blogs :", error);
    return null;
  }
  return data;
}

export async function saveBlog(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);
  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_blogs")
      .delete()
      .eq("blog_id", saveData.blog_id);
    if (deleteError) {
      console.error("Error Deleting saved blogs :", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_blogs")
      .insert([saveData])
      .select();
    if (insertError) {
      console.error("Error fetching blogs :", insertError);
      return null;
    }

    return data;
  }
}

export async function getSingleBlog(token, { blog_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("blogs")
    .select("*, topics(name, topic_logo_url)")
    .eq("id", blog_id)
    .single();
  if (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
  return data;
}

export async function AddNewBlog(token, _, blogData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("blogs")
    .insert([blogData])
    .select();
  if (error) {
    console.error("Error Creating New Blogs :", error);
    return null;
  }
  return data;
}

export async function getSavedBlog(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_blogs")
    .select("* , blog:blogs(*, topic: topics(name, topic_logo_url))");
  if (error) {
    console.error("Error fetching saved Blogs :", error);
    return null;
  }
  return data;
}

export async function getMyBlogs(token, { provider_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("blogs")
    .select("* , topic: topics(name, topic_logo_url)")
    .eq("provider_id", provider_id);
  if (error) {
    console.error("Error fetching Blogs :", error);
    return null;
  }
  return data;
}

export async function deleteBlog(token, { blog_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", blog_id)
    .select();
  if (error) {
    console.error("Error deleting Blogs :", error);
    return null;
  }
  return data;
}

export async function updateBlog(token, _, blogData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("blogs")
    .update({
      title: blogData.title,
      description: blogData.description,
      author_name: blogData.author_name,
      topic_id: blogData.topic_id,
      content: blogData.content,
      author_id: blogData.author_id,
    })
    .eq("id", blogData.id)
    .select();

  if (error) {
    console.error("Error updating blog:", error);
    return null;
  }
  return data;
}

export async function getBlogById(token, blogId) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("blogs")
    .select("*, topics(name, topic_logo_url)")
    .eq("id", blogId)
    .single();

  if (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
  return data;
}