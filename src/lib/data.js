import { faker } from "@faker-js/faker";

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

export const generateStudents = () => {
  return Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    department: faker.helpers.arrayElement(departments),
    enrollmentDate: faker.date.past({ years: 2 }),
    stars: faker.number.int({ min: 1, max: 5 }),
    performance: {
      attendance: faker.number.int({ min: 70, max: 100 }),
      assignments: faker.number.int({ min: 65, max: 100 }),
      exams: faker.number.int({ min: 60, max: 100 }),
    },
  }));
};

export const starMessages = {
  1: "Keep pushing forward! There's room for growth.",
  2: "Good progress! Continue your dedication to excellence.",
  3: "Impressive performance! You're on the right track.",
  4: "Outstanding achievement! Your hard work shines through.",
  5: "Exceptional excellence! You've set the bar high.",
};
