import React, { useEffect, useState } from "react";
import { DestinationFormData } from "@/types/Destination";
import { useDestinations } from "@/hooks/useDestinations";
import AddorModifyJourney from "./AddorModifyJourney";

export default function Journey() {
  const [showAddJourney, setShowAddJourney] = useState(false);
  const [showModifyJourney, setShowModifyJourney] = useState(false);
  const [selectedJourney, setSelectedJourney] =
    useState<DestinationFormData | null>(null);
    const { destinations, error, isLoading, mutate } = useDestinations();


  useEffect(() => {
    if (destinations) {
      console.log('Destinations:', destinations);
    }
  }, [destinations]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journey?")) {
      return;
    }
  
    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.ok) {
        // Refresh destinations data
        await mutate();
      } else {
        throw new Error("Failed to delete journey");
      }
    } catch (error) {
      console.error("Error deleting journey:", error);
      // Optionally add error state handling here
    }
  };

  const handleAddJourney = () => {
    setShowAddJourney(true);
  };

  const handleEdit = (journey: DestinationFormData) => {
    setSelectedJourney(journey);
    setShowModifyJourney(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading destinations</div>;

  return (
    <div className="auth-form w-full p-1">
      {showAddJourney ? (
        <AddorModifyJourney onClose={() => setShowAddJourney(false)} mode="create" />
    ) : showModifyJourney ? (
        <AddorModifyJourney 
          onClose={() => {
            setShowModifyJourney(false);
            setSelectedJourney(null);
          }}
          mode="modify"
          journeyToModify={selectedJourney || undefined}
        />
      ) : (
        <>
          <div className="border-b-2 border-bt-modal py-2 flex justify-between items-center">
            <div className="flex-1" />
            <h2 className="text-xl font-bold flex-1 text-center">
              My Journeys
            </h2>
            <div className="flex-1 flex justify-end">
              <button
                className="mr-4 w-8 h-8 flex items-center justify-center hover:text-white transition-colors bg-var(--mocha-mousse)"
                onClick={() => handleAddJourney()}
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div>
            {destinations?.map((destination: DestinationFormData) => (
              <div
                key={destination.id}
                className="py-2 px-4 border border-gray-200  transition-all duration-300 hover:border-gray-500 text-sm"
              >
                <div className="flex items-center justify-between space-x-4">
                  <h3 className="font-bold w-1/4">{destination.title}</h3>
                  <p className="text-gray-600 w-1/4">
                    {destination.city}, {destination.country}
                  </p>
                  <span className="text-mocha-mousse font-bold py-1 rounded w-20 text-center">
                    Note: {destination.globalScore}/5
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(destination)}
                      className="p-2 text-blue-600 hover:text-white "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(destination.id)}
                      className="p-2 text-red-600 hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
