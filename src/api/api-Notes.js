import supabaseClient from "../utils/supabase.js";

export async function getNotes(token, { note_id, searchQuery, topic_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("notes")
    .select("*, topic: topics(name, topic_logo_url), saved: saved_notes(id)");
  if (note_id) {
    query = query.eq("note_id", note_id);
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

export async function saveNote(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);
  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_notes")
      .delete()
      .eq("note_id", saveData.note_id);
    if (deleteError) {
      console.error("Error Deleting saved blogs :", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_notes")
      .insert([saveData])
      .select();
    if (insertError) {
      console.error("Error fetching blogs :", insertError);
      return null;
    }

    return data;
  }
}

export async function getSingleNote(token, { note_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("notes")
    .select("*, topics(name, topic_logo_url)")
    .eq("id", note_id)
    .single();
  if (error) {
    console.error("Error fetching note:", error);
    return null;
  }
  return data;
}

export async function addNewNote(token, _, noteData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("notes")
    .insert([noteData])
    .select();
  if (error) {
    console.error("Error Creating New Blogs :", error);
    return null;
  }
  return data;
}

export async function getSavedNotes(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_notes")
    .select("* , note:notes(*, topic: topics(name, topic_logo_url))");
  if (error) {
    console.error("Error fetching saved Blogs :", error);
    return null;
  }
  return data;
}

export async function getMyNotes(token, { provider_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("notes")
    .select("* , topic: topics(name, topic_logo_url)")
    .eq("provider_id", provider_id);
  if (error) {
    console.error("Error fetching Blogs :", error);
    return null;
  }
  return data;
}

export async function deleteNote(token, { note_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", note_id)
    .select();
  if (error) {
    console.error("Error deleting Blogs :", error);
    return null;
  }
  return data;
}

export async function updateNote(token, _, noteData) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("notes")
    .update({
      title: noteData.title,
      description: noteData.description,
      topic_id: noteData.topic_id,
      content: noteData.content,
      author_id: noteData.author_id,
    })
    .eq("id", noteData.id)
    .select();

  if (error) {
    console.error("Error updating note:", error);
    return null;
  }
  return data;
}

export async function getNoteById(token, noteId) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("notes")
    .select("*, topics(name, topic_logo_url)")
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("Error fetching note by ID:", error);
    return null;
  }
  return data;
}