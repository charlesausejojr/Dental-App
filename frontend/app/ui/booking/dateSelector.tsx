import { Calendar } from '@/components/ui/calendar';

interface DateSelectorProps {
    selectedDate: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            className="rounded-md border w-full h-full flex"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
    );
};

export default DateSelector;
