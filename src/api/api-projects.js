import supabaseClient from "../utils/supabase.js";

export async function getProjects(token, { project_id, searchQuery, topic_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("projects")
    .select("*, topic: topics(name, topic_logo_url), saved: saved_projects(id)");
  if (project_id) {
    query = query.eq("project_id", project_id);
  }
  if (topic_id) {
    query = query.eq("topic_id", topic_id);
  }
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching projects :", error);
    return null;
  }
  return data;
}

export async function saveProject(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);
  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_projects")
      .delete()
      .eq("project_id", saveData.project_id);
    if (deleteError) {
      console.error("Error Deleting saved projects :", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_projects")
      .insert([saveData])
      .select();
    if (insertError) {
      console.error("Error fetching projects :", insertError);
      return null;
    }

    return data;
  }
}

export async function getSingleProject(token, { project_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("projects")
    .select("*, topics(name, topic_logo_url)")
    .eq("id", project_id)
    .single();
  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }
  return data;
}

export async function addNewProject(token, _, projectData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("projects")
    .insert([projectData])
    .select();
  if (error) {
    console.error("Error Creating New project :", error);
    return null;
  }
  return data;
}

export async function getSavedProjects(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_projects")
    .select("* , project:projects(*, topic: topics(name, topic_logo_url))");
  if (error) {
    console.error("Error fetching saved projects :", error);
    return null;
  }
  return data;
}

export async function getMyProjects(token, { provider_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("projects")
    .select("* , topic: topics(name, topic_logo_url)")
    .eq("provider_id", provider_id);
  if (error) {
    console.error("Error fetching projects :", error);
    return null;
  }
  return data;
}

export async function deleteProject(token, { project_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", project_id)
    .select();
  if (error) {
    console.error("Error deleting projects :", error);
    return null;
  }
  return data;
}

export async function updateProject(token, _, projectData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("projects")
    .update({
      title: projectData.title,
      description: projectData.description,
      topic_id: projectData.topic_id,
      content: projectData.content,
      author_id: projectData.author_id,
    })
    .eq("id", projectData.id)
    .select();

  if (error) {
    console.error("Error updating project:", error);
    return null;
  }
  return data;
}

export async function getProjectById(token, projectId) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("projects")
    .select("*, topics(name, topic_logo_url)")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
  return data;
}