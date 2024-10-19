import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dentist } from '@/lib/types';

interface DentistSelectorProps {
    dentists: Dentist[] | undefined;
    onSelect: (value: Dentist) => void; // Change to Dentist type
}

const DentistSelector: React.FC<DentistSelectorProps> = ({ dentists, onSelect }) => {
    return (
        <Select onValueChange={(value) => {
            const selectedDentist = dentists?.find(dentist => dentist._id === value);
            if (selectedDentist) {
                onSelect(selectedDentist); // Pass the entire dentist object
            }
        }}>
            <SelectTrigger>
                <SelectValue placeholder="Choose a dentist" />
            </SelectTrigger>
            <SelectContent>
                {dentists?.map((dentist) => (
                    <SelectItem key={dentist._id} value={dentist._id}>
                        {dentist.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default DentistSelector;
