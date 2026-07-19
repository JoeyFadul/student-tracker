// Sample classroom data for the UI kit demo.
const WD_STUDENTS = [
  { id: 's1', name: 'Maya Rodriguez', photo: '🦊', points: 128, streak: 6, createdAt: '9' },
  { id: 's2', name: 'Leo Kim', photo: '🐢', points: 114, streak: 0, createdAt: '8' },
  { id: 's3', name: 'Ana Whitfield', photo: '🌟', points: 96, streak: 3, createdAt: '7' },
  { id: 's4', name: 'Dominic Okafor', photo: '', points: 91, streak: 0, createdAt: '6' },
  { id: 's5', name: 'Priya Natarajan', photo: '🦋', points: 87, streak: 2, createdAt: '5' },
  { id: 's6', name: 'Sam Alvarez', photo: '🐸', points: 73, streak: 0, createdAt: '4' },
  { id: 's7', name: 'June Park', photo: '🐰', points: 62, streak: 4, createdAt: '3' },
  { id: 's8', name: 'Theo Brandt', photo: '', points: 41, streak: 0, createdAt: '2' },
];
const WD_ACTIVITY = {
  s1: [
    { reason: 'Kindness', delta: 5, when: 'Today' },
    { reason: 'Participation', delta: 2, when: 'Today' },
    { reason: 'Helping', delta: 1, when: 'Yesterday' },
    { reason: 'Talking during quiet time', delta: -1, when: 'Yesterday' },
    { reason: 'Homework', delta: 2, when: '3 days ago' },
    { reason: 'Teamwork', delta: 5, when: 'Jan 12' },
  ],
};
const WD_REASONS = ['Kindness', 'Effort', 'Helping', 'Homework', 'Participation', 'Listening', 'Cleanup', 'Teamwork'];
const WD_TOP_REASONS = [
  { reason: 'Effort', count: 42 }, { reason: 'Kindness', count: 35 },
  { reason: 'Participation', count: 28 }, { reason: 'Homework', count: 19 }, { reason: 'Teamwork', count: 12 },
];
Object.assign(window, { WD_STUDENTS, WD_ACTIVITY, WD_REASONS, WD_TOP_REASONS });
