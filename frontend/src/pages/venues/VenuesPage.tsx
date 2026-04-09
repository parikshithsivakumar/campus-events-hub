import Card from '../../components/ui/Card';
import { useVenuesData } from '../../hooks/useDashboardData';

export default function VenuesPage() {
  const { data: venues = [] } = useVenuesData();

  return (
    <div className="grid-layout">
      <Card title="Venue Calendar" subtitle="Morning / Afternoon / Evening slot availability">
        <div className="venue-grid">
          {venues.map((venue: any) => (
            <article key={venue.id} className="venue-card">
              <header>
                <h4>{venue.name}</h4>
                <span>{venue.capacity} seats</span>
              </header>
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
      </Card>
    </div>
  );
}
