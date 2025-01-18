import React, { useState, useEffect } from "react";
import Input from "@/components/Commons/Input";
import Button from "@/components/Commons/Button";
import { useSession } from "next-auth/react";
import { useDestinations } from "@/hooks/useDestinations";
import { DestinationFormData } from "@/types/Destination";

interface Destination {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface AddorModifyJourneyProps {
  onClose: () => void;
  mode?: "create" | "modify";
  journeyToModify?: DestinationFormData;
}

export default function AddorModifyJourney({
  onClose,
  mode = "create",
  journeyToModify,
}: AddorModifyJourneyProps) {
  const [possibleDestinations, setPossibleDestinations] = useState<
    Destination[]
  >([]);
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [formData, setFormData] = useState<DestinationFormData>({
    id: "",
    latitude: "",
    longitude: "",
    city: "",
    country: "",
    title: "",
    review: "",
    globalScore: "",
    description: "",
  });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const { data: session } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { mutate } = useDestinations();
  // Fetch possible destinations from the API
  useEffect(() => {
    async function fetchPossibleDestinations() {
      const res = await fetch("/api/possibleDestination");
      const data = await res.json();
      setPossibleDestinations(data);
    }
    fetchPossibleDestinations();
  }, []);

  // Populate form when modifying
  useEffect(() => {
    if (mode === "modify" && journeyToModify) {
      setFormData(journeyToModify);
      setSelectedDestination(journeyToModify.id);
    }
  }, [mode, journeyToModify]);

  // Handle form Input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle predefined destination selection
  const handlePredefinedSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const destinationId = e.target.value;

    setSelectedDestination(destinationId);

    if (destinationId) {
      const destination = possibleDestinations.find(
        (dest) => dest.id === destinationId
      );

      if (destination) {
        setFormData((prev) => ({
          ...prev,
          latitude: destination.latitude.toString(), // Convert to string if needed
          longitude: destination.longitude.toString(),
          city: destination.city,
          country: destination.country,
        }));
      }
    } else {
      // Reset fields if no predefined destination is selected
      setFormData((prev) => ({
        ...prev,
        latitude: "",
        longitude: "",
        city: "",
        country: "",
      }));
    }
  };

  // Submit form data to the API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      setError("You must be logged in to add a destination");
      return;
    }

    setIsLoadingSave(true);
    setError(null);
    setSuccess(null);

    try {
      console.log(formData);
      const res = await fetch(`/api/destinations${mode === 'modify' ? `/${formData.id}` : ''}`, {
        method: mode === "modify" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          id: "",
          latitude: "",
          longitude: "",
          city: "",
          country: "",
          title: "",
          review: "",
          globalScore: "",
          description: "",
        });
        setSelectedDestination("");
        setSuccess(
          mode === "modify"
            ? "Journey updated successfully!"
            : "Journey added successfully!"
        );
        mutate();
      }
    } catch (error) {
      console.error(
        `Error ${mode === "modify" ? "updating" : "saving"} journey:`,
        error
      );
      setError("An unexpected error occurred." + error);
    }
    setIsLoadingSave(false);
  };

  const handleGlobalScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Retire tout sauf les chiffres (0-9)
    let value = e.target.value;
    value = value.slice(0, 1);

    // Vérifie que c'est vide (l'utilisateur supprime tout) ou entre 0 et 5
    if (
      value === "" ||
      (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 5)
    ) {
      setFormData((prev) => ({
        ...prev,
        globalScore: value,
      }));
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (
      value === "" ||
      (!isNaN(numValue) && numValue >= -180 && numValue <= 180)
    ) {
      handleInputChange(e);
    }
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (
      value === "" ||
      (!isNaN(numValue) && numValue >= -90 && numValue <= 90)
    ) {
      handleInputChange(e);
    }
  };

  return (
    <div className="auth-form w-full text-center">
      <div className="border-b-2 border-bt-modal py-2 flex justify-between items-center">
        <div className="flex-1" />
        <h2 className="text-xl font-bold flex-2 text-center">
          {mode === 'modify' ? 'Modify Journey' : 'Add Journey'}
        </h2>
        <div className="flex-1 flex justify-end">
          <button
            className="mr-2 w-8 h-8 flex items-center justify-center hover:text-white transition-colors bg-var(--color-mocha-mousse)"
            onClick={() => onClose()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 text-sm">
        {/* Predefined destinations */}
        {possibleDestinations.length !== 0 ? (
          <div className="flex flex-col">
            <label htmlFor="predefinedDestination">Select a destination:</label>
            <select
              id="predefinedDestination"
              value={selectedDestination}
              onChange={handlePredefinedSelection}
              className="text-center m-1 border border-gray-300 rounded-md p-2"
            >
              <option value="">-- Select --</option>
              {possibleDestinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.city}, {dest.country}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>Loading destinations...</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* City and Country */}
          <div>
            <Input
              id="city"
              label="City"
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Input
              id="country"
              label="Country"
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Latitude and Longitude */}
          <div>
            <Input
              id="latitude"
              label="Latitude"
              type="number"
              name="latitude"
              value={formData.latitude || ""}
              onChange={handleLatitudeChange}
              required
            />
          </div>
          <div>
            <Input
              id="longitude"
              label="Longitude"
              type="number"
              name="longitude"
              value={formData.longitude || ""}
              onChange={handleLongitudeChange}
              required
            />
          </div>
        </div>

        {/* The rest remains unchanged */}
        <div>
          <Input
            id="title"
            label="Title"
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <textarea
            name="review"
            value={formData.review || ""}
            placeholder="Enter a review, the good and the bad"
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div>
          <Input
            id="globalScore"
            label="Global Score (out of 5)"
            type="number"
            name="globalScore"
            value={formData.globalScore || ""}
            onChange={handleGlobalScoreChange}
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Enter a description"
            value={formData.description || ""}
            onChange={handleInputChange}
          ></textarea>
        </div>
        {error && (
          <div>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div>
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}
        <div>
          <Button type="submit" variant="primary" disabled={isLoadingSave}>
            {isLoadingSave ? (
              <div className="loader mx-auto"></div>
            ) : mode === "modify" ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
