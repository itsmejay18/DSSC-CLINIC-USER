// Sample data for medical and drug history
const sampleMedicalHistory = [
    {
        id: 1,
        date: "2025-01-15",
        service: "General Checkup",
        notes: "Regular health assessment - all vitals normal",
        status: "Completed"
    },
    {
        id: 2,
        date: "2025-01-10",
        service: "Blood Test",
        notes: "Complete blood count - results within normal range",
        status: "Completed"
    },
    {
        id: 3,
        date: "2025-01-05",
        service: "Dental Cleaning",
        notes: "Routine cleaning, no cavities found",
        status: "Completed"
    },
    {
        id: 4,
        date: "2024-12-20",
        service: "Follow-up",
        notes: "Mild fever monitoring - temperature normalized",
        status: "Completed"
    },
    {
        id: 5,
        date: "2024-12-15",
        service: "Vaccination",
        notes: "Flu shot administered - no adverse reactions",
        status: "Completed"
    },
    {
        id: 6,
        date: "2024-12-01",
        service: "General Checkup",
        notes: "Annual physical examination - healthy status",
        status: "Completed"
    }
];

const sampleDrugHistory = [
    {
        id: 1,
        drug_name: "Paracetamol",
        brand: "Biogesic",
        issued_by: "Nurse Santos",
        date: "2025-01-12",
        dosage: "500mg",
        quantity: "10 tablets"
    },
    {
        id: 2,
        drug_name: "Ibuprofen",
        brand: "Advil",
        issued_by: "Dr. Rodriguez",
        date: "2025-01-08",
        dosage: "200mg",
        quantity: "20 tablets"
    },
    {
        id: 3,
        drug_name: "Amoxicillin",
        brand: "Amoxil",
        issued_by: "Dr. Chen",
        date: "2024-12-28",
        dosage: "250mg",
        quantity: "21 capsules"
    },
    {
        id: 4,
        drug_name: "Cetirizine",
        brand: "Zyrtec",
        issued_by: "Nurse Martinez",
        date: "2024-12-20",
        dosage: "10mg",
        quantity: "7 tablets"
    },
    {
        id: 5,
        drug_name: "Vitamin C",
        brand: "Centrum",
        issued_by: "Pharmacist Lee",
        date: "2024-12-15",
        dosage: "500mg",
        quantity: "30 tablets"
    },
    {
        id: 6,
        drug_name: "Omeprazole",
        brand: "Losec",
        issued_by: "Dr. Johnson",
        date: "2024-12-10",
        dosage: "20mg",
        quantity: "14 capsules"
    }
];

// Default student profile data
const defaultProfile = {
    studentName: "Juan Dela Cruz",
    studentId: "2021-12345",
    program: "Computer Science",
    department: "Information Technology",
    email: "juan.delacruz@dssc.edu.ph",
    phone: "+63 912 345 6789",
    profilePicture: null,
    drugTest: true,
    bloodTyping: true,
    cvc: false
};