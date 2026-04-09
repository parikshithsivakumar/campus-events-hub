import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../services/api';

const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  location: z.string().min(1, 'Location is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  building: z.string().optional(),
  floor: z.string().optional(),
  description: z.string().optional(),
});

type VenueForm = z.infer<typeof venueSchema>;

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVenueAdded: () => void;
}

export default function AddVenueModal({ isOpen, onClose, onVenueAdded }: AddVenueModalProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [facilitiesInput, setFacilitiesInput] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<VenueForm>({
    resolver: zodResolver(venueSchema),
  });

  const onSubmit = async (data: VenueForm) => {
    try {
      setError('');
      setIsLoading(true);

      await api.post('/venues', {
        ...data,
        facilities,
        amenities,
      });

      reset();
      setFacilities([]);
      setAmenities([]);
      setFacilitiesInput('');
      setAmenitiesInput('');
      onVenueAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add venue');
    } finally {
      setIsLoading(false);
    }
  };

  const addFacility = () => {
    if (facilitiesInput.trim()) {
      setFacilities([...facilities, facilitiesInput.trim()]);
      setFacilitiesInput('');
    }
  };

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (amenitiesInput.trim()) {
      setAmenities([...amenities, amenitiesInput.trim()]);
      setAmenitiesInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Venue</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          {error && <div className="auth-error">{error}</div>}

          {/* Venue Name */}
          <Input
            label="Venue Name"
            placeholder="e.g., Main Auditorium"
            {...register('name')}
            error={errors.name?.message}
          />

          {/* Location */}
          <Input
            label="Location"
            placeholder="e.g., Building A, Main Campus"
            {...register('location')}
            error={errors.location?.message}
          />

          {/* Capacity */}
          <Input
            label="Capacity"
            type="number"
            placeholder="e.g., 500"
            {...register('capacity')}
            error={errors.capacity?.message}
          />

          {/* Building */}
          <Input
            label="Building (Optional)"
            placeholder="e.g., Building A"
            {...register('building')}
          />

          {/* Floor */}
          <Input
            label="Floor (Optional)"
            placeholder="e.g., 3rd Floor"
            {...register('floor')}
          />

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              {...register('description')}
              placeholder="Add details about the venue..."
              className="textarea-input"
              rows={3}
            />
          </div>

          {/* Facilities */}
          <div className="form-group">
            <label className="form-label">Facilities</label>
            <div className="input-with-button">
              <input
                type="text"
                value={facilitiesInput}
                onChange={(e) => setFacilitiesInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                placeholder="e.g., Wi-Fi, Projector"
                className="input-field"
              />
              <Button onClick={addFacility} type="button" className="btn-small">
                Add
              </Button>
            </div>
            <div className="tags-container">
              {facilities.map((facility, idx) => (
                <span key={idx} className="tag">
                  {facility}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => removeFacility(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div className="input-with-button">
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="e.g., Parking, Restroom"
                className="input-field"
              />
              <Button onClick={addAmenity} type="button" className="btn-small">
                Add
              </Button>
            </div>
            <div className="tags-container">
              {amenities.map((amenity, idx) => (
                <span key={idx} className="tag">
                  {amenity}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => removeAmenity(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <Button
              onClick={onClose}
              type="button"
              style={{ background: '#6c757d', color: 'white' }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Venue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
