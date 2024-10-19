import { Button } from '@/components/ui/button';

interface AvailableSlotsProps {
    availableSlots: string[];
    selectedSlot: string;
    onSelectSlot: (slot: string) => void;
    onBook: () => void;
}

const AvailableSlots: React.FC<AvailableSlotsProps> = ({ availableSlots, selectedSlot, onSelectSlot, onBook }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Time Slots</h2>
            {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {availableSlots.map((slot, index) => (
                        <Button
                            type='button'
                            key={index}
                            variant={selectedSlot === slot ? 'default' : 'outline'}
                            onClick={() => onSelectSlot(slot)}
                        >
                            {slot}
                        </Button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No available slots for the selected date.</p>
            )}
            {selectedSlot && availableSlots.length > 0 &&(
                <Button type='submit' className="mt-8 w-full" onClick={onBook}>
                    Book Appointment
                </Button>
            )}
        </div>
    );
};

export default AvailableSlots;
