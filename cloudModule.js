import { useState } from "react";
import { supabase } from "./supabaseClient.js";
import { Alert } from "react-native";
import { File } from "expo-file-system";

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTrips() {
    setLoading(true);

    try {
      const { data, error } = await supabase.from("trips").select("*");

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch trips");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addTrip(latitude, longitude) {
    try {
      const { data, error } = await supabase
        .from("trips")
        .insert({
          latitude,
          longitude,
        })
        .select();

      if (error) throw error;
      if (data) {
        setTrips((prev) => [...prev, data[0]]);
        return data[0].id;
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add trip");
      console.error(error);
    }
  }

  async function deleteTrip(tripId) {
    try {
      const trip = trips.find((m) => m.id === tripId);

      if (trip?.path_to_photo) {
        const photoPath = trip.path_to_photo.split("/").pop();
        await supabase.storage.from("images").remove([photoPath || ""]);
      }

      const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", tripId);

      if (error) throw error;
      setTrips((prev) => prev.filter((m) => m.id !== tripId));
    } catch (error) {
      Alert.alert("Error", "Failed to delete trip");
      console.error(error);
    }
  }

  return {
    trips,
    loading,
    fetchTrips,
    addTrip,
    deleteTrip,
  };
}
