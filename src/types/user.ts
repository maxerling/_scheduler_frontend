interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  role: string;
  isActive: boolean;
  bookedAppointments: Event[];
  date: string;
}
