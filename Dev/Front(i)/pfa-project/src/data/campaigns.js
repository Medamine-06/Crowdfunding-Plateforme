
const schoolImage = '/assets/school.webp';
const medicalAidImage = '/assets/medical.jpg';
const cleanWaterImage = '/assets/clean.jpg'

const campaigns = [
  {
    id: 1,
    title: "Help Build a School",
    image: schoolImage,
    description: "Support education for underprivileged children.",
    raised: 4000,
    goal: 10000
  },
  {
    id: 2,
    title: "Medical Aid for Refugees",
    image: medicalAidImage,
    description: "Providing essential healthcare for displaced families.",
    raised: 7500,
    goal: 15000
  },
  {
    id: 3,
    title: "Clean Water Initiative",
    image: cleanWaterImage,
    description: "Ensuring access to clean drinking water in rural areas.",
    raised: 3000,
    goal: 5000
  }
];


export default campaigns;
