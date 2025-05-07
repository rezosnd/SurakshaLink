
import { useState, useEffect } from "react";

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  locationName: string | null;
  error: string | null;
  loading: boolean;
}

const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    locationName: null,
    error: null,
    loading: true
  });

  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      let locationName = "Unknown location";
      
      if (data && data.display_name) {
        const addressParts = [];

        if (data.address) {
          if (data.address.road) addressParts.push(data.address.road);
          if (data.address.suburb) addressParts.push(data.address.suburb);
          if (data.address.city) addressParts.push(data.address.city);
          if (data.address.state) addressParts.push(data.address.state);
          if (data.address.country) addressParts.push(data.address.country);
        }
        
        locationName = addressParts.length > 0 
          ? addressParts.join(", ")
          : data.display_name.split(",").slice(0, 3).join(",");
      }
      
      return locationName;
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Location name unavailable";
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        locationName: null,
        error: "Geolocation is not supported by your browser",
        loading: false
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const locationName = await getLocationName(lat, lng);

        localStorage.setItem('lastLocation', JSON.stringify({
          lat,
          lng,
          address: locationName
        }));
        
        setState({
          location: { lat, lng },
          locationName,
          error: null,
          loading: false
        });
      },
      (error) => {
        setState({
          location: null,
          locationName: null,
          error: error.message,
          loading: false
        });
      }
    );


    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const locationName = await getLocationName(lat, lng);

        localStorage.setItem('lastLocation', JSON.stringify({
          lat,
          lng,
          address: locationName
        }));
        
        setState({
          location: { lat, lng },
          locationName,
          error: null,
          loading: false
        });
      },
      (error) => {
        setState({
          location: null,
          locationName: null,
          error: error.message,
          loading: false
        });
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};

export default useGeolocation;
