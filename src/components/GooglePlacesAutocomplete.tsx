import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Input } from './ui/input';
import { MapPin } from 'lucide-react';

interface PlaceDetails {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyASz6Gqa5Oa3WialPx7Z6ebZTj02Liw-Gk';

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = "Search for address...",
  className = "",
  value = ""
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        setIsLoaded(true);

        if (inputRef.current) {
          // Initialize autocomplete with India bias
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              componentRestrictions: { country: 'IN' },
              fields: [
                'address_components',
                'formatted_address',
                'geometry',
                'name'
              ],
              types: ['address']
            }
          );

          // Add place changed listener
          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.geometry && place.geometry.location) {
              const placeDetails = extractPlaceDetails(place);
              onPlaceSelect(placeDetails);
              setInputValue(placeDetails.formattedAddress);
            }
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const extractPlaceDetails = (place: google.maps.places.PlaceResult): PlaceDetails => {
  const components = place.address_components || [];
  let street = '';
  let area = '';
  let city = '';
  let state = '';
  let pincode = '';
  let country = '';

  components.forEach((component) => {
    const types = component.types;

    if (types.includes('street_number')) {
      street = component.long_name + ' ';
    }
    if (types.includes('route')) {
      street += component.long_name;
    }
    if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
      area = component.long_name;
    }
    if (types.includes('locality')) {
      city = component.long_name;
    }
    if (types.includes('postal_town') && !city) {
      city = component.long_name;
    }
    if (types.includes('administrative_area_level_2') && !city) {
      city = component.long_name;
    }
    if (types.includes('administrative_area_level_1')) {
      state = component.long_name;
    }
    if (types.includes('postal_code')) {
      pincode = component.long_name;
    }
    if (types.includes('country')) {
      country = component.long_name;
    }
  });

  if (!area) {
    const sublocalityLevel2 = components.find(c => c.types.includes('sublocality_level_2'));
    const sublocalityLevel3 = components.find(c => c.types.includes('sublocality_level_3'));
    const neighborhood = components.find(c => c.types.includes('neighborhood'));

    area = sublocalityLevel2?.long_name || sublocalityLevel3?.long_name || neighborhood?.long_name || '';
  }

  return {
    street: street.trim(),
    area,
    city,
    state,
    pincode,
    country,
    latitude: place.geometry?.location?.lat() || 0,
    longitude: place.geometry?.location?.lng() || 0,
    formattedAddress: place.formatted_address || ''
  };
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={isLoaded ? placeholder : "Loading Google Places..."}
          className={`pl-10 ${className}`}
          disabled={!isLoaded}
        />
      </div>
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;