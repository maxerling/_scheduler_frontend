interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  bookedAppointments: BookingAppointment[];
  date: string;
}
