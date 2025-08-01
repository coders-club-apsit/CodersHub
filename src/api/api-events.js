import { supabase } from "../utils/supabase.js";

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return null;
  }
  return data;
}

export async function getEventById(eventId) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }
  return data;
}

export async function addNewEvent(eventData) {
  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select();

  if (error) {
    console.error("Error creating new event:", error);
    return null;
  }
  return data;
}

export async function deleteEvent(id) {
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }

  return data;
}
