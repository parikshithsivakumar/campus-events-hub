import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AddVenueModal from '../../components/AddVenueModal';
import EditVenueModal from '../../components/EditVenueModal';
import DeleteVenueModal from '../../components/DeleteVenueModal';
import RoleGuard from '../../components/RoleGuard';
import { useVenuesData } from '../../hooks/useDashboardData';
import { useAuthStore } from '../../store/authStore';

export default function VenuesPage() {
  const { data: venues = [] } = useVenuesData();
  const { user } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isAdmin = user?.role === 'COLLEGE_ADMIN';

  const handleVenueAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditClick = (venue: any) => {
    setSelectedVenue(venue);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (venue: any) => {
    setSelectedVenue(venue);
    setIsDeleteModalOpen(true);
  };

  const handleVenueUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleVenueDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <RoleGuard roles={['COLLEGE_ADMIN', 'SUPER_ADMIN']}>
      <div className="grid-layout">
      {/* Header with Add Venue Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Venues Management</h1>
        {isAdmin && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            style={{ background: 'linear-gradient(135deg, #1f7a5d, #159a6f)' }}
          >
            + Add Venue
          </Button>
        )}
      </div>

      {/* Venues Grid */}
      <Card title="Venue Calendar" subtitle="Morning / Afternoon / Evening slot availability">
        {venues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            <p>No venues added yet. {isAdmin && 'Click "Add Venue" to create one.'}</p>
          </div>
        ) : (
          <div className="venue-grid">
            {venues.map((venue: any) => (
              <article key={venue.id} className="venue-card">
                <header>
                  <div>
                    <h4>{venue.name}</h4>
                    <span className="venue-capacity">📍 {venue.capacity} seats</span>
                  </div>
                  {isAdmin && (
                    <div className="venue-card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditClick(venue)}
                        style={{
                          background: '#1976d2',
                          border: 'none',
                          cursor: 'pointer',
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#1565c0';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#1976d2';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                        }}
                        title="Edit venue"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(venue)}
                        style={{
                          background: '#d32f2f',
                          border: 'none',
                          cursor: 'pointer',
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#b71c1c';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#d32f2f';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                        }}
                        title="Delete venue"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  )}
                </header>

                {/* Venue Details */}
                <div className="venue-details">
                  {venue.location && (
                    <div className="venue-detail-item">
                      <strong>Location:</strong> {venue.location}
                    </div>
                  )}
                  {venue.building && (
                    <div className="venue-detail-item">
                      <strong>Building:</strong> {venue.building}
                    </div>
                  )}
                  {venue.floor && (
                    <div className="venue-detail-item">
                      <strong>Floor:</strong> {venue.floor}
                    </div>
                  )}
                  {venue.description && (
                    <div className="venue-detail-item">
                      <strong>Description:</strong> {venue.description}
                    </div>
                  )}
                </div>

                {/* Facilities & Amenities */}
                {(venue.facilities?.length > 0 || venue.amenities?.length > 0) && (
                  <div className="venue-tags">
                    {venue.facilities?.map((facility: string, idx: number) => (
                      <span key={`fac-${idx}`} className="tag facilities-tag">
                        {facility}
                      </span>
                    ))}
                    {venue.amenities?.map((amenity: string, idx: number) => (
                      <span key={`amen-${idx}`} className="tag amenities-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Slots */}
                <div className="slot-header">
                  <span>Day</span>
                  <span>M</span>
                  <span>A</span>
                  <span>E</span>
                </div>
                {venue.slots?.map((slot: any) => (
                  <div className="slot-row" key={`${venue.id}-${slot.day}`}>
                    <span>{slot.day}</span>
                    {slot.blocks.map((block: string, idx: number) => (
                      <i key={idx} className={block === 'FREE' ? 'slot-free' : 'slot-booked'} />
                    ))}
                  </div>
                ))}
              </article>
            ))}
          </div>
        )}
      </Card>

      {/* Modals */}
      <AddVenueModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVenueAdded={handleVenueAdded}
      />

      <EditVenueModal
        isOpen={isEditModalOpen}
        venue={selectedVenue}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVenue(null);
        }}
        onVenueUpdated={handleVenueUpdated}
      />

      <DeleteVenueModal
        isOpen={isDeleteModalOpen}
        venue={selectedVenue}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedVenue(null);
        }}
        onVenueDeleted={handleVenueDeleted}
      />
      </div>
    </RoleGuard>
  );
}
